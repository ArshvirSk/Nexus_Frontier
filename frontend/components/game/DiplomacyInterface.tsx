import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Types } from 'aptos';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from '@/components/ui/loader';
import { useGameState } from '@/hooks/useGameState';

interface Alliance {
  id: number;
  name: string;
  founder: string;
  members: string[];
  reputation: number;
  createdAt: number;
}

interface Agreement {
  id: number;
  allianceId: number;
  agreementType: number;
  parties: string[];
  terms: string;
  startTime: number;
  endTime: number;
  active: boolean;
}

interface Proposal {
  id: number;
  allianceId: number;
  proposer: string;
  description: string;
  votesYes: number;
  votesNo: number;
  voters: string[];
  expiresAt: number;
  executed: boolean;
}

const AGREEMENT_TYPES = {
  1: 'Trade Agreement',
  2: 'Defense Pact',
  3: 'Resource Sharing',
};

export function DiplomacyInterface() {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const { contractAddress } = useGameState();
  const [allianceName, setAllianceName] = useState('');
  const [agreementType, setAgreementType] = useState(1);
  const [agreementTerms, setAgreementTerms] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  // Query alliances
  const { data: alliances, isLoading: alliancesLoading } = useQuery<Alliance[]>({
    queryKey: ['alliances'],
    queryFn: async () => {
      // Implementation will depend on your view function structure
      return []; // TODO: Implement alliance fetching
    },
    enabled: !!account?.address,
  });

  // Query agreements
  const { data: agreements, isLoading: agreementsLoading } = useQuery<Agreement[]>({
    queryKey: ['agreements'],
    queryFn: async () => {
      // Implementation will depend on your view function structure
      return []; // TODO: Implement agreement fetching
    },
    enabled: !!account?.address,
  });

  // Query proposals
  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({
    queryKey: ['proposals'],
    queryFn: async () => {
      // Implementation will depend on your view function structure
      return []; // TODO: Implement proposal fetching
    },
    enabled: !!account?.address,
  });

  // Create alliance mutation
  const createAllianceMutation = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::diplomacy::create_alliance`,
        type_arguments: [],
        arguments: [allianceName],
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Alliance created successfully');
      setAllianceName('');
      queryClient.invalidateQueries(['alliances']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create alliance: ${error.message}`);
    },
  });

  // Create agreement mutation
  const createAgreementMutation = useMutation({
    mutationFn: async (allianceId: number) => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::diplomacy::create_agreement`,
        type_arguments: [],
        arguments: [allianceId, agreementType, agreementTerms, 2592000], // 30 days duration
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Agreement created successfully');
      setAgreementTerms('');
      queryClient.invalidateQueries(['agreements']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create agreement: ${error.message}`);
    },
  });

  // Create proposal mutation
  const createProposalMutation = useMutation({
    mutationFn: async (allianceId: number) => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::diplomacy::create_proposal`,
        type_arguments: [],
        arguments: [allianceId, proposalDescription, 604800], // 7 days duration
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Proposal created successfully');
      setProposalDescription('');
      queryClient.invalidateQueries(['proposals']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create proposal: ${error.message}`);
    },
  });

  // Vote on proposal mutation
  const voteOnProposalMutation = useMutation({
    mutationFn: async ({ proposalId, vote }: { proposalId: number; vote: boolean }) => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::diplomacy::vote_on_proposal`,
        type_arguments: [],
        arguments: [proposalId, vote],
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Vote cast successfully');
      queryClient.invalidateQueries(['proposals']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to cast vote: ${error.message}`);
    },
  });

  if (alliancesLoading || agreementsLoading || proposalsLoading) return <Loader />;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-neon-blue">Syndicate Diplomacy</h2>

        <Tabs defaultValue="alliances" className="w-full">
          <TabsList className="bg-darker-gray border-b border-neon-purple">
            <TabsTrigger value="alliances" className="text-neon-blue hover:text-neon-purple">
              Alliances
            </TabsTrigger>
            <TabsTrigger value="agreements" className="text-neon-blue hover:text-neon-purple">
              Agreements
            </TabsTrigger>
            <TabsTrigger value="proposals" className="text-neon-blue hover:text-neon-purple">
              Proposals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alliances" className="mt-4">
            {/* Create Alliance Form */}
            <Card className="p-4 bg-dark-gray border-neon-purple mb-4">
              <h3 className="text-lg font-semibold mb-4 text-neon-green">Create New Alliance</h3>
              <div className="flex gap-4">
                <Input
                  placeholder="Alliance Name"
                  value={allianceName}
                  onChange={(e) => setAllianceName(e.target.value)}
                  className="flex-1 bg-darker-gray text-neon-blue"
                />
                <Button
                  onClick={() => createAllianceMutation.mutate()}
                  disabled={!allianceName || createAllianceMutation.isLoading}
                  className="bg-neon-purple hover:bg-neon-purple/80"
                >
                  Create Alliance
                </Button>
              </div>
            </Card>

            {/* Alliance List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alliances?.map((alliance) => (
                <Card
                  key={alliance.id}
                  className="p-4 bg-dark-gray border-neon-blue hover:border-neon-purple transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-neon-blue">{alliance.name}</h4>
                      <p className="text-sm text-gray-400">
                        Founder: {alliance.founder.slice(0, 6)}...{alliance.founder.slice(-4)}
                      </p>
                    </div>
                    <p className="text-neon-green">Rep: {alliance.reputation}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Members: {alliance.members.length}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() => setAgreementType(1)}
                        className="flex-1 bg-neon-blue hover:bg-neon-blue/80"
                      >
                        Propose Agreement
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="agreements" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agreements?.map((agreement) => (
                <Card
                  key={agreement.id}
                  className="p-4 bg-dark-gray border-neon-blue hover:border-neon-purple transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-neon-blue">
                        {AGREEMENT_TYPES[agreement.agreementType as keyof typeof AGREEMENT_TYPES]}
                      </h4>
                      <p className="text-sm text-gray-400">Alliance #{agreement.allianceId}</p>
                    </div>
                    <p className={`text-${agreement.active ? 'neon-green' : 'neon-red'}`}>
                      {agreement.active ? 'Active' : 'Expired'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{agreement.terms}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposals?.map((proposal) => (
                <Card
                  key={proposal.id}
                  className="p-4 bg-dark-gray border-neon-blue hover:border-neon-purple transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-neon-blue">Alliance #{proposal.allianceId}</h4>
                      <p className="text-sm text-gray-400">
                        Proposer: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-neon-green">Yes: {proposal.votesYes}</p>
                      <p className="text-neon-red">No: {proposal.votesNo}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{proposal.description}</p>
                  {!proposal.voters.includes(account?.address || '') && !proposal.executed && (
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => voteOnProposalMutation.mutate({ proposalId: proposal.id, vote: true })}
                        className="flex-1 bg-neon-green hover:bg-neon-green/80"
                      >
                        Vote Yes
                      </Button>
                      <Button
                        onClick={() => voteOnProposalMutation.mutate({ proposalId: proposal.id, vote: false })}
                        className="flex-1 bg-neon-red hover:bg-neon-red/80"
                      >
                        Vote No
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
