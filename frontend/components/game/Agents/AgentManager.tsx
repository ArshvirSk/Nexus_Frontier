import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Agent, AgentClass, AGENT_TEMPLATES } from "@/types/agents";
import { Territory } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface AgentManagerContextType {
  agents: Agent[];
  createAgent: (name: string, agentClass: AgentClass) => Agent;
  deployAgent: (agentId: string, territoryId: string, duration: number) => void;
  recallAgent: (agentId: string) => void;
  useAgentAbility: (agentId: string, abilityId: string, targetTerritoryId?: string) => void;
  getAgentsForTerritory: (territoryId: string) => Agent[];
  getIdleAgents: () => Agent[];
}

const AgentManagerContext = createContext<AgentManagerContextType | undefined>(undefined);

export function useAgentManager() {
  const context = useContext(AgentManagerContext);
  if (!context) {
    throw new Error("useAgentManager must be used within an AgentManagerProvider");
  }
  return context;
}

interface AgentManagerProviderProps {
  children: ReactNode;
  territories: Territory[];
}

export function AgentManagerProvider({ children, territories }: AgentManagerProviderProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const { toast } = useToast();
  const { account } = useWallet();

  // Load agents from local storage on component mount
  useEffect(() => {
    if (!account?.address) return;
    
    const savedAgents = localStorage.getItem(`agents_${account.address}`);
    if (savedAgents) {
      try {
        setAgents(JSON.parse(savedAgents));
      } catch (error) {
        console.error("Failed to parse saved agents:", error);
      }
    } else {
      // Create default starter agent for new players
      const starterAgent = createNewAgent("NetRunner", "hacker");
      setAgents([starterAgent]);
      saveAgents([starterAgent]);
    }
  }, [account?.address]);

  // Save agents to local storage whenever they change
  const saveAgents = (agentList: Agent[]) => {
    if (!account?.address) return;
    localStorage.setItem(`agents_${account.address}`, JSON.stringify(agentList));
  };

  // Check agent status and update accordingly
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      let updated = false;

      setAgents((currentAgents) => {
        const updatedAgents = currentAgents.map(agent => {
          // Check if deployed agent's time is up
          if (agent.status === "deployed" && agent.deployedUntil && agent.deployedUntil < now) {
            updated = true;
            return {
              ...agent,
              status: "cooldown",
              deployedAt: null,
              deployedUntil: now + 900000 // 15 minute cooldown after deployment
            };
          }
          
          // Check if cooldown is over
          if (agent.status === "cooldown" && agent.deployedUntil && agent.deployedUntil < now) {
            updated = true;
            return {
              ...agent,
              status: "idle",
              deployedUntil: null
            };
          }
          
          // Check if training is complete
          if (agent.status === "training" && agent.deployedUntil && agent.deployedUntil < now) {
            updated = true;
            return {
              ...agent,
              status: "idle",
              deployedUntil: null,
              level: agent.level + 1,
              stats: {
                efficiency: Math.min(10, agent.stats.efficiency + Math.random()),
                resilience: Math.min(10, agent.stats.resilience + Math.random()),
                intelligence: Math.min(10, agent.stats.intelligence + Math.random())
              }
            };
          }
          
          return agent;
        });
        
        if (updated) {
          saveAgents(updatedAgents);
        }
        
        return updated ? updatedAgents : currentAgents;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [account?.address]);

  // Create a new agent
  const createNewAgent = (name: string, agentClass: AgentClass): Agent => {
    const template = AGENT_TEMPLATES[agentClass];
    return {
      ...template,
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      deployedAt: null,
      deployedUntil: null
    };
  };

  const createAgent = (name: string, agentClass: AgentClass): Agent => {
    const newAgent = createNewAgent(name, agentClass);
    
    setAgents(currentAgents => {
      const updatedAgents = [...currentAgents, newAgent];
      saveAgents(updatedAgents);
      return updatedAgents;
    });
    
    toast({
      title: "Agent Recruited",
      description: `${name} has joined your syndicate as a ${agentClass}.`,
      variant: "default",
    });
    
    return newAgent;
  };

  const deployAgent = (agentId: string, territoryId: string, duration: number) => {
    setAgents(currentAgents => {
      const updatedAgents = currentAgents.map(agent => {
        if (agent.id === agentId && agent.status === "idle") {
          const deployedUntil = Date.now() + duration;
          
          toast({
            title: "Agent Deployed",
            description: `${agent.name} has been deployed to territory ${territories.find(t => t.id === territoryId)?.name || territoryId}.`,
            variant: "default",
          });
          
          return {
            ...agent,
            status: "deployed",
            deployedAt: territoryId,
            deployedUntil
          };
        }
        return agent;
      });
      
      saveAgents(updatedAgents);
      return updatedAgents;
    });
  };

  const recallAgent = (agentId: string) => {
    setAgents(currentAgents => {
      const updatedAgents = currentAgents.map(agent => {
        if (agent.id === agentId && agent.status === "deployed") {
          const cooldownTime = Date.now() + 900000; // 15 minute cooldown
          
          toast({
            title: "Agent Recalled",
            description: `${agent.name} has been recalled and will be on cooldown for 15 minutes.`,
            variant: "default",
          });
          
          return {
            ...agent,
            status: "cooldown",
            deployedAt: null,
            deployedUntil: cooldownTime
          };
        }
        return agent;
      });
      
      saveAgents(updatedAgents);
      return updatedAgents;
    });
  };

  const useAgentAbility = (agentId: string, abilityId: string, targetTerritoryId?: string) => {
    setAgents(currentAgents => {
      const updatedAgents = currentAgents.map(agent => {
        if (agent.id === agentId) {
          const ability = agent.abilities.find(a => a.id === abilityId);
          
          if (!ability) {
            toast({
              title: "Ability Not Found",
              description: "The selected ability does not exist.",
              variant: "destructive",
            });
            return agent;
          }
          
          if (ability.lastUsed && Date.now() < ability.lastUsed + ability.cooldown) {
            toast({
              title: "Ability on Cooldown",
              description: "This ability is still on cooldown.",
              variant: "destructive",
            });
            return agent;
          }
          
          // Update ability last used time
          const updatedAbilities = agent.abilities.map(a => 
            a.id === abilityId ? { ...a, lastUsed: Date.now() } : a
          );
          
          toast({
            title: "Ability Activated",
            description: `${agent.name} used ${ability.name}.`,
            variant: "default",
          });
          
          return {
            ...agent,
            abilities: updatedAbilities,
            // Add experience for using ability
            experience: agent.experience + 10
          };
        }
        return agent;
      });
      
      saveAgents(updatedAgents);
      return updatedAgents;
    });
  };

  const getAgentsForTerritory = (territoryId: string) => {
    return agents.filter(agent => agent.deployedAt === territoryId);
  };

  const getIdleAgents = () => {
    return agents.filter(agent => agent.status === "idle");
  };

  return (
    <AgentManagerContext.Provider
      value={{
        agents,
        createAgent,
        deployAgent,
        recallAgent,
        useAgentAbility,
        getAgentsForTerritory,
        getIdleAgents,
      }}
    >
      {children}
    </AgentManagerContext.Provider>
  );
}
