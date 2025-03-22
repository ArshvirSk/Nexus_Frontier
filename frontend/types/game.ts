export type ResourceType = "energy" | "data" | "materials" | "influence";

export interface Territory {
  id: string;
  x: number;
  y: number;
  owner: string | null;
  name: string;
  description: string;
  resources: {
    [key in ResourceType]: {
      production: number;
      storage: number;
      capacity: number;
    };
  };
  level: number;
  defense: number;
  lastClaimed: number;
  upgrades: {
    production: number;
    storage: number;
    defense: number;
  };
}
