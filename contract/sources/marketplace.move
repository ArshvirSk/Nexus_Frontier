module syndicate_addr::marketplace {
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use syndicate_addr::agent::{Self, Agent};
    use syndicate_addr::territory::{Self, Territory};

    /// Error codes
    const EINVALID_PRICE: u64 = 1;
    const ELISTING_NOT_FOUND: u64 = 2;
    const EINVALID_SELLER: u64 = 3;
    const EINSUFFICIENT_BALANCE: u64 = 4;
    const EINVALID_ASSET_TYPE: u64 = 5;

    /// Asset types that can be traded
    const ASSET_TYPE_AGENT: u8 = 1;
    const ASSET_TYPE_TERRITORY: u8 = 2;
    const ASSET_TYPE_RESOURCE: u8 = 3;

    /// Represents a marketplace listing
    struct Listing has store {
        id: u64,
        seller: address,
        asset_type: u8,
        asset_id: u64,
        price: u64,
        timestamp: u64,
    }

    /// Marketplace state
    struct Marketplace has key {
        listings: vector<Listing>,
        listing_counter: u64,
    }

    /// Events
    struct ListingCreatedEvent has drop, store {
        listing_id: u64,
        seller: address,
        asset_type: u8,
        asset_id: u64,
        price: u64,
        timestamp: u64,
    }

    struct AssetSoldEvent has drop, store {
        listing_id: u64,
        seller: address,
        buyer: address,
        asset_type: u8,
        asset_id: u64,
        price: u64,
        timestamp: u64,
    }

    struct ListingCanceledEvent has drop, store {
        listing_id: u64,
        seller: address,
        timestamp: u64,
    }

    /// Initialize the marketplace
    public fun initialize(account: &signer) {
        move_to(account, Marketplace {
            listings: vector::empty<Listing>(),
            listing_counter: 0,
        });
    }

    /// Create a new listing
    public fun create_listing(
        account: &signer,
        asset_type: u8,
        asset_id: u64,
        price: u64,
    ) acquires Marketplace {
        assert!(
            asset_type == ASSET_TYPE_AGENT || 
            asset_type == ASSET_TYPE_TERRITORY || 
            asset_type == ASSET_TYPE_RESOURCE,
            error::invalid_argument(EINVALID_ASSET_TYPE)
        );
        assert!(price > 0, error::invalid_argument(EINVALID_PRICE));

        let marketplace = borrow_global_mut<Marketplace>(@syndicate_addr);
        let listing_id = marketplace.listing_counter + 1;
        
        let listing = Listing {
            id: listing_id,
            seller: signer::address_of(account),
            asset_type,
            asset_id,
            price,
            timestamp: timestamp::now_seconds(),
        };

        vector::push_back(&mut marketplace.listings, listing);
        marketplace.listing_counter = listing_id;

        // Emit listing created event
        event::emit(ListingCreatedEvent {
            listing_id,
            seller: signer::address_of(account),
            asset_type,
            asset_id,
            price,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Purchase an asset from a listing
    public fun purchase_listing(
        account: &signer,
        listing_id: u64,
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(@syndicate_addr);
        let listing_opt = find_listing_by_id_mut(&mut marketplace.listings, listing_id);
        assert!(listing_opt.is_some(), error::not_found(ELISTING_NOT_FOUND));

        let listing = listing_opt.value();
        let buyer_addr = signer::address_of(account);
        assert!(listing.seller != buyer_addr, error::invalid_argument(EINVALID_SELLER));

        // Handle the transfer based on asset type
        if (listing.asset_type == ASSET_TYPE_AGENT) {
            // Transfer agent ownership
            agent::transfer_agent(listing.seller, buyer_addr, listing.asset_id);
        } else if (listing.asset_type == ASSET_TYPE_TERRITORY) {
            // Transfer territory ownership
            territory::transfer_territory(listing.seller, buyer_addr, listing.asset_id);
        } else if (listing.asset_type == ASSET_TYPE_RESOURCE) {
            // Transfer resources
            // Implementation depends on resource system
        };

        // Transfer payment
        // Note: Actual implementation would use Aptos Coin module
        // coin::transfer<AptosCoin>(buyer, seller, listing.price);

        // Emit sale event
        event::emit(AssetSoldEvent {
            listing_id: listing.id,
            seller: listing.seller,
            buyer: buyer_addr,
            asset_type: listing.asset_type,
            asset_id: listing.asset_id,
            price: listing.price,
            timestamp: timestamp::now_seconds(),
        });

        // Remove the listing
        remove_listing(listing_id);
    }

    /// Cancel a listing
    public fun cancel_listing(
        account: &signer,
        listing_id: u64,
    ) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(@syndicate_addr);
        let listing_opt = find_listing_by_id(&marketplace.listings, listing_id);
        assert!(listing_opt.is_some(), error::not_found(ELISTING_NOT_FOUND));

        let listing = listing_opt.value();
        assert!(listing.seller == signer::address_of(account), error::permission_denied(EINVALID_SELLER));

        // Emit cancellation event
        event::emit(ListingCanceledEvent {
            listing_id,
            seller: listing.seller,
            timestamp: timestamp::now_seconds(),
        });

        remove_listing(listing_id);
    }

    /// Remove a listing from the marketplace
    fun remove_listing(listing_id: u64) acquires Marketplace {
        let marketplace = borrow_global_mut<Marketplace>(@syndicate_addr);
        let (found, index) = find_listing_index(&marketplace.listings, listing_id);
        if (found) {
            vector::remove(&mut marketplace.listings, index);
        };
    }

    /// Helper function to find a listing by ID
    fun find_listing_by_id_mut(listings: &mut vector<Listing>, id: u64): Option<&mut Listing> {
        let i = 0;
        let len = vector::length(listings);
        while (i < len) {
            let listing = vector::borrow_mut(listings, i);
            if (listing.id == id) {
                return some(listing)
            };
            i = i + 1;
        };
        none
    }

    fun find_listing_by_id(listings: &vector<Listing>, id: u64): Option<&Listing> {
        let i = 0;
        let len = vector::length(listings);
        while (i < len) {
            let listing = vector::borrow(listings, i);
            if (listing.id == id) {
                return some(listing)
            };
            i = i + 1;
        };
        none
    }

    fun find_listing_index(listings: &vector<Listing>, id: u64): (bool, u64) {
        let i = 0;
        let len = vector::length(listings);
        while (i < len) {
            let listing = vector::borrow(listings, i);
            if (listing.id == id) {
                return (true, i)
            };
            i = i + 1;
        };
        (false, 0)
    }

    #[test_only]
    public fun initialize_for_testing(account: &signer) {
        initialize(account);
    }
}
