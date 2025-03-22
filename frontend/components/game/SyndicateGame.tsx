import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { GameSystemsProvider } from "./GameSystems/SystemsIntegration";
import { CyberpunkDashboard } from "./Dashboard/CyberpunkDashboard";

// Mock data for development
const mockTerritories = [
  {
    id: "t1",
    name: "Central District",
    resources: 1000,
    controlledBy: "",
    influence: 50
  },
  // Add more mock territories as needed
];

interface Syndicate {
  id: string;
  name: string;
  resources: number;
  territories: string[];
  marketShare: number;
}

interface SyndicateGameProps {
  onInitialized: (initialized: boolean) => React.ReactNode;
}

export const SyndicateGame: React.FC<SyndicateGameProps> = ({ onInitialized }) => {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gameInitialized, setGameInitialized] = useState(false);

  const {
    data: syndicateData,
    isLoading: isSyndicateLoading,
    error: syndicateError,
  } = useQuery({
    queryKey: ["syndicate", account?.address],
    queryFn: async () => {
      try {
        const resources = await aptosClient.getAccountResources({ accountAddress: account!.address });
        const syndicateResource = resources.find((r) => r.type === `${account!.address}::syndicate::Syndicate`);
        if (!syndicateResource) {
          return null; // Return null instead of throwing error for uninitialized syndicate
        }
        return syndicateResource.data as Syndicate;
      } catch (error: any) {
        if (error.message?.includes("module_not_found")) {
          throw new Error("CONTRACT_NOT_DEPLOYED");
        }
        throw error;
      }
    },
    enabled: !!account?.address,
    retry: false,
  });

  const { data: territories, isLoading: isTerritoriesLoading } = useQuery({
    queryKey: ["territories"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      console.log("Fetching territories");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockTerritories;
    },
  });

  useEffect(() => {
    if (account?.address) {
      checkSyndicateInitialized();
    }
  }, [account?.address]);

  const checkSyndicateInitialized = async () => {
    try {
      // TODO: Add contract call to check if syndicate is initialized
      const initialized = false; // Replace with actual contract call
      setIsInitialized(initialized);
      return initialized;
    } catch (error) {
      console.error('Error checking syndicate initialization:', error);
      setIsInitialized(false);
      return false;
    }
  };

  const handleInitializeSyndicate = async () => {
    if (!account?.address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsInitializing(true);
    try {
      const transaction = {
        data: {
          function: `${account.address}::syndicate::initialize_syndicate`,
          typeArguments: [],
          functionArguments: [],
        },
      };

      await signAndSubmitTransaction(transaction);
      const initialized = await checkSyndicateInitialized();
      if (initialized) {
        toast({
          title: "Success",
          description: "Syndicate initialized successfully!",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error initializing syndicate:', error);
      toast({
        title: "Error",
        description: "Failed to initialize syndicate",
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (connected && syndicateData && territories) {
      setGameInitialized(true);
    }
  }, [connected, syndicateData, territories]);

  if (!account?.address) {
    return (
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold text-neon-purple mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your wallet to access Nexus Syndicates</p>
        {onInitialized(false)}
      </Card>
    );
  }

  if (isInitializing) {
    return (
      <Card className="text-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="mt-4 text-neon-blue">Initializing your syndicate...</p>
        {onInitialized(false)}
      </Card>
    );
  }

  if (isSyndicateLoading || isTerritoriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="mt-4 text-neon-blue">Initializing Nexus Frontier...</p>
      </div>
    );
  }

  if (syndicateError) {
    if ((syndicateError as Error).message === "CONTRACT_NOT_DEPLOYED") {
      return (
        <Card className="p-8 border border-red-500/20 bg-black/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-cyber text-red-400">Contract Not Deployed</h2>
              <p className="text-red-300/80">
                The Nexus Syndicates smart contract has not been deployed to the testnet yet. Please wait while the
                system administrators initialize the network.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={30} className="h-2 bg-red-950" />
              <span className="text-sm font-cyber text-red-400">OFFLINE</span>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-8 border border-red-500/20 bg-black/80 backdrop-blur-sm">
        <div className="space-y-2">
          <h2 className="text-xl font-cyber text-red-400">System Error</h2>
          <p className="text-red-300/80">
            {(syndicateError as Error).message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
      </Card>
    );
  }

  if (!syndicateData) {
    return (
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold text-neon-purple mb-4">Initialize Your Syndicate</h2>
        <p className="text-gray-400 mb-6">Create your syndicate to begin your conquest</p>
        <Button onClick={handleInitializeSyndicate} className="font-cyber">
          Initialize Syndicate
        </Button>
        {onInitialized(false)}
      </Card>
    );
  }

  return (
    <GameSystemsProvider>
      <div className="h-full">
        <CyberpunkDashboard />
        {onInitialized(true)}
      </div>
    </GameSystemsProvider>
  );
};
