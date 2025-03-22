import React, { useState } from 'react';
import { Territory } from '@/types/game';
import { Agent } from '@/types/agents';
import { useAgentManager } from '../Agents/AgentManager';
import { useAllianceManager } from '../Alliances/AllianceManager';
import { HexGrid } from '../TerritoryMap/HexGrid';
import { AgentPanel } from './Panels/AgentPanel';
import { MarketPanel } from './Panels/MarketPanel';
import { ResourcePanel } from './Panels/ResourcePanel';
import { AlliancePanel } from './Panels/AlliancePanel';
import { StatsPanel } from './Panels/StatsPanel';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface CyberpunkDashboardProps {
  territories: Territory[];
}

export function CyberpunkDashboard({ territories }: CyberpunkDashboardProps) {
  const { account } = useWallet();
  const { agents, getAgentsForTerritory } = useAgentManager();
  const { alliance } = useAllianceManager();
  
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  // Handle territory selection
  const handleTerritorySelect = (territory: Territory) => {
    setSelectedTerritory(territory);
  };
  
  // Handle agent selection
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };
  
  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden p-2">
      <div className="w-full h-full border-2 border-cyan-500/50 rounded-lg p-4 bg-black/90 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-xl font-cyber text-cyan-400">NEXUS FRONTIER</div>
          <div className="text-sm text-gray-400">
            {account?.address ? `CONNECTED: ${account.address.substring(0, 8)}...` : 'DISCONNECTED'}
          </div>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 grid-rows-6 gap-3 flex-1">
          {/* Left Column - Resource Monitor & Controls */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 gap-3">
            {/* Resource Monitor */}
            <div className="row-span-3 bg-gray-900/80 border border-cyan-500/30 rounded-lg p-2 flex flex-col">
              <div className="text-sm font-cyber text-cyan-400 mb-2 border-b border-cyan-500/30 pb-1">
                SYSTEM MONITOR
              </div>
              <ResourcePanel />
            </div>
            
            {/* Control Buttons */}
            <div className="row-span-3 bg-gray-900/80 border border-cyan-500/30 rounded-lg p-2 grid grid-cols-2 grid-rows-4 gap-2">
              <div className="text-sm font-cyber text-cyan-400 mb-1 border-b border-cyan-500/30 pb-1 col-span-2">
                CONTROL SYSTEMS
              </div>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">⚡</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">💾</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">👥</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">🔧</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">🔒</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">📊</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">🔍</span>
                </div>
              </button>
              
              <button className="bg-gray-800 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">⚙️</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Center Column - Territory Map */}
          <div className="col-span-6 row-span-6 flex flex-col gap-3">
            {/* Main Map */}
            <div className="flex-1 bg-gray-900/80 border border-cyan-500/30 rounded-lg p-2 flex flex-col">
              <div className="text-sm font-cyber text-cyan-400 mb-2 border-b border-cyan-500/30 pb-1">
                TERRITORY NETWORK
              </div>
              <div className="flex-1 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <HexGrid
                    territories={territories}
                    selectedTerritory={selectedTerritory}
                    onTerritorySelect={handleTerritorySelect}
                    userAddress={account?.address?.toString()}
                  />
                </div>
              </div>
            </div>
            
            {/* Agent Management */}
            <div className="h-32 bg-gray-900/80 border border-cyan-500/30 rounded-lg p-2 flex flex-col">
              <div className="text-sm font-cyber text-cyan-400 mb-2 border-b border-cyan-500/30 pb-1">
                AGENT MANAGEMENT
              </div>
              <div className="flex-1 flex gap-2">
                <div className="w-32 h-full bg-gray-800/80 border border-cyan-500/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl text-cyan-400">
                      {agents.length}
                    </div>
                    <div className="text-xs text-gray-400">ACTIVE AGENTS</div>
                  </div>
                </div>
                <div className="flex-1 overflow-x-auto flex gap-2 p-1">
                  {agents.slice(0, 4).map(agent => (
                    <div 
                      key={agent.id}
                      className={`h-full aspect-square bg-gray-800 border rounded-lg flex flex-col items-center justify-center cursor-pointer
                        ${selectedAgent?.id === agent.id ? 'border-cyan-400' : 'border-gray-700'}`}
                      onClick={() => handleAgentSelect(agent)}
                    >
                      <div className="text-xl">{getAgentIcon(agent.class)}</div>
                      <div className="text-xs mt-1">{agent.name.split(' ')[0]}</div>
                      <div className="text-xs text-cyan-400">Lvl {agent.level}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Agent Details & Market */}
          <div className="col-span-3 row-span-6 grid grid-rows-6 gap-3">
            {/* Agent Details */}
            <div className="row-span-3 bg-gray-900/80 border border-cyan-500/30 rounded-lg p-2 flex flex-col">
              <div className="text-sm font-cyber text-cyan-400 mb-2 border-b border-cyan-500/30 pb-1">
                AGENT DETAILS
              </div>
              <AgentPanel selectedAgent={selectedAgent} />
            </div>
            
            {/* Market & Alliance */}
            <div className="row-span-3 bg-gray-900/80 border border-cyan-500/30 rounded-lg p-2 flex flex-col">
              <div className="text-sm font-cyber text-cyan-400 mb-2 border-b border-cyan-500/30 pb-1">
                MARKETPLACE
              </div>
              <MarketPanel />
            </div>
          </div>
        </div>
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
