import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Territory {
  id: string;
  name: string;
  resources: number;
  controlledBy: string;
  influence: number;
}

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
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
      toast.error('Please connect your wallet first');
      return;
    }

    setIsInitializing(true);
    try {
      const transaction: InputTransactionData = {
        data: {
          function: `${account.address}::syndicate::initialize_syndicate`,
          typeArguments: [],
          functionArguments: [],
        },
      };

      const response = await signAndSubmitTransaction(transaction);
      const initialized = await checkSyndicateInitialized();
      if (initialized) {
        toast.success('Syndicate initialized successfully!');
      }
    } catch (error) {
      console.error('Error initializing syndicate:', error);
      toast.error('Failed to initialize syndicate');
    } finally {
      setIsInitializing(false);
    }
  };

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

  if (isSyndicateLoading) {
    return (
      <Card className="p-8 flex items-center justify-center border border-cyan-500/20 bg-black/80 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </Card>
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

  if (!isInitialized) {
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

  // Rest of the component for displaying syndicate data
  return (
    <Card className="p-8 border border-cyan-500/20 bg-black/80 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-cyber text-cyan-400">{syndicateData.name || "Your Syndicate"}</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <p className="text-sm text-cyan-300/80">Resources</p>
              <Progress value={syndicateData.resources} className="h-2 bg-cyan-950" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-cyan-300/80">Market Share</p>
              <Progress value={syndicateData.marketShare} className="h-2 bg-cyan-950" />
            </div>
          </div>
        </div>
      </div>
      {onInitialized(true)}
    </Card>
  );
};
