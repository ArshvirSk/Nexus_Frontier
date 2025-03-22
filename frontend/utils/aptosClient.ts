import { APTOS_API_KEY, NETWORK } from "@/constants";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Custom configuration for local development
const config = new AptosConfig({
  network: NETWORK as Network,
  // Use environment-specific settings
  ...(import.meta.env.DEV && {
    fullnode: "https://fullnode.testnet.aptoslabs.com/v1",
  }),
  ...(APTOS_API_KEY && {
    headers: {
      "x-api-key": APTOS_API_KEY,
    },
  }),
});

// Create a singleton instance of Aptos client
const aptos = new Aptos(config);

// Export the singleton instance directly
export const aptosClient = aptos;
