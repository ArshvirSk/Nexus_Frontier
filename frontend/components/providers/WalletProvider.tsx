import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PropsWithChildren } from "react";
import { useToast } from "@/components/ui/use-toast";

export function WalletProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();
  // Initialize PetraWallet
  const wallets = [new PetraWallet()] as any[];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.error("Wallet error:", error);
        toast({
          variant: "destructive",
          title: "Wallet Error",
          description: error?.message || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
