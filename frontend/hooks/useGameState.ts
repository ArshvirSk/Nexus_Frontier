import { create } from 'zustand';

interface Territory {
  id: number;
  coord: { q: number; r: number };
  owner: string;
  resources: number;
  developmentLevel: number;
  resourceRate: number;
}

interface Agent {
  id: number;
  name: string;
  role: number;
  level: number;
  experience: number;
  efficiency: number;
  assignedTerritory?: number;
}

interface Syndicate {
  address: string;
  territories: Territory[];
  agents: Agent[];
  resources: number;
}

interface GameState {
  contractAddress: string;
  userSyndicate: Syndicate | null;
  territories: Territory[];
  agents: Agent[];
  setContractAddress: (address: string) => void;
  setUserSyndicate: (syndicate: Syndicate | null) => void;
  setTerritories: (territories: Territory[]) => void;
  setAgents: (agents: Agent[]) => void;
}

const useGameState = create<GameState>((set: any) => ({
  contractAddress: '',
  userSyndicate: null,
  territories: [],
  agents: [],
  setContractAddress: (address: string) => set({ contractAddress: address }),
  setUserSyndicate: (syndicate: Syndicate | null) => set({ userSyndicate: syndicate }),
  setTerritories: (territories: Territory[]) => set({ territories }),
  setAgents: (agents: Agent[]) => set({ agents }),
}));

export { useGameState };
export type { Territory, Agent, Syndicate };
