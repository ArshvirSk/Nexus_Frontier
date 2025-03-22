import { useCallback, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Territory } from "../../../types/game";
import { HexGrid } from "./HexGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

export function TerritoryMap() {
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

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
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Territory claimed successfully!");
      queryClient.invalidateQueries(["territories"]);
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
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Territory upgraded successfully!");
      queryClient.invalidateQueries(["territories"]);
    },
    onError: (error) => {
      toast.error("Failed to upgrade territory: " + error);
    },
  });

  const handleTerritorySelect = useCallback((territory: Territory) => {
    setSelectedTerritory(territory);
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

  if (isLoading) {
    return <Loader variant="purple" size="lg" />;
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-12rem)]">
      {/* Main map */}
      <div className="flex-1 relative border border-neon-blue rounded-lg overflow-hidden">
        <HexGrid
          territories={territories || []}
          selectedTerritory={selectedTerritory}
          onTerritorySelect={handleTerritorySelect}
          userAddress={account?.address?.toString()}
        />
      </div>

      {/* Territory details */}
      {selectedTerritory && (
        <Card className="w-80" variant="purple" glass>
          <CardHeader>
            <CardTitle>{selectedTerritory.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-neon-blue/80">{selectedTerritory.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Level: {selectedTerritory.level}</div>
                <div>Defense: {selectedTerritory.defense}</div>
              </div>
            </div>

            {/* Resource production */}
            <div className="space-y-2">
              <h4 className="text-neon-purple text-sm font-cyber">Resources</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedTerritory.resources).map(([type, data]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type}:</span>
                    <span>+{data.production}/h</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              {selectedTerritory.owner === account?.address?.toString() ? (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    className="w-full"
                    onClick={() => handleUpgradeTerritory("production")}
                    disabled={upgradeMutation.status === "loading"}
                  >
                    Upgrade Production
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleUpgradeTerritory("storage")}
                    disabled={upgradeMutation.status === "loading"}
                  >
                    Upgrade Storage
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleUpgradeTerritory("defense")}
                    disabled={upgradeMutation.status === "loading"}
                  >
                    Upgrade Defense
                  </Button>
                </>
              ) : (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClaimTerritory}
                  disabled={claimMutation.status === "loading"}
                >
                  {claimMutation.status === "loading" ? (
                    <Loader variant="default" size="sm" className="mr-2" />
                  ) : null}
                  Claim Territory
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
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
    description: "A data-rich zone with advanced processing centers.",
    resources: {
      energy: { production: 5, storage: 50, capacity: 500 },
      data: { production: 10, storage: 100, capacity: 1000 },
      materials: { production: 2, storage: 20, capacity: 200 },
      influence: { production: 3, storage: 30, capacity: 300 },
    },
    level: 1,
    defense: 8,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  // Outer ring - Resource-rich territories
  {
    id: "3",
    x: 1,
    y: 1,
    owner: null,
    name: "Energy Nexus",
    description: "Massive energy reactors power this territory.",
    resources: {
      energy: { production: 15, storage: 150, capacity: 1500 },
      data: { production: 2, storage: 20, capacity: 200 },
      materials: { production: 3, storage: 30, capacity: 300 },
      influence: { production: 1, storage: 10, capacity: 100 },
    },
    level: 1,
    defense: 7,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "4",
    x: 3,
    y: 1,
    owner: null,
    name: "Data Haven",
    description: "Secure data centers process valuable information.",
    resources: {
      energy: { production: 3, storage: 30, capacity: 300 },
      data: { production: 12, storage: 120, capacity: 1200 },
      materials: { production: 2, storage: 20, capacity: 200 },
      influence: { production: 4, storage: 40, capacity: 400 },
    },
    level: 1,
    defense: 12,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "5",
    x: 4,
    y: 2,
    owner: null,
    name: "Material Complex",
    description: "Advanced manufacturing facilities produce rare materials.",
    resources: {
      energy: { production: 4, storage: 40, capacity: 400 },
      data: { production: 3, storage: 30, capacity: 300 },
      materials: { production: 14, storage: 140, capacity: 1400 },
      influence: { production: 2, storage: 20, capacity: 200 },
    },
    level: 1,
    defense: 9,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "6",
    x: 2,
    y: 3,
    owner: null,
    name: "Influence Hub",
    description: "A nexus of power where influence flows freely.",
    resources: {
      energy: { production: 2, storage: 20, capacity: 200 },
      data: { production: 4, storage: 40, capacity: 400 },
      materials: { production: 1, storage: 10, capacity: 100 },
      influence: { production: 13, storage: 130, capacity: 1300 },
    },
    level: 1,
    defense: 15,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  // Corner territories - Balanced resources
  {
    id: "7",
    x: 1,
    y: 3,
    owner: null,
    name: "Balanced Sector Alpha",
    description: "A well-rounded territory with diverse resources.",
    resources: {
      energy: { production: 6, storage: 60, capacity: 600 },
      data: { production: 6, storage: 60, capacity: 600 },
      materials: { production: 6, storage: 60, capacity: 600 },
      influence: { production: 6, storage: 60, capacity: 600 },
    },
    level: 1,
    defense: 10,
    lastClaimed: 0,
    upgrades: { production: 0, storage: 0, defense: 0 },
  },
  {
    id: "8",
    x: 4,
    y: 1,
    owner: null,
    name: "Balanced Sector Beta",
    description: "Strategic location with balanced resource generation.",
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
];
