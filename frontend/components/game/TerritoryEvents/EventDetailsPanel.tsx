import { TerritoryEvent } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface EventDetailsPanelProps {
  events: TerritoryEvent[];
  territoryName: string;
}

export function EventDetailsPanel({ events, territoryName }: EventDetailsPanelProps) {
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});
  
  // Update time remaining for each event
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeLeft: Record<string, string> = {};
      
      events.forEach(event => {
        const now = Date.now();
        const endTime = event.startTime + event.duration;
        const remaining = Math.max(0, endTime - now);
        
        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          newTimeLeft[event.id] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        } else {
          newTimeLeft[event.id] = "Expired";
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [events]);
  
  if (events.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full bg-black/80 border-cyan-500/50 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-cyan-400">
          Active Events: {territoryName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.map(event => (
          <div key={event.id} className="mb-3 last:mb-0">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold" style={{ color: event.visualEffect?.color || 'white' }}>
                {event.name}
              </h3>
              <span className="text-sm text-cyan-300 font-mono">
                {timeLeft[event.id] || "Calculating..."}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{event.description}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {event.effects.resources && Object.entries(event.effects.resources).map(([resource, multiplier]) => (
                <div key={resource} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-1 ${getResourceColorClass(resource)}`}></span>
                  <span>
                    {resource}: {multiplier > 1 ? '+' : ''}{((multiplier - 1) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
              {event.effects.defense && (
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-1 bg-red-500"></span>
                  <span>
                    Defense: {event.effects.defense > 0 ? '+' : ''}{event.effects.defense.toFixed(1)}x
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Helper function to get Tailwind color class based on resource type
function getResourceColorClass(resourceType: string): string {
  switch (resourceType) {
    case 'energy':
      return 'bg-green-500';
    case 'data':
      return 'bg-blue-500';
    case 'materials':
      return 'bg-orange-500';
    case 'influence':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
}
