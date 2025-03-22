import { AgentManagement } from "@/components/game/AgentManagement";
import { DiplomacyInterface } from "@/components/game/DiplomacyInterface";
import { Marketplace } from "@/components/game/Marketplace";
import { SyndicateGame } from "@/components/game/SyndicateGame";
import { TerritoryMap } from "@/components/game/TerritoryMap";
import { FontProvider } from "@/components/providers/FontProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WalletConnector } from "@/components/ui/wallet-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import "./styles/globals.css";

const queryClient = new QueryClient();

function ErrorFallback() {
  return (
    <Card className="p-4 bg-dark-gray border-neon-red">
      <h2 className="text-xl font-cyber font-bold text-neon-red mb-2">System Malfunction</h2>
      <p className="text-gray-400">A critical error has occurred. Please refresh to reconnect.</p>
    </Card>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <FontProvider>
          <WalletProvider>
            <div className="min-h-screen bg-darker-gray text-white p-4">
              <header className="mb-8">
                <Card className="p-6" hover glass>
                  <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-cyber font-bold text-gradient">
                      Nexus Syndicates
                    </h1>
                    <WalletConnector />
                  </div>
                </Card>
              </header>

              <main>
                <Tabs defaultValue="territory" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="territory">Territory Control</TabsTrigger>
                    <TabsTrigger value="agents">Agents</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="diplomacy">Diplomacy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="territory" className="space-y-4">
                    <TerritoryMap />
                  </TabsContent>

                  <TabsContent value="agents">
                    <AgentManagement />
                  </TabsContent>

                  <TabsContent value="market">
                    <Marketplace />
                  </TabsContent>

                  <TabsContent value="diplomacy">
                    <DiplomacyInterface />
                  </TabsContent>
                </Tabs>
              </main>
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "!bg-dark-gray !text-white !border !border-neon-blue",
                style: {
                  background: "var(--dark-gray)",
                  color: "white",
                  border: "1px solid var(--neon-blue)",
                },
              }}
            />
          </WalletProvider>
        </FontProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
