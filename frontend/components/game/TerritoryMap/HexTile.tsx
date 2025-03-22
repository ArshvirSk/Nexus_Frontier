import { Territory } from "../../../types/game";
import { memo, useMemo, useState } from "react";

interface HexTileProps {
  x: number;
  y: number;
  size: number;
  territory: Territory;
  isSelected: boolean;
  isOwned: boolean;
  onClick: () => void;
}

export const HexTile = memo(function HexTile({
  x,
  y,
  size,
  territory,
  isSelected,
  isOwned,
  onClick,
}: HexTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate hex points
  const points = useMemo(() => {
    const vertices = [
      [x + size * Math.cos(0), y + size * Math.sin(0)],
      [x + size * Math.cos(Math.PI / 3), y + size * Math.sin(Math.PI / 3)],
      [x + size * Math.cos((2 * Math.PI) / 3), y + size * Math.sin((2 * Math.PI) / 3)],
      [x + size * Math.cos(Math.PI), y + size * Math.sin(Math.PI)],
      [x + size * Math.cos((4 * Math.PI) / 3), y + size * Math.sin((4 * Math.PI) / 3)],
      [x + size * Math.cos((5 * Math.PI) / 3), y + size * Math.sin((5 * Math.PI) / 3)],
    ].map((point) => point.join(",")).join(" ");
    return vertices;
  }, [x, y, size]);

  // Calculate dominant resource and its intensity
  const { dominantResource, resourceIntensity } = useMemo(() => {
    const resources = Object.entries(territory.resources);
    const maxProduction = Math.max(...resources.map(([, data]) => data.production));
    const dominant = resources.find(([, data]) => data.production === maxProduction);
    
    return {
      dominantResource: dominant ? dominant[0] : null,
      resourceIntensity: Math.min(0.3 + (maxProduction / 15) * 0.7, 1), // 15 is max production
    };
  }, [territory.resources]);

  // Visual states based on selection, ownership, and hover
  const scale = isHovered ? 1.05 : isSelected ? 1.03 : 1;
  const baseColor = isOwned ? "var(--neon-purple)" : dominantResource ? getResourceColor(dominantResource) : "var(--neon-blue)";
  const strokeWidth = isSelected ? 3 : isHovered ? 2 : 1.5;
  const glowIntensity = isSelected ? 5 : isHovered ? 4 : isOwned ? 3 : 2;
  const opacity = isHovered || isSelected ? 1 : 0.9;

  // Resource-based patterns
  const patternId = `pattern-${territory.id}`;
  const gridSize = size * 0.2;
  
  // Alliance ownership indicator
  const allianceColor = isOwned ? "var(--neon-purple)" : territory.owner ? "var(--neon-red)" : "transparent";
  const allianceOpacity = territory.owner ? 0.3 : 0;

  return (
    <g 
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer transition-transform duration-200 ease-in-out"
      style={{ transform: `scale(${scale})` }}
    >
      <defs>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width={gridSize}
          height={gridSize}
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={gridSize}
            stroke={baseColor}
            strokeWidth="0.5"
            opacity="0.2"
          />
        </pattern>
        
        {/* Radial gradient for resource glow */}
        <radialGradient id={`glow-${territory.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={baseColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={baseColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow effect */}
      {(isHovered || isSelected) && (
        <polygon
          points={points}
          fill={`url(#glow-${territory.id})`}
          stroke="none"
          opacity={0.6}
        />
      )}

      {/* Alliance ownership background */}
      <polygon
        points={points}
        fill={allianceColor}
        stroke="none"
        opacity={allianceOpacity}
      />
      
      {/* Resource pattern */}
      <polygon
        points={points}
        fill={`url(#${patternId})`}
        stroke="none"
        opacity={resourceIntensity * opacity}
      />
      
      {/* Main hex */}
      <polygon
        points={points}
        fill="rgba(26, 26, 26, 0.6)"
        stroke={baseColor}
        strokeWidth={strokeWidth}
        filter="url(#glow)"
        style={{
          "--glow-color": baseColor,
          "--glow-intensity": glowIntensity,
        } as any}
      />

      {/* Territory name (only show on hover or selected) */}
      {(isHovered || isSelected) && (
        <text
          x={x}
          y={y - size * 0.5}
          textAnchor="middle"
          className="font-cyber fill-current text-xs pointer-events-none"
          style={{ fill: "white" }}
        >
          {territory.name}
        </text>
      )}

      {/* Level indicator */}
      <text
        x={x}
        y={y - size * 0.2}
        textAnchor="middle"
        className="font-cyber fill-current text-xs pointer-events-none"
        style={{ fill: baseColor }}
      >
        Lvl {territory.level}
      </text>

      {/* Defense indicator */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        className="font-cyber fill-current text-xs pointer-events-none"
        style={{ fill: baseColor }}
      >
        Def {territory.defense}
      </text>

      {/* Resource indicators - Enhanced with mini bars */}
      <g transform={`translate(${x - size * 0.4}, ${y + size * 0.4})`}>
        {Object.entries(territory.resources).map(([type, data], index) => {
          const resourceColor = getResourceColor(type);
          const barWidth = Math.max((data.production / 15) * size * 0.2, size * 0.05);
          
          return (
            <g key={type} transform={`translate(${index * (size * 0.25)}, 0)`}>
              {/* Bar background */}
              <rect
                x={0}
                y={0}
                width={size * 0.2}
                height={size * 0.1}
                rx={2}
                fill={resourceColor}
                opacity={0.15}
              />
              
              {/* Production bar */}
              <rect
                x={0}
                y={0}
                width={barWidth}
                height={size * 0.1}
                rx={2}
                fill={resourceColor}
                opacity={0.6}
              />
              
              {/* Production value */}
              <text
                x={size * 0.1}
                y={size * 0.08}
                textAnchor="middle"
                className="font-cyber fill-current text-[8px] pointer-events-none"
                style={{ fill: resourceColor }}
              >
                {data.production}
              </text>
            </g>
          );
        })}
      </g>
      
      {/* Tooltip on hover */}
      {isHovered && !isSelected && (
        <foreignObject
          x={x + size * 0.8}
          y={y - size * 0.5}
          width={size * 3}
          height={size * 2}
          className="pointer-events-none"
        >
          <div className="bg-black/80 text-white text-xs p-2 rounded border border-purple-500/30 backdrop-blur-sm">
            <div className="font-bold text-purple-300">{territory.name}</div>
            <div className="text-gray-300 text-[10px] mt-1">{territory.description}</div>
            <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
              {Object.entries(territory.resources).map(([type, data]) => (
                <div key={type} className="flex justify-between">
                  <span className="capitalize" style={{ color: getResourceColor(type) }}>{type}:</span>
                  <span>+{data.production}/h</span>
                </div>
              ))}
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
});

function getResourceColor(type: string | null): string {
  switch (type) {
    case "energy":
      return "var(--neon-green)";
    case "data":
      return "var(--neon-blue)";
    case "materials":
      return "var(--neon-amber)";
    case "influence":
      return "var(--neon-purple)";
    default:
      return "var(--neon-gray)";
  }
}
