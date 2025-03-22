import { ResourceType } from "./game";

export type AgentClass = 
  | "hacker" 
  | "enforcer" 
  | "trader" 
  | "infiltrator" 
  | "technician";

export type AgentStatus = 
  | "idle" 
  | "deployed" 
  | "cooldown" 
  | "training";

export interface AgentAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number; // Cooldown in milliseconds
  lastUsed?: number | null; // Timestamp when last used
  type: string;
  target: string;
  effects: AbilityEffect;
}

export interface AbilityEffect {
  resources?: Partial<Record<ResourceType, number>>;
  resourceMultiplier?: Partial<Record<ResourceType, number>>;
  resourceGain?: Partial<Record<ResourceType, number>>;
  marketPriceMultiplier?: Partial<Record<ResourceType, number>>;
  defense?: number;
  production?: number;
  duration?: number;
}

export interface AgentStats {
  efficiency: number;
  intelligence: number;
  resilience: number;
  stealth: number;
  combat: number;
}

export interface Agent {
  id: string;
  name: string;
  class: AgentClass;
  level: number;
  stats: AgentStats;
  abilities: AgentAbility[];
  deployedAt?: number | null;
  deployedToTerritoryId: string | null;
  deploymentDuration: number | null;
  cooldown: number;
  cooldownMax: number;
  deployed: boolean;
}

// Agent class templates
export const AGENT_TEMPLATES: Record<AgentClass, Omit<Agent, "id" | "name">> = {
  hacker: {
    class: "hacker",
    level: 1,
    stats: {
      efficiency: 5,
      intelligence: 8,
      resilience: 3,
      stealth: 7,
      combat: 2
    },
    abilities: [
      {
        id: "data_breach",
        name: "Data Breach",
        description: "Infiltrate a territory's systems to steal data resources",
        cooldown: 3600000, // 1 hour in ms
        type: "offensive",
        target: "territory",
        effects: {
          resourceGain: {
            data: 50
          },
          duration: 0
        }
      }
    ],
    deployedToTerritoryId: null,
    deploymentDuration: null,
    cooldown: 0,
    cooldownMax: 3600000,
    deployed: false
  },
  enforcer: {
    class: "enforcer",
    level: 1,
    stats: {
      efficiency: 4,
      intelligence: 3,
      resilience: 9,
      stealth: 2,
      combat: 8
    },
    abilities: [
      {
        id: "intimidate",
        name: "Intimidate",
        description: "Increase influence gain in a territory through show of force",
        cooldown: 7200000, // 2 hours in ms
        type: "buff",
        target: "territory",
        effects: {
          resourceMultiplier: {
            influence: 1.5
          },
          duration: 3600000 // 1 hour
        }
      }
    ],
    deployedToTerritoryId: null,
    deploymentDuration: null,
    cooldown: 0,
    cooldownMax: 7200000,
    deployed: false
  },
  trader: {
    class: "trader",
    level: 1,
    stats: {
      efficiency: 7,
      intelligence: 6,
      resilience: 4,
      stealth: 5,
      combat: 3
    },
    abilities: [
      {
        id: "market_manipulation",
        name: "Market Manipulation",
        description: "Temporarily increase the value of materials in the market",
        cooldown: 14400000, // 4 hours in ms
        type: "economic",
        target: "global",
        effects: {
          marketPriceMultiplier: {
            materials: 1.3
          },
          duration: 3600000 // 1 hour
        }
      }
    ],
    deployedToTerritoryId: null,
    deploymentDuration: null,
    cooldown: 0,
    cooldownMax: 14400000,
    deployed: false
  },
  infiltrator: {
    class: "infiltrator",
    level: 1,
    stats: {
      efficiency: 6,
      intelligence: 7,
      resilience: 5,
      stealth: 9,
      combat: 4
    },
    abilities: [
      {
        id: "sabotage",
        name: "Sabotage",
        description: "Reduce resource production in an enemy territory",
        cooldown: 10800000, // 3 hours in ms
        type: "offensive",
        target: "territory",
        effects: {
          resourceMultiplier: {
            energy: 0.7,
            materials: 0.7
          },
          duration: 7200000 // 2 hours
        }
      }
    ],
    deployedToTerritoryId: null,
    deploymentDuration: null,
    cooldown: 0,
    cooldownMax: 10800000,
    deployed: false
  },
  technician: {
    class: "technician",
    level: 1,
    stats: {
      efficiency: 8,
      intelligence: 5,
      resilience: 6,
      stealth: 3,
      combat: 2
    },
    abilities: [
      {
        id: "optimize_systems",
        name: "Optimize Systems",
        description: "Increase energy production in a territory",
        cooldown: 5400000, // 1.5 hours in ms
        type: "buff",
        target: "territory",
        effects: {
          resourceMultiplier: {
            energy: 1.4
          },
          duration: 10800000 // 3 hours
        }
      }
    ],
    deployedToTerritoryId: null,
    deploymentDuration: null,
    cooldown: 0,
    cooldownMax: 5400000,
    deployed: false
  }
};
