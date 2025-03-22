import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
// Internal components
import { toast } from "@/components/ui/use-toast";
// Internal constants
import { APTOS_API_KEY, NETWORK } from "@/constants";

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: NETWORK, aptosApiKeys: { [NETWORK]: APTOS_API_KEY } }}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
