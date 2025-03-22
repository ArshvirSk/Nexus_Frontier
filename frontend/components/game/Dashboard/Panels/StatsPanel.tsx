import { Progress } from "@/components/ui/progress";

interface StatsPanelProps {
  stats: {
    territories: number;
    totalTerritories: number;
    agents: number;
    maxAgents: number;
    resources: {
      energy: number;
      data: number;
      materials: number;
      influence: number;
    };
    resourceCapacity: {
      energy: number;
      data: number;
      materials: number;
      influence: number;
    };
    upgrades: number;
    level: number;
  };
}

export const StatsPanel = ({ stats }: StatsPanelProps) => {
  return (
    <div className="h-full flex flex-col p-4 bg-black/50 rounded-lg border border-purple-500/30 text-purple-100">
      <h3 className="text-xl font-cyberpunk text-purple-300 mb-4">Player Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 rounded p-3 border border-purple-800/50">
          <div className="text-xs text-purple-400 mb-1">Territories</div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-medium">{stats.territories}</span>
            <span className="text-xs text-gray-400">of {stats.totalTerritories}</span>
          </div>
          <Progress 
            value={(stats.territories / stats.totalTerritories) * 100} 
            className="h-1 bg-purple-950"
          />
        </div>
        
        <div className="bg-black/40 rounded p-3 border border-purple-800/50">
          <div className="text-xs text-purple-400 mb-1">Agents</div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-medium">{stats.agents}</span>
            <span className="text-xs text-gray-400">of {stats.maxAgents}</span>
          </div>
          <Progress 
            value={(stats.agents / stats.maxAgents) * 100} 
            className="h-1 bg-purple-950"
          />
        </div>
        
        <div className="bg-black/40 rounded p-3 border border-purple-800/50">
          <div className="text-xs text-purple-400 mb-1">Resource Usage</div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-green-400">Energy</span>
                <span>{stats.resources.energy}/{stats.resourceCapacity.energy}</span>
              </div>
              <Progress 
                value={(stats.resources.energy / stats.resourceCapacity.energy) * 100} 
                className="h-1 bg-green-950"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400">Data</span>
                <span>{stats.resources.data}/{stats.resourceCapacity.data}</span>
              </div>
              <Progress 
                value={(stats.resources.data / stats.resourceCapacity.data) * 100} 
                className="h-1 bg-blue-950"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 rounded p-3 border border-purple-800/50">
          <div className="text-xs text-purple-400 mb-1">Player Level</div>
          <div className="text-center">
            <div className="text-2xl font-cyberpunk text-cyan-400">{stats.level}</div>
            <div className="text-xs text-gray-400">{stats.upgrades} upgrades available</div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="flex flex-col items-center bg-black/30 p-2 rounded">
          <div className="text-xs text-purple-400">Daily Income</div>
          <div className="text-lg font-medium text-green-400">+{stats.resources.energy * 24}</div>
        </div>
        <div className="flex flex-col items-center bg-black/30 p-2 rounded">
          <div className="text-xs text-purple-400">Defense Rating</div>
          <div className="text-lg font-medium text-cyan-400">{stats.territories * 5}</div>
        </div>
      </div>
    </div>
  );
};
