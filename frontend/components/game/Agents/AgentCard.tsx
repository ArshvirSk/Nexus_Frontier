import { Agent, AgentAbility } from "@/types/agents";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useAgentManager } from "./AgentManager";

interface AgentCardProps {
  agent: Agent;
  onDeploy?: (agent: Agent) => void;
  onRecall?: () => void;
  showActions?: boolean;
}

export function AgentCard({ agent, onDeploy, onRecall, showActions = true }: AgentCardProps) {
  const [showAbilities, setShowAbilities] = useState(false);
  const { useAgentAbility } = useAgentManager();

  // Calculate time remaining for agent status
  const getTimeRemaining = () => {
    if (!agent.deployedUntil) return null;
    
    const now = Date.now();
    const remaining = Math.max(0, agent.deployedUntil - now);
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate ability cooldown
  const getAbilityCooldown = (ability: AgentAbility) => {
    if (!ability.lastUsed) return null;
    
    const now = Date.now();
    const cooldownEnd = ability.lastUsed + ability.cooldown;
    
    if (now >= cooldownEnd) return null;
    
    const remaining = cooldownEnd - now;
    const minutes = Math.floor(remaining / 60000);
    
    return `${minutes}m`;
  };

  // Calculate XP to next level (simple formula: level * 100)
  const xpToNextLevel = agent.level * 100;
  const xpProgress = (agent.experience / xpToNextLevel) * 100;

  return (
    <Card className="w-full bg-black border border-cyan-500/30 text-white overflow-hidden">
      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-black to-gray-900">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: agent.appearance.color + '33', border: `2px solid ${agent.appearance.color}` }}
          >
            {getAgentIcon(agent.class)}
          </div>
          <div>
            <h3 className="text-lg font-bold">{agent.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase text-cyan-400">
                {agent.class} • Lvl {agent.level}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" 
                style={{ 
                  backgroundColor: getStatusColor(agent.status) + '33', 
                  color: getStatusColor(agent.status)
                }}
              >
                {agent.status.toUpperCase()}
                {agent.deployedUntil && agent.status !== "idle" && ` (${getTimeRemaining()})`}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
          <div>
            <div className="text-gray-400">Efficiency</div>
            <div className="flex items-center">
              <Progress value={agent.stats.efficiency * 10} className="h-1.5 mr-2" />
              <span>{agent.stats.efficiency}</span>
            </div>
          </div>
          <div>
            <div className="text-gray-400">Resilience</div>
            <div className="flex items-center">
              <Progress value={agent.stats.resilience * 10} className="h-1.5 mr-2" />
              <span>{agent.stats.resilience}</span>
            </div>
          </div>
          <div>
            <div className="text-gray-400">Intelligence</div>
            <div className="flex items-center">
              <Progress value={agent.stats.intelligence * 10} className="h-1.5 mr-2" />
              <span>{agent.stats.intelligence}</span>
            </div>
          </div>
        </div>
        
        {agent.specialization && (
          <div className="text-xs mb-3">
            <span className="text-gray-400">Specialization: </span>
            <span className="font-semibold" style={{ color: getResourceColor(agent.specialization) }}>
              {agent.specialization.charAt(0).toUpperCase() + agent.specialization.slice(1)}
            </span>
          </div>
        )}
        
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Experience</span>
            <span>{agent.experience} / {xpToNextLevel}</span>
          </div>
          <Progress value={xpProgress} className="h-1.5" />
        </div>
        
        {showAbilities && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2 text-cyan-400">Abilities</h4>
            <div className="space-y-2">
              {agent.abilities.map(ability => (
                <div key={ability.id} className="p-2 bg-gray-900/50 rounded border border-gray-800">
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm font-medium">{ability.name}</h5>
                    {showActions && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        disabled={
                          agent.status !== "deployed" || 
                          (ability.lastUsed && Date.now() < ability.lastUsed + ability.cooldown)
                        }
                        onClick={() => useAgentAbility(agent.id, ability.id, agent.deployedAt || undefined)}
                      >
                        {getAbilityCooldown(ability) || "Use"}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{ability.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAbilities(!showAbilities)}
          >
            {showAbilities ? "Hide Abilities" : "Show Abilities"}
          </Button>
          
          {agent.status === "idle" && onDeploy && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onDeploy(agent)}
            >
              Deploy
            </Button>
          )}
          
          {agent.status === "deployed" && onRecall && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onRecall}
            >
              Recall
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

// Helper functions
function getAgentIcon(agentClass: string): string {
  switch (agentClass) {
    case "hacker": return "👨‍💻";
    case "enforcer": return "💪";
    case "trader": return "💼";
    case "infiltrator": return "🕵️";
    case "technician": return "🔧";
    default: return "🤖";
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "idle": return "#00ff00";
    case "deployed": return "#00ffff";
    case "cooldown": return "#ff9900";
    case "training": return "#9900ff";
    default: return "#ffffff";
  }
}

function getResourceColor(resourceType: string): string {
  switch (resourceType) {
    case "energy": return "#00ff00";
    case "data": return "#00ffff";
    case "materials": return "#ff9900";
    case "influence": return "#ff00ff";
    default: return "#ffffff";
  }
}
