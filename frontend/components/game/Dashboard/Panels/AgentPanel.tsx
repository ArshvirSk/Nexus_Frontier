import { Agent } from '@/types/agents';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface AgentPanelProps {
  selectedAgent: Agent | null;
}

export function AgentPanel({ selectedAgent }: AgentPanelProps) {
  if (!selectedAgent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
        <div className="text-6xl mb-2">🤖</div>
        <div className="text-sm">No agent selected</div>
        <div className="text-xs mt-1">Select an agent to view details</div>
      </div>
    );
  }

  // Calculate cooldown percentage
  const cooldownPercentage = selectedAgent.cooldown ? 
    Math.min(100, (selectedAgent.cooldown / selectedAgent.cooldownMax) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col">
      {/* Agent Avatar */}
      <div className="flex items-center mb-3">
        <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-cyan-500/50 flex items-center justify-center mr-3">
          <span className="text-3xl">{getAgentIcon(selectedAgent.class)}</span>
        </div>
        <div>
          <div className="text-lg font-cyber text-cyan-400">{selectedAgent.name}</div>
          <div className="text-xs text-gray-400 capitalize">{selectedAgent.class} • Level {selectedAgent.level}</div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs text-green-400">
              {selectedAgent.deployed ? 'Deployed' : 'Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-800/60 rounded p-2">
          <div className="text-xs text-gray-400">Efficiency</div>
          <div className="text-lg text-cyan-400">{selectedAgent.stats.efficiency}</div>
        </div>
        <div className="bg-gray-800/60 rounded p-2">
          <div className="text-xs text-gray-400">Intelligence</div>
          <div className="text-lg text-cyan-400">{selectedAgent.stats.intelligence}</div>
        </div>
        <div className="bg-gray-800/60 rounded p-2">
          <div className="text-xs text-gray-400">Stealth</div>
          <div className="text-lg text-cyan-400">{selectedAgent.stats.stealth}</div>
        </div>
        <div className="bg-gray-800/60 rounded p-2">
          <div className="text-xs text-gray-400">Combat</div>
          <div className="text-lg text-cyan-400">{selectedAgent.stats.combat}</div>
        </div>
      </div>

      {/* Agent Abilities */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 mb-1">Abilities</div>
        <div className="space-y-2">
          {selectedAgent.abilities.map((ability, index) => (
            <div key={index} className="bg-gray-800/60 rounded p-2 flex justify-between items-center">
              <div>
                <div className="text-sm text-cyan-400">{ability.name}</div>
                <div className="text-xs text-gray-400">{ability.description.substring(0, 30)}...</div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 text-xs border-cyan-500/50 text-cyan-400"
                disabled={selectedAgent.cooldown > 0 || !selectedAgent.deployed}
              >
                Use
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Cooldown */}
      <div className="mt-auto">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Cooldown</span>
          <span className="text-cyan-400">
            {selectedAgent.cooldown > 0 ? `${Math.ceil(selectedAgent.cooldown / 60000)} min` : 'Ready'}
          </span>
        </div>
        <Progress value={cooldownPercentage} className="h-2" />
      </div>
    </div>
  );
}

// Helper function to get agent icon
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
