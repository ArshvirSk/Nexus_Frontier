import { useState } from "react";
import { useAgentManager } from "./AgentManager";
import { AgentCard } from "./AgentCard";
import { Agent, AgentClass } from "@/types/agents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Territory } from "@/types/game";

interface AgentListProps {
  territories: Territory[];
  onDeployAgent?: (agent: Agent, territoryId: string) => void;
}

export function AgentList({ territories, onDeployAgent }: AgentListProps) {
  const { agents, createAgent, getIdleAgents, recallAgent } = useAgentManager();
  const [selectedTerritory, setSelectedTerritory] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isRecruitDialogOpen, setIsRecruitDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentClass, setNewAgentClass] = useState<AgentClass>("hacker");
  
  // Filter agents by status
  const idleAgents = agents.filter(agent => agent.status === "idle");
  const deployedAgents = agents.filter(agent => agent.status === "deployed");
  const cooldownAgents = agents.filter(agent => agent.status === "cooldown" || agent.status === "training");
  
  // Handle agent deployment
  const handleDeploy = (agent: Agent) => {
    setSelectedAgent(agent);
    setSelectedTerritory(null);
  };
  
  // Confirm deployment to a specific territory
  const confirmDeploy = (territoryId: string) => {
    if (selectedAgent && onDeployAgent) {
      onDeployAgent(selectedAgent, territoryId);
      setSelectedAgent(null);
    }
  };
  
  // Handle agent recruitment
  const handleRecruit = () => {
    if (newAgentName.trim() === "") return;
    
    createAgent(newAgentName, newAgentClass);
    setNewAgentName("");
    setIsRecruitDialogOpen(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Agent Network</h2>
        <Dialog open={isRecruitDialogOpen} onOpenChange={setIsRecruitDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Recruit Agent</Button>
          </DialogTrigger>
          <DialogContent className="bg-black border border-cyan-500/50 text-white">
            <DialogHeader>
              <DialogTitle className="text-cyan-400">Recruit New Agent</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input 
                  id="agent-name" 
                  value={newAgentName} 
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="bg-gray-900 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Agent Class</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["hacker", "enforcer", "trader", "infiltrator", "technician"] as AgentClass[]).map((agentClass) => (
                    <Button
                      key={agentClass}
                      variant={newAgentClass === agentClass ? "default" : "outline"}
                      onClick={() => setNewAgentClass(agentClass)}
                      className="justify-start"
                    >
                      <span className="mr-2">{getAgentClassIcon(agentClass)}</span>
                      {capitalizeFirstLetter(agentClass)}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleRecruit} className="w-full">Recruit</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {selectedAgent ? (
        <Card className="bg-black/80 border border-cyan-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-lg">
              Select Territory for {selectedAgent.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {territories.map(territory => (
                <Button
                  key={territory.id}
                  variant="outline"
                  className={`justify-start ${selectedTerritory === territory.id ? 'border-cyan-500' : ''}`}
                  onClick={() => setSelectedTerritory(territory.id)}
                >
                  {territory.name}
                </Button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setSelectedAgent(null)}>
                Cancel
              </Button>
              <Button 
                variant="default" 
                disabled={!selectedTerritory}
                onClick={() => selectedTerritory && confirmDeploy(selectedTerritory)}
              >
                Deploy
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="idle" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="idle">
              Idle ({idleAgents.length})
            </TabsTrigger>
            <TabsTrigger value="deployed">
              Deployed ({deployedAgents.length})
            </TabsTrigger>
            <TabsTrigger value="cooldown">
              Cooldown ({cooldownAgents.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="idle" className="space-y-4">
            {idleAgents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No idle agents available
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {idleAgents.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    onDeploy={() => handleDeploy(agent)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deployed" className="space-y-4">
            {deployedAgents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No deployed agents
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deployedAgents.map(agent => {
                  const territory = territories.find(t => t.id === agent.deployedAt);
                  return (
                    <AgentCard 
                      key={agent.id} 
                      agent={agent}
                      onRecall={() => recallAgent(agent.id)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cooldown" className="space-y-4">
            {cooldownAgents.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No agents on cooldown
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cooldownAgents.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Helper functions
function getAgentClassIcon(agentClass: string): string {
  switch (agentClass) {
    case "hacker": return "👨‍💻";
    case "enforcer": return "💪";
    case "trader": return "💼";
    case "infiltrator": return "🕵️";
    case "technician": return "🔧";
    default: return "🤖";
  }
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
