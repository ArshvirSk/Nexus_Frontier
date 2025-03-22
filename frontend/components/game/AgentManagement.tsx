import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Types } from 'aptos';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Loader } from '@/components/ui/loader';
import { useGameState } from '@/hooks/useGameState';

interface Agent {
  id: number;
  name: string;
  role: number;
  level: number;
  experience: number;
  efficiency: number;
  assignedTerritory?: number;
}

const ROLE_NAMES = {
  1: 'Harvester',
  2: 'Trader',
  3: 'Scout',
  4: 'Guardian',
};

const ROLE_DESCRIPTIONS = {
  1: 'Increases resource collection efficiency',
  2: 'Reduces marketplace fees and improves trade rates',
  3: 'Provides intelligence on nearby territories',
  4: 'Protects territories from hostile actions',
};

export function AgentManagement() {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const { contractAddress } = useGameState();
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedRole, setSelectedRole] = useState(1);

  // Query agents
  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ['agents', account?.address],
    queryFn: async () => {
      if (!account?.address) return [];
      // Implementation will depend on your view function structure
      return []; // TODO: Implement agent fetching
    },
    enabled: !!account?.address,
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: async () => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::agent::create_agent`,
        type_arguments: [],
        arguments: [newAgentName, selectedRole],
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Agent created successfully');
      setNewAgentName('');
      queryClient.invalidateQueries(['agents']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create agent: ${error.message}`);
    },
  });

  // Assign agent to territory mutation
  const assignAgentMutation = useMutation({
    mutationFn: async ({ agentId, territoryId }: { agentId: number; territoryId: number }) => {
      if (!account?.address) throw new Error('Wallet not connected');

      const transaction: Types.TransactionPayload = {
        type: 'entry_function_payload',
        function: `${contractAddress}::agent::assign_agent`,
        type_arguments: [],
        arguments: [agentId, territoryId],
      };

      const response = await signAndSubmitTransaction(transaction);
      await response.wait();
      return response;
    },
    onSuccess: () => {
      toast.success('Agent assigned successfully');
      queryClient.invalidateQueries(['agents']);
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign agent: ${error.message}`);
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-neon-blue">Agent Management</h2>
        
        {/* Create new agent */}
        <Card className="p-4 bg-dark-gray border-neon-purple">
          <h3 className="text-lg font-semibold mb-4 text-neon-green">Create New Agent</h3>
          <div className="flex gap-4">
            <Input
              placeholder="Agent Name"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="flex-1 bg-darker-gray text-neon-blue"
            />
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(Number(value))}
              className="w-48 bg-darker-gray text-neon-blue"
            >
              {Object.entries(ROLE_NAMES).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </Select>
            <Button
              onClick={() => createAgentMutation.mutate()}
              disabled={!newAgentName || createAgentMutation.isLoading}
              className="bg-neon-purple hover:bg-neon-purple/80"
            >
              Create Agent
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {ROLE_DESCRIPTIONS[selectedRole as keyof typeof ROLE_DESCRIPTIONS]}
          </p>
        </Card>

        {/* Agent list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents?.map((agent) => (
            <Card
              key={agent.id}
              className="p-4 bg-dark-gray border-neon-blue hover:border-neon-purple transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-neon-blue">{agent.name}</h4>
                  <p className="text-sm text-gray-400">{ROLE_NAMES[agent.role as keyof typeof ROLE_NAMES]}</p>
                </div>
                <div className="text-right">
                  <p className="text-neon-green">Level {agent.level}</p>
                  <p className="text-sm text-gray-400">EXP: {agent.experience}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-400">Efficiency: {agent.efficiency}%</p>
                {agent.assignedTerritory ? (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-400">
                      Assigned to Territory #{agent.assignedTerritory}
                    </span>
                    <Button
                      onClick={() => assignAgentMutation.mutate({ agentId: agent.id, territoryId: 0 })}
                      size="sm"
                      variant="outline"
                      className="border-neon-red text-neon-red hover:bg-neon-red/10"
                    >
                      Unassign
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {/* Open territory selection modal */}}
                    size="sm"
                    className="w-full mt-2 bg-neon-blue hover:bg-neon-blue/80"
                  >
                    Assign to Territory
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
