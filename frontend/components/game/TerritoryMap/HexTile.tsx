import { Territory } from "../../../types/game";
import { memo, useMemo } from "react";

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

  // Visual states
  const baseColor = isOwned ? "var(--neon-purple)" : dominantResource ? getResourceColor(dominantResource) : "var(--neon-blue)";
  const strokeWidth = isSelected ? 3 : 1.5;
  const glowIntensity = isSelected ? 5 : isOwned ? 3 : 2;

  // Resource-based patterns
  const patternId = `pattern-${territory.id}`;
  const gridSize = size * 0.2;

  return (
    <g onClick={onClick} className="cursor-pointer transition-all duration-200">
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
      </defs>

      {/* Resource glow */}
      <polygon
        points={points}
        fill={`url(#${patternId})`}
        stroke="none"
        opacity={resourceIntensity}
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

      {/* Level indicator */}
      <text
        x={x}
        y={y - size * 0.2}
        textAnchor="middle"
        className="font-cyber fill-current text-xs"
        style={{ fill: baseColor }}
      >
        Lvl {territory.level}
      </text>

      {/* Defense indicator */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        className="font-cyber fill-current text-xs"
        style={{ fill: baseColor }}
      >
        Def {territory.defense}
      </text>

      {/* Resource indicators */}
      <g transform={`translate(${x - size * 0.4}, ${y + size * 0.4})`}>
        {Object.entries(territory.resources).map(([type, data], index) => (
          <g key={type} transform={`translate(${index * (size * 0.25)}, 0)`}>
            <rect
              x={0}
              y={0}
              width={size * 0.2}
              height={size * 0.1}
              fill={getResourceColor(type)}
              opacity={0.3}
            />
            <text
              x={size * 0.1}
              y={size * 0.08}
              textAnchor="middle"
              className="font-cyber fill-current text-[8px]"
              style={{ fill: getResourceColor(type) }}
            >
              {data.production}
            </text>
          </g>
        ))}
      </g>
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
      return "var(--neon-purple)";
    case "influence":
      return "var(--neon-red)";
    default:
      return "white";
  }
}
