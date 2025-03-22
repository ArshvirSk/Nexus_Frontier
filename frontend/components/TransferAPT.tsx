import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Internal components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";

// Constants
const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const SAFE_GAS_FEE = 0.005; // Approximate gas fee in APT

export function TransferAPT() {
  const { account, signAndSubmitTransaction } = useWallet();
  const queryClient = useQueryClient();

  const [aptBalance, setAptBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["apt-balance", account?.address],
    refetchInterval: 10_000,
    queryFn: async () => {
      if (!account?.address) {
        console.error("Account not available");
        return { balance: 0 };
      }

      try {
        const rawBalance = await getAccountAPTBalance({ accountAddress: account.address });
        const balance = Number(rawBalance) / Math.pow(10, 8); // Convert from octas to APT
        return { balance };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch balance",
        });
        return { balance: 0 };
      }
    },
    enabled: !!account?.address,
    retry: 2,
  });

  const validateAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{64}$/.test(address);
  };

  const onClickButton = async () => {
    if (!account?.address || !recipient || transferAmount <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Invalid transfer details" });
      return;
    }

    // Balance check considering gas fees
    if (transferAmount + SAFE_GAS_FEE > aptBalance) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Insufficient balance to cover transfer amount and gas fees.",
      });
      return;
    }

    try {
      setIsProcessing(true);

      if (!validateAddress(recipient)) {
        throw new Error("Invalid recipient address format. Must be a 32-byte hex string starting with 0x");
      }

      // Convert APT to octas
      const amountInOctas = BigInt(Math.round(transferAmount * 100000000));

      // Execute APT transfer using aptos_account module as shown in the example
      const transferTx = await signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer_coins",
          typeArguments: [APTOS_COIN],
          functionArguments: [recipient, amountInOctas.toString()],
        },
      });

      console.log("Transfer submitted:", transferTx.hash);

      toast({
        title: "Processing",
        description: "Transfer in progress...",
      });

      // Wait for transfer confirmation
      await aptosClient().waitForTransaction({
        transactionHash: transferTx.hash,
      });

      console.log("Transaction executed successfully");

      // Refresh balance after successful transfer
      queryClient.invalidateQueries({
        queryKey: ["apt-balance", account?.address],
      });

      toast({
        title: "Success",
        description: `Transfer completed. Hash: ${transferTx.hash.slice(0, 10)}...`,
      });

      // Reset form
      setTransferAmount(0);
      setRecipient("");
    } catch (error: any) {
      console.error("Transaction error:", error);
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error.message || "An error occurred during the transaction.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (data) {
      setAptBalance(parseFloat(data.balance.toFixed(8))); // Ensure precision
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h4 className="text-lg font-medium">
          APT balance: {isLoading ? "Loading..." : error ? "Error loading balance" : `${aptBalance.toFixed(8)} APT`}
        </h4>
        {error && <p className="text-sm text-red-500">Failed to load balance. Please check your wallet connection.</p>}
      </div>

      <div className="space-y-2">
        <label>Recipient</label>
        <Input
          placeholder="0x..."
          value={recipient}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^0x[a-fA-F0-9]*$/.test(value)) {
              setRecipient(value);
            }
          }}
        />
        {recipient && !validateAddress(recipient) && <p className="text-sm text-red-500">Invalid address format</p>}
      </div>

      <div className="space-y-2">
        <label>Amount (APT)</label>
        <Input
          type="number"
          placeholder="0.0"
          value={transferAmount || ""}
          onChange={(e) => setTransferAmount(parseFloat(e.target.value) || 0)}
          min={0}
          step={1}
        />
        {transferAmount > 0 && transferAmount + SAFE_GAS_FEE > aptBalance && (
          <p className="text-sm text-red-500">Insufficient balance (including gas fees)</p>
        )}
      </div>

      <Button
        onClick={onClickButton}
        disabled={!recipient || transferAmount <= 0 || transferAmount + SAFE_GAS_FEE > aptBalance || isProcessing}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isProcessing ? "Processing..." : "Transfer APT"}
      </Button>
    </div>
  );
}
