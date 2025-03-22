module syndicate_addr::diplomacy {
    use std::error;
    use std::signer;
    use std::vector;
    use std::string::String;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    /// Error codes
    const EALLIANCE_EXISTS: u64 = 1;
    const EALLIANCE_NOT_FOUND: u64 = 2;
    const EINVALID_ALLIANCE_MEMBER: u64 = 3;
    const EINVALID_AGREEMENT_TYPE: u64 = 4;
    const EINVALID_VOTE: u64 = 5;
    const EALREADY_VOTED: u64 = 6;
    const EPROPOSAL_NOT_FOUND: u64 = 7;
    const EPROPOSAL_EXPIRED: u64 = 8;

    /// Agreement types
    const AGREEMENT_TYPE_TRADE: u8 = 1;
    const AGREEMENT_TYPE_DEFENSE: u8 = 2;
    const AGREEMENT_TYPE_RESOURCE_SHARING: u8 = 3;

    /// Voting options
    const VOTE_YES: bool = true;
    const VOTE_NO: bool = false;

    /// Represents an alliance between syndicates
    struct Alliance has store {
        id: u64,
        name: String,
        founder: address,
        members: vector<address>,
        reputation: u64,
        created_at: u64,
    }

    /// Represents a trade agreement between syndicates
    struct Agreement has store {
        id: u64,
        alliance_id: u64,
        agreement_type: u8,
        parties: vector<address>,
        terms: String,
        start_time: u64,
        end_time: u64,
        active: bool,
    }

    /// Represents a governance proposal
    struct Proposal has store {
        id: u64,
        alliance_id: u64,
        proposer: address,
        description: String,
        votes_yes: u64,
        votes_no: u64,
        voters: vector<address>,
        expires_at: u64,
        executed: bool,
    }

    /// Diplomacy state for the game
    struct DiplomacyState has key {
        alliances: vector<Alliance>,
        agreements: vector<Agreement>,
        proposals: vector<Proposal>,
        alliance_counter: u64,
        agreement_counter: u64,
        proposal_counter: u64,
    }

    /// Events
    struct AllianceCreatedEvent has drop, store {
        alliance_id: u64,
        name: String,
        founder: address,
        timestamp: u64,
    }

    struct AgreementCreatedEvent has drop, store {
        agreement_id: u64,
        alliance_id: u64,
        agreement_type: u8,
        timestamp: u64,
    }

    struct ProposalCreatedEvent has drop, store {
        proposal_id: u64,
        alliance_id: u64,
        proposer: address,
        description: String,
        timestamp: u64,
    }

    struct VoteCastEvent has drop, store {
        proposal_id: u64,
        voter: address,
        vote: bool,
        timestamp: u64,
    }

    /// Initialize the diplomacy system
    public fun initialize(account: &signer) {
        move_to(account, DiplomacyState {
            alliances: vector::empty<Alliance>(),
            agreements: vector::empty<Agreement>(),
            proposals: vector::empty<Proposal>(),
            alliance_counter: 0,
            agreement_counter: 0,
            proposal_counter: 0,
        });
    }

    /// Create a new alliance
    public fun create_alliance(
        account: &signer,
        name: String,
    ) acquires DiplomacyState {
        let state = borrow_global_mut<DiplomacyState>(@syndicate_addr);
        let alliance_id = state.alliance_counter + 1;
        let founder = signer::address_of(account);

        let members = vector::empty<address>();
        vector::push_back(&mut members, founder);

        let alliance = Alliance {
            id: alliance_id,
            name,
            founder,
            members,
            reputation: 100, // Initial reputation
            created_at: timestamp::now_seconds(),
        };

        vector::push_back(&mut state.alliances, alliance);
        state.alliance_counter = alliance_id;

        // Emit creation event
        event::emit(AllianceCreatedEvent {
            alliance_id,
            name,
            founder,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Create a trade agreement between alliance members
    public fun create_agreement(
        account: &signer,
        alliance_id: u64,
        agreement_type: u8,
        terms: String,
        duration: u64,
    ) acquires DiplomacyState {
        assert!(
            agreement_type == AGREEMENT_TYPE_TRADE || 
            agreement_type == AGREEMENT_TYPE_DEFENSE || 
            agreement_type == AGREEMENT_TYPE_RESOURCE_SHARING,
            error::invalid_argument(EINVALID_AGREEMENT_TYPE)
        );

        let state = borrow_global_mut<DiplomacyState>(@syndicate_addr);
        let alliance_opt = find_alliance_by_id(&state.alliances, alliance_id);
        assert!(alliance_opt.is_some(), error::not_found(EALLIANCE_NOT_FOUND));

        let alliance = alliance_opt.value();
        assert!(
            vector::contains(&alliance.members, &signer::address_of(account)),
            error::permission_denied(EINVALID_ALLIANCE_MEMBER)
        );

        let agreement_id = state.agreement_counter + 1;
        let now = timestamp::now_seconds();

        let agreement = Agreement {
            id: agreement_id,
            alliance_id,
            agreement_type,
            parties: *&alliance.members,
            terms,
            start_time: now,
            end_time: now + duration,
            active: true,
        };

        vector::push_back(&mut state.agreements, agreement);
        state.agreement_counter = agreement_id;

        // Emit creation event
        event::emit(AgreementCreatedEvent {
            agreement_id,
            alliance_id,
            agreement_type,
            timestamp: now,
        });
    }

    /// Create a governance proposal
    public fun create_proposal(
        account: &signer,
        alliance_id: u64,
        description: String,
        duration: u64,
    ) acquires DiplomacyState {
        let state = borrow_global_mut<DiplomacyState>(@syndicate_addr);
        let alliance_opt = find_alliance_by_id(&state.alliances, alliance_id);
        assert!(alliance_opt.is_some(), error::not_found(EALLIANCE_NOT_FOUND));

        let alliance = alliance_opt.value();
        assert!(
            vector::contains(&alliance.members, &signer::address_of(account)),
            error::permission_denied(EINVALID_ALLIANCE_MEMBER)
        );

        let proposal_id = state.proposal_counter + 1;
        let now = timestamp::now_seconds();

        let proposal = Proposal {
            id: proposal_id,
            alliance_id,
            proposer: signer::address_of(account),
            description,
            votes_yes: 0,
            votes_no: 0,
            voters: vector::empty(),
            expires_at: now + duration,
            executed: false,
        };

        vector::push_back(&mut state.proposals, proposal);
        state.proposal_counter = proposal_id;

        // Emit creation event
        event::emit(ProposalCreatedEvent {
            proposal_id,
            alliance_id,
            proposer: signer::address_of(account),
            description,
            timestamp: now,
        });
    }

    /// Cast a vote on a proposal
    public fun vote_on_proposal(
        account: &signer,
        proposal_id: u64,
        vote: bool,
    ) acquires DiplomacyState {
        let state = borrow_global_mut<DiplomacyState>(@syndicate_addr);
        let proposal_opt = find_proposal_by_id_mut(&mut state.proposals, proposal_id);
        assert!(proposal_opt.is_some(), error::not_found(EPROPOSAL_NOT_FOUND));

        let proposal = proposal_opt.value_mut();
        let voter = signer::address_of(account);

        // Verify voter is alliance member
        let alliance_opt = find_alliance_by_id(&state.alliances, proposal.alliance_id);
        assert!(alliance_opt.is_some(), error::not_found(EALLIANCE_NOT_FOUND));
        let alliance = alliance_opt.value();
        assert!(
            vector::contains(&alliance.members, &voter),
            error::permission_denied(EINVALID_ALLIANCE_MEMBER)
        );

        // Check voting eligibility
        assert!(!vector::contains(&proposal.voters, &voter), error::invalid_state(EALREADY_VOTED));
        assert!(timestamp::now_seconds() < proposal.expires_at, error::invalid_state(EPROPOSAL_EXPIRED));

        // Record vote
        if (vote == VOTE_YES) {
            proposal.votes_yes = proposal.votes_yes + 1;
        } else {
            proposal.votes_no = proposal.votes_no + 1;
        };
        vector::push_back(&mut proposal.voters, voter);

        // Emit vote event
        event::emit(VoteCastEvent {
            proposal_id,
            voter,
            vote,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Helper function to find an alliance by ID
    fun find_alliance_by_id(alliances: &vector<Alliance>, id: u64): Option<&Alliance> {
        let i = 0;
        let len = vector::length(alliances);
        while (i < len) {
            let alliance = vector::borrow(alliances, i);
            if (alliance.id == id) {
                return some(alliance)
            };
            i = i + 1;
        };
        none
    }

    /// Helper function to find a proposal by ID
    fun find_proposal_by_id_mut(proposals: &mut vector<Proposal>, id: u64): Option<&mut Proposal> {
        let i = 0;
        let len = vector::length(proposals);
        while (i < len) {
            let proposal = vector::borrow_mut(proposals, i);
            if (proposal.id == id) {
                return some(proposal)
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
