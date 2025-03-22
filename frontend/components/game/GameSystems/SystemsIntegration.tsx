import { useState } from "react";
import { Territory } from "@/types/game";
import { Agent } from "@/types/agents";
import { AgentManagerProvider, useAgentManager } from "../Agents/AgentManager";
import { AllianceManagerProvider, useAllianceManager } from "../Alliances/AllianceManager";
import { AgentList } from "../Agents/AgentList";
import { AllianceDashboard } from "../Alliances/AllianceDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgentCard } from "../Agents/AgentCard";

interface SystemsIntegrationProps {
  territories: Territory[];
  selectedTerritory: Territory | null;
}

// Wrapper component that provides context providers
export function GameSystemsProvider({ children, territories }: { children: React.ReactNode, territories: Territory[] }) {
  return (
    <AgentManagerProvider territories={territories}>
      <AllianceManagerProvider territories={territories}>
        {children}
      </AllianceManagerProvider>
    </AgentManagerProvider>
  );
}

// Main systems integration component
export function SystemsIntegration({ territories, selectedTerritory }: SystemsIntegrationProps) {
  const [isSystemsDialogOpen, setIsSystemsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"agents" | "alliances">("agents");
  const [isAgentDeploymentDialogOpen, setIsAgentDeploymentDialogOpen] = useState(false);
  
  // Get territory agents if a territory is selected
  const { getAgentsForTerritory, deployAgent } = useAgentManager();
  const territoryAgents = selectedTerritory ? getAgentsForTerritory(selectedTerritory.id) : [];
  
  // Get alliance color for territory visualization
  const { getAllianceColor } = useAllianceManager();
  const allianceColor = getAllianceColor();
  
  // Handle agent deployment
  const handleDeployAgent = (agent: Agent, territoryId: string) => {
    // Deploy for 1 hour (3,600,000 ms)
    deployAgent(agent.id, territoryId, 3600000);
    setIsAgentDeploymentDialogOpen(false);
  };
  
  return (
    <>
      {/* Systems Button */}
      <div className="fixed bottom-4 right-4 z-10">
        <Button 
          variant="default" 
          size="lg"
          className="rounded-full h-14 w-14 p-0 bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg shadow-purple-900/50"
          onClick={() => setIsSystemsDialogOpen(true)}
        >
          <span className="sr-only">Open Systems</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Button>
      </div>
      
      {/* Systems Dialog */}
      <Dialog open={isSystemsDialogOpen} onOpenChange={setIsSystemsDialogOpen}>
        <DialogContent className="bg-black border border-cyan-500/50 text-white max-w-4xl h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 text-xl">Nexus Systems</DialogTitle>
          </DialogHeader>
          
          <Tabs 
            defaultValue="agents" 
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "agents" | "alliances")}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="agents">Agent Network</TabsTrigger>
              <TabsTrigger value="alliances">Alliance Network</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agents" className="flex-1 overflow-auto">
              <AgentList 
                territories={territories} 
                onDeployAgent={handleDeployAgent}
              />
            </TabsContent>
            
            <TabsContent value="alliances" className="flex-1 overflow-auto">
              <AllianceDashboard />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Territory Agents Dialog */}
      {selectedTerritory && (
        <Dialog open={isAgentDeploymentDialogOpen} onOpenChange={setIsAgentDeploymentDialogOpen}>
          <DialogContent className="bg-black border border-cyan-500/50 text-white">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">
                Agents in {selectedTerritory.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {territoryAgents.length === 0 ? (
                <div className="text-center py-4 text-gray-400">
                  No agents deployed to this territory
                </div>
              ) : (
                <div className="space-y-4">
                  {territoryAgents.map(agent => (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent}
                      onRecall={() => {
                        // Recall the agent
                        const { recallAgent } = useAgentManager();
                        recallAgent(agent.id);
                      }}
                    />
                  ))}
                </div>
              )}
              
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => {
                  setIsAgentDeploymentDialogOpen(false);
                  setIsSystemsDialogOpen(true);
                  setActiveTab("agents");
                }}
              >
                {territoryAgents.length === 0 ? "Deploy Agents" : "Manage Agents"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Component to render territory agent indicators on the map
export function TerritoryAgentIndicator({ territory }: { territory: Territory }) {
  const { getAgentsForTerritory } = useAgentManager();
  const territoryAgents = getAgentsForTerritory(territory.id);
  
  if (territoryAgents.length === 0) return null;
  
  return (
    <div 
      className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 z-10"
      title={`${territoryAgents.length} agent${territoryAgents.length > 1 ? 's' : ''} deployed`}
    >
      <div className="w-5 h-5 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center text-xs text-white">
        {territoryAgents.length}
      </div>
    </div>
  );
}

// Component to render alliance indicators on the map
export function TerritoryAllianceIndicator({ territory }: { territory: Territory }) {
  // In a real implementation, this would check if the territory belongs to an alliance
  // For now, we'll just use the current user's alliance color if they have one
  const { getAllianceColor } = useAllianceManager();
  const allianceColor = getAllianceColor();
  
  if (!allianceColor || !territory.owner) return null;
  
  return (
    <div 
      className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 z-10"
      title="Alliance territory"
    >
      <div 
        className="w-4 h-4 rounded-full border-2 border-white"
        style={{ backgroundColor: allianceColor }}
      />
    </div>
  );
}
