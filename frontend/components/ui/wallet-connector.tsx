import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "./button";
import { toast } from "react-hot-toast";

export function WalletConnector() {
  const { connect, account, disconnect, connected } = useWallet();

  const handleConnect = async () => {
    try {
      await connect("Petra");
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  if (!connected || !account) {
    return (
      <Button
        onClick={handleConnect}
        className="bg-neon-purple hover:bg-neon-purple/80 text-white"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDisconnect}
      className="bg-neon-red hover:bg-neon-red/80 text-white"
    >
      {account.address?.toString().slice(0, 6)}...{account.address?.toString().slice(-4)}
    </Button>
  );
}
