import React from 'react';
import { Progress } from '@/components/ui/progress';

export function ResourcePanel() {
  // Mock resource data
  const resources = {
    energy: { current: 750, capacity: 1000, production: 45 },
    data: { current: 320, capacity: 500, production: 25 },
    materials: { current: 180, capacity: 300, production: 15 },
    influence: { current: 90, capacity: 200, production: 10 }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Resource Radar */}
      <div className="relative w-full aspect-square mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full rounded-full border border-cyan-500/30 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full border border-cyan-500/30 flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full bg-cyan-500/20"></div>
              </div>
            </div>
          </div>
          
          {/* Radar Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
              <line x1="15" y1="15" x2="85" y2="85" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
              <line x1="15" y1="85" x2="85" y2="15" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="0.5" />
            </svg>
          </div>
          
          {/* Resource Dots */}
          <div className="absolute" style={{ top: '30%', right: '30%' }}>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="absolute" style={{ bottom: '35%', left: '25%' }}>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
          <div className="absolute" style={{ top: '25%', left: '35%' }}>
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
          </div>
          <div className="absolute" style={{ bottom: '30%', right: '25%' }}>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          </div>
          
          {/* Center Data */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-400">TOTAL PROD</div>
              <div className="text-xl text-cyan-400">
                {Object.values(resources).reduce((sum, res) => sum + res.production, 0)}/h
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resource Bars */}
      <div className="space-y-3 flex-1">
        <ResourceBar 
          label="ENERGY" 
          value={resources.energy.current} 
          max={resources.energy.capacity} 
          production={resources.energy.production}
          color="bg-green-500"
        />
        <ResourceBar 
          label="DATA" 
          value={resources.data.current} 
          max={resources.data.capacity} 
          production={resources.data.production}
          color="bg-blue-500"
        />
        <ResourceBar 
          label="MATERIALS" 
          value={resources.materials.current} 
          max={resources.materials.capacity} 
          production={resources.materials.production}
          color="bg-yellow-500"
        />
        <ResourceBar 
          label="INFLUENCE" 
          value={resources.influence.current} 
          max={resources.influence.capacity} 
          production={resources.influence.production}
          color="bg-purple-500"
        />
      </div>
    </div>
  );
}

interface ResourceBarProps {
  label: string;
  value: number;
  max: number;
  production: number;
  color: string;
}

function ResourceBar({ label, value, max, production, color }: ResourceBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-cyan-400">
          {value}/{max} <span className="text-green-400">+{production}/h</span>
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
