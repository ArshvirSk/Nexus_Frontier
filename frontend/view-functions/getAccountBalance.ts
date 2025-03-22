import { aptosClient } from "@/utils/aptosClient";
import { AccountInfo } from "@aptos-labs/wallet-adapter-react";

export type AccountAPTBalanceArguments = {
  accountAddress: AccountInfo["address"];
};

export const getAccountAPTBalance = async (args: AccountAPTBalanceArguments): Promise<bigint> => {
  const { accountAddress } = args;

  try {
    // Check if the account has the CoinStore registered
    const resources = await aptosClient().getAccountResources({
      accountAddress,
    });

    // Look for the CoinStore resource
    const coinStore = resources.find((res: any) => res.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");

    // If no CoinStore, it means the account hasn't registered it
    if (!coinStore) {
      console.warn("CoinStore not registered for the account.");
      return BigInt(0); // No balance available
    }

    // Extract balance from the CoinStore
    const balance = BigInt(coinStore.data.coin.value);
    return balance;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw error;
  }
};
