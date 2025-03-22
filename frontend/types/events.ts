import { ResourceType, Territory } from "./game";

export type EventType = 
  | "resource_boost" 
  | "cyber_attack" 
  | "system_glitch" 
  | "corporate_raid" 
  | "black_market" 
  | "ai_emergence";

export interface TerritoryEvent {
  id: string;
  type: EventType;
  territoryId: string;
  name: string;
  description: string;
  duration: number; // Duration in milliseconds
  startTime: number; // Timestamp when the event started
  effects: {
    resources?: Partial<Record<ResourceType, number>>; // Multiplier for resource production
    defense?: number; // Modifier for defense
    claimable?: boolean; // Whether the territory can be claimed during the event
  };
  visualEffect?: {
    color: string;
    intensity: number;
    animation: "pulse" | "flicker" | "wave" | "static";
  };
}

// Event factory functions
export function createResourceBoostEvent(territoryId: string): TerritoryEvent {
  const resourceTypes: ResourceType[] = ["energy", "data", "materials", "influence"];
  const boostedResource = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
  
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "resource_boost",
    territoryId,
    name: "Resource Surge",
    description: `A sudden surge in ${boostedResource} production has been detected in this territory.`,
    duration: 5 * 60 * 1000, // 5 minutes
    startTime: Date.now(),
    effects: {
      resources: {
        [boostedResource]: 2.0, // 2x production
      }
    },
    visualEffect: {
      color: boostedResource === "energy" ? "#00ff00" : 
             boostedResource === "data" ? "#00ffff" : 
             boostedResource === "materials" ? "#ff9900" : 
             "#ff00ff", // influence
      intensity: 0.8,
      animation: "pulse"
    }
  };
}

export function createCyberAttackEvent(territoryId: string): TerritoryEvent {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "cyber_attack",
    territoryId,
    name: "Cyber Attack",
    description: "This territory is under a coordinated cyber attack, reducing its defenses.",
    duration: 3 * 60 * 1000, // 3 minutes
    startTime: Date.now(),
    effects: {
      defense: -0.5, // 50% reduction in defense
      resources: {
        data: 0.5, // 50% reduction in data production
      }
    },
    visualEffect: {
      color: "#ff0000",
      intensity: 0.7,
      animation: "flicker"
    }
  };
}

export function createSystemGlitchEvent(territoryId: string): TerritoryEvent {
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "system_glitch",
    territoryId,
    name: "System Glitch",
    description: "A system glitch is affecting this territory, causing unpredictable resource production.",
    duration: 2 * 60 * 1000, // 2 minutes
    startTime: Date.now(),
    effects: {
      resources: {
        energy: Math.random() < 0.5 ? 0.5 : 1.5,
        data: Math.random() < 0.5 ? 0.5 : 1.5,
        materials: Math.random() < 0.5 ? 0.5 : 1.5,
        influence: Math.random() < 0.5 ? 0.5 : 1.5,
      }
    },
    visualEffect: {
      color: "#ffff00",
      intensity: 0.6,
      animation: "wave"
    }
  };
}

export function createRandomEvent(territory: Territory): TerritoryEvent {
  const eventCreators = [
    createResourceBoostEvent,
    createCyberAttackEvent,
    createSystemGlitchEvent
  ];
  
  const randomCreator = eventCreators[Math.floor(Math.random() * eventCreators.length)];
  return randomCreator(territory.id);
}
