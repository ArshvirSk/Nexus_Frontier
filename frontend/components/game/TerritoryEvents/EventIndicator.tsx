import { TerritoryEvent } from "@/types/events";
import { useEffect, useState } from "react";

interface EventIndicatorProps {
  event: TerritoryEvent;
  x: number;
  y: number;
  size: number;
}

export function EventIndicator({ event, x, y, size }: EventIndicatorProps) {
  const [opacity, setOpacity] = useState(0.8);
  
  // Animation effects based on event type
  useEffect(() => {
    if (!event.visualEffect) return;
    
    let intervalId: NodeJS.Timeout;
    
    switch (event.visualEffect.animation) {
      case "pulse":
        intervalId = setInterval(() => {
          setOpacity((current) => current > 0.4 ? 0.4 : 0.8);
        }, 1000);
        break;
        
      case "flicker":
        intervalId = setInterval(() => {
          setOpacity(Math.random() * 0.5 + 0.3); // Random between 0.3 and 0.8
        }, 200);
        break;
        
      case "wave":
        let phase = 0;
        intervalId = setInterval(() => {
          phase = (phase + 0.1) % (2 * Math.PI);
          setOpacity(0.4 + 0.4 * Math.sin(phase));
        }, 100);
        break;
        
      default:
        // Static - no animation
        break;
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [event.visualEffect]);
  
  // Calculate remaining time percentage
  const timeElapsed = Date.now() - event.startTime;
  const timeRemaining = Math.max(0, event.duration - timeElapsed);
  const percentRemaining = (timeRemaining / event.duration) * 100;
  
  // Calculate radius for circular indicator
  const radius = size * 0.8;
  
  return (
    <>
      {/* Event glow effect */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="none"
        stroke={event.visualEffect?.color || "#ffffff"}
        strokeWidth={3}
        strokeOpacity={opacity}
        strokeDasharray="5,5"
      />
      
      {/* Event timer circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill="none"
        stroke={event.visualEffect?.color || "#ffffff"}
        strokeWidth={2}
        strokeOpacity={0.8}
        strokeDasharray={`${2 * Math.PI * radius * (percentRemaining / 100)} ${2 * Math.PI * radius}`}
        transform={`rotate(-90 ${x} ${y})`}
      />
      
      {/* Event icon */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={event.visualEffect?.color || "#ffffff"}
        fontSize={size * 0.4}
        fontWeight="bold"
      >
        {getEventIcon(event.type)}
      </text>
    </>
  );
}

// Helper function to get icon based on event type
function getEventIcon(eventType: string): string {
  switch (eventType) {
    case "resource_boost":
      return "⚡";
    case "cyber_attack":
      return "⚠️";
    case "system_glitch":
      return "⚙️";
    case "corporate_raid":
      return "🏢";
    case "black_market":
      return "💰";
    case "ai_emergence":
      return "🤖";
    default:
      return "❓";
  }
}
