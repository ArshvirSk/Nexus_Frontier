import { useCallback, useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Territory } from "../../../types/game";
import { HexGrid } from "./HexGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";

export function TerritoryMap() {
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'resources' | 'actions'>('info');

  // Fetch territories
  const { data: territories, isLoading } = useQuery({
    queryKey: ["territories"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockTerritories;
    },
  });

  // Claim territory mutation
  const claimMutation = useMutation({
    mutationFn: async (territoryId: string) => {
      // TODO: Replace with actual API call to claim territory
      console.log(`Claiming territory ${territoryId}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update the mock territory data to reflect ownership
      // This is a temporary solution until the real API is implemented
      if (territories) {
        const updatedTerritories = [...territories];
        const territoryIndex = updatedTerritories.findIndex(t => t.id === territoryId);
        
        if (territoryIndex !== -1) {
          updatedTerritories[territoryIndex] = {
            ...updatedTerritories[territoryIndex],
            owner: account?.address?.toString() || null
          };
          
          // Update the client-side cache with the new territories
          queryClient.setQueryData(["territories"], updatedTerritories);
        }
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Territory claimed successfully!");
      // No need to invalidate the query as we've already updated the cache
      setSelectedTerritory(null);
    },
    onError: (error) => {
      toast.error("Failed to claim territory: " + error);
    },
  });

  // Upgrade territory mutation
  const upgradeMutation = useMutation({
    mutationFn: async ({
      territoryId,
      upgradeType,
    }: {
      territoryId: string;
      upgradeType: "production" | "storage" | "defense";
    }) => {
      // TODO: Replace with actual API call to upgrade territory
      console.log(`Upgrading territory ${territoryId} - ${upgradeType}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update the mock territory data to reflect the upgrade
      // This is a temporary solution until the real API is implemented
      if (territories) {
        const updatedTerritories = [...territories];
        const territoryIndex = updatedTerritories.findIndex(t => t.id === territoryId);
        
        if (territoryIndex !== -1) {
          const territory = updatedTerritories[territoryIndex];
          const upgrades = { ...territory.upgrades };
          
          // Increment the appropriate upgrade
          upgrades[upgradeType] = (upgrades[upgradeType] || 0) + 1;
          
          // Apply the upgrade effects
          const resources = { ...territory.resources };
          let defense = territory.defense;
          
          if (upgradeType === "production") {
            // Increase production for all resources by 10%
            // Use type-safe approach with known resource keys
            (Object.keys(resources) as Array<keyof typeof resources>).forEach(key => {
              resources[key] = {
                ...resources[key],
                production: Math.floor(resources[key].production * 1.1)
              };
            });
          } else if (upgradeType === "storage") {
            // Increase capacity for all resources by 20%
            // Use type-safe approach with known resource keys
            (Object.keys(resources) as Array<keyof typeof resources>).forEach(key => {
              resources[key] = {
                ...resources[key],
                capacity: Math.floor(resources[key].capacity * 1.2)
              };
            });
          } else if (upgradeType === "defense") {
            // Increase defense by 5
            defense += 5;
          }
          
          updatedTerritories[territoryIndex] = {
            ...territory,
            resources,
            defense,
            upgrades
          };
          
          // Update the client-side cache with the new territories
          queryClient.setQueryData(["territories"], updatedTerritories);
          
          // If the selected territory was upgraded, update it
          if (selectedTerritory && selectedTerritory.id === territoryId) {
            setSelectedTerritory(updatedTerritories[territoryIndex]);
          }
        }
      }
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Territory upgraded successfully!");
      // No need to invalidate the query as we've already updated the cache
    },
    onError: (error) => {
      toast.error("Failed to upgrade territory: " + error);
    },
  });

  const handleTerritorySelect = useCallback((territory: Territory) => {
    setSelectedTerritory(territory);
    setActiveTab('info');
  }, []);

  const handleClaimTerritory = useCallback(() => {
    if (!selectedTerritory) return;
    claimMutation.mutate(selectedTerritory.id);
  }, [selectedTerritory, claimMutation]);

  const handleUpgradeTerritory = useCallback(
    (upgradeType: "production" | "storage" | "defense") => {
      if (!selectedTerritory) return;
      upgradeMutation.mutate({
        territoryId: selectedTerritory.id,
        upgradeType,
      });
    },
    [selectedTerritory, upgradeMutation]
  );

  // Handle escape key to deselect territory
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTerritory) {
        setSelectedTerritory(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTerritory]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader variant="purple" size="lg" />
      </div>
    );
  }

  // Get resource color
  const getResourceColor = (type: string) => {
    switch (type) {
      case 'energy': return 'bg-green-500';
      case 'data': return 'bg-blue-500';
      case 'materials': return 'bg-amber-500';
      case 'influence': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Get resource text color
  const getResourceTextColor = (type: string) => {
    switch (type) {
      case 'energy': return 'text-green-400';
      case 'data': return 'text-blue-400';
      case 'materials': return 'text-amber-400';
      case 'influence': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      {/* Main map */}
      <div className="flex-1 relative border border-purple-500/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(149,0,255,0.2)]">
        <HexGrid
          territories={territories || []}
          selectedTerritory={selectedTerritory}
          onTerritorySelect={handleTerritorySelect}
          userAddress={account?.address?.toString()}
        />
        
        {/* Map info overlay */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded border border-purple-500/30 backdrop-blur-sm">
          <div className="text-purple-300 font-bold mb-1">Nexus Frontier</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Territories: {territories?.length || 0}</div>
            <div>Controlled: {territories?.filter(t => t.owner === account?.address?.toString()).length || 0}</div>
          </div>
        </div>
      </div>

      {/* Territory details */}
      {selectedTerritory && (
        <Card className="w-80 bg-black/80 border-purple-500/30 text-white shadow-[0_0_15px_rgba(149,0,255,0.2)]">
          <CardHeader className="pb-2 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 h-6 w-6 text-gray-400 hover:text-white hover:bg-purple-900/30"
              onClick={() => setSelectedTerritory(null)}
            >
              ✕
            </Button>
            <CardTitle className="text-purple-300 font-cyberpunk">{selectedTerritory.name}</CardTitle>
            <div className="text-xs text-gray-400">
              {selectedTerritory.owner === account?.address?.toString() 
                ? "Your Territory" 
                : selectedTerritory.owner 
                  ? "Controlled by Alliance" 
                  : "Unclaimed Territory"}
            </div>
          </CardHeader>
          
          {/* Tabs */}
          <div className="border-b border-purple-900/50 px-4">
            <div className="flex space-x-1 text-xs">
              <button
                className={`py-2 px-3 ${activeTab === 'info' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400 hover:text-purple-200'}`}
                onClick={() => setActiveTab('info')}
              >
                Info
              </button>
              <button
                className={`py-2 px-3 ${activeTab === 'resources' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400 hover:text-purple-200'}`}
                onClick={() => setActiveTab('resources')}
              >
                Resources
              </button>
              <button
                className={`py-2 px-3 ${activeTab === 'actions' ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-400 hover:text-purple-200'}`}
                onClick={() => setActiveTab('actions')}
              >
                Actions
              </button>
            </div>
          </div>
          
          <CardContent className="p-4 space-y-4">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-300">{selectedTerritory.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-black/40 p-2 rounded border border-purple-900/30 flex flex-col items-center">
                    <div className="text-xs text-gray-400 mb-1">Level</div>
                    <div className="text-2xl font-cyber text-purple-300">{selectedTerritory.level}</div>
                  </div>
                  <div className="bg-black/40 p-2 rounded border border-purple-900/30 flex flex-col items-center">
                    <div className="text-xs text-gray-400 mb-1">Defense</div>
                    <div className="text-2xl font-cyber text-cyan-300">{selectedTerritory.defense}</div>
                  </div>
                </div>
                
                <div className="bg-black/40 p-3 rounded border border-purple-900/30">
                  <div className="text-xs text-gray-400 mb-2">Territory Type</div>
                  <div className="text-sm">
                    {getDominantResourceType(selectedTerritory)}
                  </div>
                </div>
                
                <div className="bg-black/40 p-3 rounded border border-purple-900/30">
                  <div className="text-xs text-gray-400 mb-2">Location</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>X: {selectedTerritory.x}</div>
                    <div>Y: {selectedTerritory.y}</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                {Object.entries(selectedTerritory.resources).map(([type, data]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${getResourceColor(type)} mr-2`}></div>
                        <span className={`capitalize ${getResourceTextColor(type)}`}>{type}</span>
                      </div>
                      <span className="text-xs">+{data.production}/h</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(data.storage / data.capacity) * 100} 
                        className={`h-2 ${type === 'energy' ? 'bg-green-950' : type === 'data' ? 'bg-blue-950' : type === 'materials' ? 'bg-amber-950' : 'bg-purple-950'}`} 
                      />
                      <span className="text-xs text-gray-400">
                        {data.storage}/{data.capacity}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="bg-black/40 p-3 rounded border border-purple-900/30 mt-4">
                  <div className="text-xs text-gray-400 mb-2">Total Production</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-green-400">
                        {selectedTerritory.resources.energy.production}/h
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-blue-400">
                        {selectedTerritory.resources.data.production}/h
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-amber-400">
                        {selectedTerritory.resources.materials.production}/h
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-purple-400">
                        {selectedTerritory.resources.influence.production}/h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions Tab */}
            {activeTab === 'actions' && (
              <div className="space-y-3">
                {selectedTerritory.owner === account?.address?.toString() ? (
                  <>
                    <div className="bg-black/40 p-3 rounded border border-purple-900/30">
                      <div className="text-xs text-gray-400 mb-2">Upgrade Territory</div>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-green-500/50 text-green-400 hover:bg-green-900/30"
                          onClick={() => handleUpgradeTerritory("production")}
                          disabled={upgradeMutation.status === "loading"}
                        >
                          {upgradeMutation.status === "loading" ? (
                            <Loader variant="default" size="sm" className="mr-2" />
                          ) : null}
                          Upgrade Production
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-900/30"
                          onClick={() => handleUpgradeTerritory("storage")}
                          disabled={upgradeMutation.status === "loading"}
                        >
                          Upgrade Storage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/30"
                          onClick={() => handleUpgradeTerritory("defense")}
                          disabled={upgradeMutation.status === "loading"}
                        >
                          Upgrade Defense
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-black/40 p-3 rounded border border-purple-900/30">
                      <div className="text-xs text-gray-400 mb-2">Deploy Agents</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-900/30"
                      >
                        Deploy Agent
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-black/40 p-3 rounded border border-purple-900/30">
                      <div className="text-xs text-gray-400 mb-2">Territory Control</div>
                      <p className="text-sm text-gray-300 mb-3">
                        Claiming this territory will give you access to its resources and strategic position.
                      </p>
                      <Button
                        variant="default"
                        className="w-full bg-purple-900/50 hover:bg-purple-700/50 text-white"
                        onClick={handleClaimTerritory}
                        disabled={claimMutation.status === "loading"}
                      >
                        {claimMutation.status === "loading" ? (
                          <Loader variant="default" size="sm" className="mr-2" />
                        ) : null}
                        Claim Territory
                      </Button>
                    </div>
                    
                    <div className="bg-black/40 p-3 rounded border border-red-900/30">
                      <div className="text-xs text-gray-400 mb-2">Attack Territory</div>
                      <p className="text-sm text-gray-300 mb-3">
                        {selectedTerritory.owner ? 
                          "This territory is controlled by another alliance. You can attack it to gain control." :
                          "This territory is unclaimed. You can claim it without a fight."}
                      </p>
                      {selectedTerritory.owner && (
                        <Button
                          variant="destructive"
                          className="w-full"
                        >
                          Attack Territory
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to determine dominant resource type
function getDominantResourceType(territory: Territory): JSX.Element {
  const resources = Object.entries(territory.resources);
  const maxProduction = Math.max(...resources.map(([, data]) => data.production));
  const dominant = resources.find(([, data]) => data.production === maxProduction);
  
  let resourceName = "";
  let resourceColor = "";
  
  switch (dominant?.[0]) {
    case "energy":
      resourceName = "Energy Nexus";
      resourceColor = "text-green-400";
      break;
    case "data":
      resourceName = "Data Haven";
      resourceColor = "text-blue-400";
      break;
    case "materials":
      resourceName = "Material Complex";
      resourceColor = "text-amber-400";
      break;
    case "influence":
      resourceName = "Influence Hub";
      resourceColor = "text-purple-400";
      break;
    default:
      resourceName = "Balanced Sector";
      resourceColor = "text-gray-400";
  }
  
  return (
    <span className={resourceColor}>
      {resourceName} <span className="text-gray-400">({maxProduction}/h)</span>
    </span>
  );
}

// Mock data for development
const mockTerritories: Territory[] = [
  // Central territories
  {
    id: "1",
    x: 2,
    y: 2,
    owner: null,
    name: "Neon District Alpha",
    description: "A bustling cyberpunk district with high energy production.",
    resources: {
      energy: { production: 10, storage: 100, capacity: 1000 },
      data: { production: 5, storage: 50, capacity: 500 },
      materials: { production: 3, storage: 30, capacity: 300 },
      influence: { production: 2, storage: 20, capacity: 200 },
    },
    level: 1,
    defense: 10,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "2",
    x: 3,
    y: 2,
    owner: null,
    name: "Digital Nexus Beta",
    description: "A data processing hub with advanced computational capabilities.",
    resources: {
      energy: { production: 4, storage: 40, capacity: 400 },
      data: { production: 12, storage: 120, capacity: 1200 },
      materials: { production: 2, storage: 20, capacity: 200 },
      influence: { production: 3, storage: 30, capacity: 300 },
    },
    level: 1,
    defense: 8,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "3",
    x: 4,
    y: 3,
    owner: null,
    name: "Material Synthesis Zone",
    description: "An industrial area focused on material production and refinement.",
    resources: {
      energy: { production: 3, storage: 30, capacity: 300 },
      data: { production: 2, storage: 20, capacity: 200 },
      materials: { production: 14, storage: 140, capacity: 1400 },
      influence: { production: 1, storage: 10, capacity: 100 },
    },
    level: 1,
    defense: 12,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "4",
    x: 2,
    y: 3,
    owner: null,
    name: "Influence Network Hub",
    description: "A social hub where influence and connections are cultivated.",
    resources: {
      energy: { production: 2, storage: 20, capacity: 200 },
      data: { production: 4, storage: 40, capacity: 400 },
      materials: { production: 1, storage: 10, capacity: 100 },
      influence: { production: 13, storage: 130, capacity: 1300 },
    },
    level: 1,
    defense: 9,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "5",
    x: 3,
    y: 3,
    owner: null,
    name: "Balanced Sector Gamma",
    description: "A versatile territory with balanced resource production.",
    resources: {
      energy: { production: 7, storage: 70, capacity: 700 },
      data: { production: 7, storage: 70, capacity: 700 },
      materials: { production: 7, storage: 70, capacity: 700 },
      influence: { production: 7, storage: 70, capacity: 700 },
    },
    level: 1,
    defense: 11,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  // Outer territories
  {
    id: "6",
    x: 1,
    y: 1,
    owner: null,
    name: "Energy Outpost Delta",
    description: "A remote energy harvesting facility on the frontier.",
    resources: {
      energy: { production: 15, storage: 150, capacity: 1500 },
      data: { production: 1, storage: 10, capacity: 100 },
      materials: { production: 2, storage: 20, capacity: 200 },
      influence: { production: 1, storage: 10, capacity: 100 },
    },
    level: 1,
    defense: 7,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "7",
    x: 5,
    y: 2,
    owner: null,
    name: "Data Archive Epsilon",
    description: "A secure data storage and processing facility.",
    resources: {
      energy: { production: 3, storage: 30, capacity: 300 },
      data: { production: 11, storage: 110, capacity: 1100 },
      materials: { production: 3, storage: 30, capacity: 300 },
      influence: { production: 2, storage: 20, capacity: 200 },
    },
    level: 1,
    defense: 13,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "8",
    x: 4,
    y: 1,
    owner: null,
    name: "Material Refinery Zeta",
    description: "A specialized facility for processing and refining materials.",
    resources: {
      energy: { production: 5, storage: 50, capacity: 500 },
      data: { production: 2, storage: 20, capacity: 200 },
      materials: { production: 12, storage: 120, capacity: 1200 },
      influence: { production: 1, storage: 10, capacity: 100 },
    },
    level: 1,
    defense: 9,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "9",
    x: 1,
    y: 4,
    owner: null,
    name: "Influence Network Theta",
    description: "A hub of social connections and influence trading.",
    resources: {
      energy: { production: 2, storage: 20, capacity: 200 },
      data: { production: 3, storage: 30, capacity: 300 },
      materials: { production: 2, storage: 20, capacity: 200 },
      influence: { production: 11, storage: 110, capacity: 1100 },
    },
    level: 1,
    defense: 8,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "10",
    x: 5,
    y: 4,
    owner: null,
    name: "Strategic Chokepoint Iota",
    description: "A key strategic location controlling access to valuable resources.",
    resources: {
      energy: { production: 6, storage: 60, capacity: 600 },
      data: { production: 6, storage: 60, capacity: 600 },
      materials: { production: 6, storage: 60, capacity: 600 },
      influence: { production: 6, storage: 60, capacity: 600 },
    },
    level: 1,
    defense: 15,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
];
