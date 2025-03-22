// Resource types used throughout the alliance system
export type ResourceType = 'energy' | 'data' | 'materials' | 'influence';

// Alliance member roles
export type AllianceRole = 'founder' | 'admin' | 'member';

// Alliance member structure
export interface AllianceMember {
  address: string;
  role: AllianceRole;
  joinedAt: number;
  contributions?: Partial<Record<ResourceType, number>>;
  lastActive?: number;
}

export interface Alliance {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  members: string[]; // Array of member addresses
  territories: string[]; // Array of territory IDs
  resources: {
    energy: number;
    data: number;
    materials: number;
    influence: number;
  };
  stats: {
    influence: number;
    productionBonus: number;
    defenseBonus: number;
    resourceCapacity: number;
  };
  diplomacy: {
    allies: string[]; // Array of alliance IDs
    enemies: string[]; // Array of alliance IDs
    tradePartners: string[]; // Array of alliance IDs
  };
}

// Helper functions for alliance management
export function calculateAllianceLevel(experience: number): number {
  // Simple level calculation: sqrt(experience / 100)
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

export function calculateExperienceForLevel(level: number): number {
  // Inverse of the level calculation
  return Math.pow(level - 1, 2) * 100;
}

export function calculateResourceBonus(allianceLevel: number): number {
  // 2% per level, up to 30%
  return Math.min(0.02 * allianceLevel, 0.3);
}

export function calculateDefenseBonus(allianceLevel: number): number {
  // 1.5% per level, up to 25%
  return Math.min(0.015 * allianceLevel, 0.25);
}

export function calculateMemberLimit(allianceLevel: number): number {
  // Base of 5 members, +1 per 2 levels
  return 5 + Math.floor(allianceLevel / 2);
}

// Create a new alliance
export function createAlliance(name: string, description: string, ownerId: string): Alliance {
  return {
    id: `alliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    color: getRandomAllianceColor(),
    ownerId,
    members: [],
    territories: [],
    resources: {
      energy: 0,
      data: 0,
      materials: 0,
      influence: 0
    },
    stats: {
      influence: 0,
      productionBonus: 0,
      defenseBonus: 0,
      resourceCapacity: 0
    },
    diplomacy: {
      allies: [],
      enemies: [],
      tradePartners: []
    }
  };
}

// Get a random color for a new alliance
function getRandomAllianceColor(): string {
  const colors = [
    "#FF5555", // Red
    "#55FF55", // Green
    "#5555FF", // Blue
    "#FFFF55", // Yellow
    "#FF55FF", // Magenta
    "#55FFFF", // Cyan
    "#FF9955", // Orange
    "#9955FF", // Purple
    "#55FF99", // Mint
    "#FF5599"  // Pink
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}
