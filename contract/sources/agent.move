module syndicate_addr::agent {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use syndicate_addr::territory;

    /// Error codes
    const EINVALID_AGENT_ROLE: u64 = 1;
    const EAGENT_NOT_FOUND: u64 = 2;
    const EINVALID_AGENT_OWNER: u64 = 3;
    const EAGENT_ALREADY_ASSIGNED: u64 = 4;
    const EAGENT_NOT_ASSIGNED: u64 = 5;

    /// Agent roles
    const ROLE_HARVESTER: u8 = 1;
    const ROLE_TRADER: u8 = 2;
    const ROLE_SCOUT: u8 = 3;
    const ROLE_GUARDIAN: u8 = 4;

    /// Represents an AI agent in the game
    struct Agent has store {
        id: u64,
        name: String,
        role: u8,
        owner: address,
        level: u8,
        experience: u64,
        assigned_territory: Option<u64>,
        efficiency: u8, // Base 100, can be increased with level
    }

    /// Collection of agents owned by an account
    struct AgentCollection has key {
        agents: vector<Agent>,
        agent_counter: u64,
    }

    /// Events
    struct AgentCreatedEvent has drop, store {
        agent_id: u64,
        owner: address,
        role: u8,
        timestamp: u64,
    }

    struct AgentAssignedEvent has drop, store {
        agent_id: u64,
        territory_id: u64,
        timestamp: u64,
    }

    struct AgentLeveledUpEvent has drop, store {
        agent_id: u64,
        new_level: u8,
        timestamp: u64,
    }

    /// Initialize agent collection for an account
    public fun initialize_collection(account: &signer) {
        if (!exists<AgentCollection>(signer::address_of(account))) {
            move_to(account, AgentCollection {
                agents: vector::empty<Agent>(),
                agent_counter: 0,
            });
        }
    }

    /// Create a new agent
    public fun create_agent(
        account: &signer,
        name: String,
        role: u8,
    ) acquires AgentCollection {
        assert!(
            role == ROLE_HARVESTER || 
            role == ROLE_TRADER || 
            role == ROLE_SCOUT || 
            role == ROLE_GUARDIAN,
            error::invalid_argument(EINVALID_AGENT_ROLE)
        );

        let account_addr = signer::address_of(account);
        if (!exists<AgentCollection>(account_addr)) {
            initialize_collection(account);
        };

        let collection = borrow_global_mut<AgentCollection>(account_addr);
        let agent_id = collection.agent_counter + 1;

        let agent = Agent {
            id: agent_id,
            name,
            role,
            owner: account_addr,
            level: 1,
            experience: 0,
            assigned_territory: option::none(),
            efficiency: 100,
        };

        vector::push_back(&mut collection.agents, agent);
        collection.agent_counter = agent_id;

        // Emit creation event
        event::emit(AgentCreatedEvent {
            agent_id,
            owner: account_addr,
            role,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Assign agent to a territory
    public fun assign_agent(
        account: &signer,
        agent_id: u64,
        territory_id: u64,
    ) acquires AgentCollection {
        let collection = borrow_global_mut<AgentCollection>(signer::address_of(account));
        let agent_opt = find_agent_by_id_mut(&mut collection.agents, agent_id);
        assert!(agent_opt.is_some(), error::not_found(EAGENT_NOT_FOUND));

        let agent = agent_opt.value_mut();
        assert!(agent.owner == signer::address_of(account), error::permission_denied(EINVALID_AGENT_OWNER));
        assert!(agent.assigned_territory.is_none(), error::invalid_state(EAGENT_ALREADY_ASSIGNED));

        agent.assigned_territory = option::some(territory_id);

        // Emit assignment event
        event::emit(AgentAssignedEvent {
            agent_id,
            territory_id,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Unassign agent from territory
    public fun unassign_agent(
        account: &signer,
        agent_id: u64,
    ) acquires AgentCollection {
        let collection = borrow_global_mut<AgentCollection>(signer::address_of(account));
        let agent_opt = find_agent_by_id_mut(&mut collection.agents, agent_id);
        assert!(agent_opt.is_some(), error::not_found(EAGENT_NOT_FOUND));

        let agent = agent_opt.value_mut();
        assert!(agent.owner == signer::address_of(account), error::permission_denied(EINVALID_AGENT_OWNER));
        assert!(agent.assigned_territory.is_some(), error::invalid_state(EAGENT_NOT_ASSIGNED));

        agent.assigned_territory = option::none();
    }

    /// Add experience to agent and potentially level up
    public fun add_experience(
        account: &signer,
        agent_id: u64,
        exp_amount: u64,
    ) acquires AgentCollection {
        let collection = borrow_global_mut<AgentCollection>(signer::address_of(account));
        let agent_opt = find_agent_by_id_mut(&mut collection.agents, agent_id);
        assert!(agent_opt.is_some(), error::not_found(EAGENT_NOT_FOUND));

        let agent = agent_opt.value_mut();
        assert!(agent.owner == signer::address_of(account), error::permission_denied(EINVALID_AGENT_OWNER));

        agent.experience = agent.experience + exp_amount;

        // Check for level up (every 1000 exp)
        let new_level = (agent.experience / 1000) as u8 + 1;
        if (new_level > agent.level) {
            agent.level = new_level;
            agent.efficiency = agent.efficiency + 10; // +10% efficiency per level

            // Emit level up event
            event::emit(AgentLeveledUpEvent {
                agent_id,
                new_level,
                timestamp: timestamp::now_seconds(),
            });
        };
    }

    /// Get agent's current efficiency
    public fun get_agent_efficiency(
        owner: address,
        agent_id: u64,
    ): u8 acquires AgentCollection {
        let collection = borrow_global<AgentCollection>(owner);
        let agent_opt = find_agent_by_id(&collection.agents, agent_id);
        assert!(agent_opt.is_some(), error::not_found(EAGENT_NOT_FOUND));

        let agent = agent_opt.value();
        agent.efficiency
    }

    /// Helper function to find an agent by ID
    fun find_agent_by_id_mut(agents: &mut vector<Agent>, id: u64): Option<&mut Agent> {
        let i = 0;
        let len = vector::length(agents);
        while (i < len) {
            let agent = vector::borrow_mut(agents, i);
            if (agent.id == id) {
                return some(agent)
            };
            i = i + 1;
        };
        none
    }

    fun find_agent_by_id(agents: &vector<Agent>, id: u64): Option<&Agent> {
        let i = 0;
        let len = vector::length(agents);
        while (i < len) {
            let agent = vector::borrow(agents, i);
            if (agent.id == id) {
                return some(agent)
            };
            i = i + 1;
        };
        none
    }

    #[test_only]
    public fun initialize_for_testing(account: &signer) {
        initialize_collection(account);
    }
}
