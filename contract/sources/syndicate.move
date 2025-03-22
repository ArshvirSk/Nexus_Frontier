module nexus_syndicates::syndicate {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    
    // Errors
    const ENO_SYNDICATE: u64 = 1;
    const ETERRITORY_CLAIMED: u64 = 2;
    const EINSUFFICIENT_RESOURCES: u64 = 3;

    struct Syndicate has key {
        name: String,
        resources: u64,
        territories: vector<address>,
        market_share: u64,
    }

    struct Territory has key {
        id: address,
        name: String,
        resources: u64,
        controlled_by: address,
        influence: u64,
    }

    struct SyndicateEvents has key {
        territory_claimed_events: event::EventHandle<TerritoryClaimed>,
    }

    struct TerritoryClaimed has drop, store {
        territory_id: address,
        claimer: address,
        timestamp: u64,
    }

    public entry fun initialize_syndicate(account: &signer) {
        let account_addr = signer::address_of(account);
        
        assert!(!exists<Syndicate>(account_addr), ENO_SYNDICATE);
        
        let syndicate = Syndicate {
            name: string::utf8(b"New Syndicate"),
            resources: 100,
            territories: vector::empty(),
            market_share: 0,
        };
        
        move_to(account, syndicate);
        
        // Initialize events
        move_to(account, SyndicateEvents {
            territory_claimed_events: account::new_event_handle<TerritoryClaimed>(account),
        });
    }

    public entry fun claim_territory(
        account: &signer,
        territory_id: address
    ) acquires Syndicate, Territory, SyndicateEvents {
        let account_addr = signer::address_of(account);
        
        assert!(exists<Syndicate>(account_addr), ENO_SYNDICATE);
        
        let territory = borrow_global_mut<Territory>(territory_id);
        assert!(territory.controlled_by == @0x0, ETERRITORY_CLAIMED);
        
        let syndicate = borrow_global_mut<Syndicate>(account_addr);
        assert!(syndicate.resources >= 50, EINSUFFICIENT_RESOURCES);
        
        // Update territory control
        territory.controlled_by = account_addr;
        vector::push_back(&mut syndicate.territories, territory_id);
        
        // Update resources and market share
        syndicate.resources = syndicate.resources - 50;
        syndicate.market_share = syndicate.market_share + 10;
        
        // Emit event
        let events = borrow_global_mut<SyndicateEvents>(account_addr);
        event::emit_event(
            &mut events.territory_claimed_events,
            TerritoryClaimed {
                territory_id,
                claimer: account_addr,
                timestamp: timestamp::now_seconds(),
            },
        );
    }

    public entry fun create_territory(
        account: &signer,
        name: String,
        initial_resources: u64
    ) {
        let territory = Territory {
            id: signer::address_of(account),
            name,
            resources: initial_resources,
            controlled_by: @0x0,
            influence: 0,
        };
        
        move_to(account, territory);
    }

    #[view]
    public fun get_syndicate_info(account_addr: address): (String, u64, u64) acquires Syndicate {
        let syndicate = borrow_global<Syndicate>(account_addr);
        (syndicate.name, syndicate.resources, syndicate.market_share)
    }

    #[view]
    public fun get_territory_info(territory_id: address): (String, u64, address, u64) acquires Territory {
        let territory = borrow_global<Territory>(territory_id);
        (territory.name, territory.resources, territory.controlled_by, territory.influence)
    }
}
