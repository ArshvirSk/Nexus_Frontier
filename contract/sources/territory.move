module syndicate_addr::territory {
    use std::error;
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    /// Resource generation interval in seconds
    const RESOURCE_GENERATION_INTERVAL: u64 = 3600; // 1 hour

    /// Error codes
    const EINVALID_TERRITORY_ID: u64 = 1;
    const ETERRITORY_ALREADY_CLAIMED: u64 = 2;
    const ETERRITORY_NOT_FOUND: u64 = 3;
    const EINVALID_DEVELOPMENT_LEVEL: u64 = 4;
    const EINSUFFICIENT_RESOURCES: u64 = 5;
    const EINVALID_OWNER: u64 = 6;
    const ETRANSFER_NOT_ALLOWED: u64 = 7;

    /// Represents a territory's coordinates on the hex grid
    struct HexCoord has copy, drop, store {
        q: i8, // axial coordinate q
        r: i8, // axial coordinate r
    }

    /// Represents a territory in the game
    struct Territory has store {
        id: u64,
        coord: HexCoord,
        owner: address,
        resources: u64,
        last_collection: u64,
        development_level: u8,
        resource_rate: u64,
        transferable: bool, // Whether this territory can be transferred
    }

    /// Represents all territories in the game
    struct Territories has key {
        territories: vector<Territory>,
        territory_counter: u64,
    }

    /// Events
    struct TerritoryClaimedEvent has drop, store {
        territory_id: u64,
        claimer: address,
        timestamp: u64,
    }

    struct ResourcesCollectedEvent has drop, store {
        territory_id: u64,
        owner: address,
        amount: u64,
        timestamp: u64,
    }

    struct TerritoryDevelopedEvent has drop, store {
        territory_id: u64,
        owner: address,
        new_level: u8,
        timestamp: u64,
    }

    struct TerritoryTransferredEvent has drop, store {
        territory_id: u64,
        from: address,
        to: address,
        timestamp: u64,
    }

    /// Initialize the territory system
    public fun initialize(account: &signer) {
        let territories = vector::empty<Territory>();
        move_to(account, Territories {
            territories,
            territory_counter: 0,
        });
    }

    /// Create a new territory at specified coordinates
    public fun create_territory(
        account: &signer,
        q: i8,
        r: i8,
    ) acquires Territories {
        let territories = borrow_global_mut<Territories>(@syndicate_addr);
        let territory_id = territories.territory_counter + 1;
        
        let territory = Territory {
            id: territory_id,
            coord: HexCoord { q, r },
            owner: @syndicate_addr, // Initially owned by the system
            resources: 0,
            last_collection: timestamp::now_seconds(),
            development_level: 1,
            resource_rate: 10, // Base resource generation rate
            transferable: true, // New territories are transferable by default
        };

        vector::push_back(&mut territories.territories, territory);
        territories.territory_counter = territory_id;
    }

    /// Claim an unclaimed territory
    public fun claim_territory(
        account: &signer,
        territory_id: u64,
    ) acquires Territories {
        let territories = borrow_global_mut<Territories>(@syndicate_addr);
        let territory_opt = find_territory_by_id_mut(&mut territories.territories, territory_id);
        assert!(territory_opt.is_some(), error::not_found(ETERRITORY_NOT_FOUND));
        
        let territory = territory_opt.value_mut();
        assert!(territory.owner == @syndicate_addr, error::invalid_state(ETERRITORY_ALREADY_CLAIMED));

        territory.owner = signer::address_of(account);

        // Emit claim event
        event::emit(TerritoryClaimedEvent {
            territory_id,
            claimer: signer::address_of(account),
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Transfer territory ownership
    public fun transfer_territory(
        from: address,
        to: address,
        territory_id: u64,
    ) acquires Territories {
        let territories = borrow_global_mut<Territories>(@syndicate_addr);
        let territory_opt = find_territory_by_id_mut(&mut territories.territories, territory_id);
        assert!(territory_opt.is_some(), error::not_found(ETERRITORY_NOT_FOUND));
        
        let territory = territory_opt.value_mut();
        assert!(territory.owner == from, error::permission_denied(EINVALID_OWNER));
        assert!(territory.transferable, error::invalid_state(ETRANSFER_NOT_ALLOWED));

        // Update ownership
        territory.owner = to;

        // Reset resource collection timer
        territory.last_collection = timestamp::now_seconds();

        // Emit transfer event
        event::emit(TerritoryTransferredEvent {
            territory_id,
            from,
            to,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Set territory transferability
    public fun set_transferable(
        account: &signer,
        territory_id: u64,
        transferable: bool,
    ) acquires Territories {
        let territories = borrow_global_mut<Territories>(@syndicate_addr);
        let territory_opt = find_territory_by_id_mut(&mut territories.territories, territory_id);
        assert!(territory_opt.is_some(), error::not_found(ETERRITORY_NOT_FOUND));
        
        let territory = territory_opt.value_mut();
        assert!(territory.owner == signer::address_of(account), error::permission_denied(EINVALID_OWNER));

        territory.transferable = transferable;
    }

    /// Collect resources from a territory
    public fun collect_resources(
        account: &signer,
        territory_id: u64,
    ): u64 acquires Territories {
        let territories = borrow_global_mut<Territories>(@syndicate_addr);
        let territory_opt = find_territory_by_id_mut(&mut territories.territories, territory_id);
        assert!(territory_opt.is_some(), error::not_found(ETERRITORY_NOT_FOUND));
        
        let territory = territory_opt.value_mut();
        assert!(territory.owner == signer::address_of(account), error::permission_denied(EINVALID_OWNER));

        let now = timestamp::now_seconds();
        let time_elapsed = now - territory.last_collection;
        let resources_generated = (time_elapsed / RESOURCE_GENERATION_INTERVAL) * territory.resource_rate * (territory.development_level as u64);

        territory.resources = territory.resources + resources_generated;
        territory.last_collection = now;

        let collected_amount = territory.resources;
        territory.resources = 0;

        // Emit collection event
        event::emit(ResourcesCollectedEvent {
            territory_id,
            owner: signer::address_of(account),
            amount: collected_amount,
            timestamp: now,
        });

        collected_amount
    }

    /// Upgrade territory development level
    public fun develop_territory(
        account: &signer,
        territory_id: u64,
        resource_cost: u64,
    ) acquires Territories {
        let territories = borrow_global_mut<Territories>(@syndicate_addr);
        let territory_opt = find_territory_by_id_mut(&mut territories.territories, territory_id);
        assert!(territory_opt.is_some(), error::not_found(ETERRITORY_NOT_FOUND));
        
        let territory = territory_opt.value_mut();
        assert!(territory.owner == signer::address_of(account), error::permission_denied(EINVALID_OWNER));
        assert!(territory.development_level < 5, error::invalid_argument(EINVALID_DEVELOPMENT_LEVEL));
        assert!(resource_cost >= territory.development_level as u64 * 100, error::invalid_argument(EINSUFFICIENT_RESOURCES));

        territory.development_level = territory.development_level + 1;
        territory.resource_rate = territory.resource_rate * 2;

        // Emit development event
        event::emit(TerritoryDevelopedEvent {
            territory_id,
            owner: signer::address_of(account),
            new_level: territory.development_level,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Helper function to find a territory by ID
    fun find_territory_by_id_mut(territories: &mut vector<Territory>, id: u64): Option<&mut Territory> {
        let i = 0;
        let len = vector::length(territories);
        while (i < len) {
            let territory = vector::borrow_mut(territories, i);
            if (territory.id == id) {
                return some(territory)
            };
            i = i + 1;
        };
        none
    }

    #[test_only]
    public fun initialize_for_testing(account: &signer) {
        initialize(account);
    }
}
