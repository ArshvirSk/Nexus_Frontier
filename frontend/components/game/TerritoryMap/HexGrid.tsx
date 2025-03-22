import { useCallback, useMemo } from "react";
import type { Territory } from "../../../types/game";
import { HexTile } from "./HexTile";

interface HexGridProps {
  territories: Territory[];
  selectedTerritory: Territory | null;
  onTerritorySelect: (territory: Territory) => void;
  userAddress?: string;
}

export function HexGrid({
  territories,
  selectedTerritory,
  onTerritorySelect,
  userAddress,
}: HexGridProps) {
  // Calculate grid dimensions based on territories
  const { gridWidth, gridHeight, hexSize } = useMemo(() => {
    const maxX = Math.max(...territories.map((t) => t.x));
    const maxY = Math.max(...territories.map((t) => t.y));
    const hexSize = 60; // Base hex size
    return {
      gridWidth: (maxX + 2) * (hexSize * 1.75),
      gridHeight: (maxY + 2) * (hexSize * 1.5),
      hexSize,
    };
  }, [territories]);

  // Calculate hex position
  const getHexPosition = useCallback(
    (x: number, y: number) => {
      const xPos = x * hexSize * 1.75;
      const yPos = y * hexSize * 1.5 + (x % 2) * (hexSize * 0.75);
      return { x: xPos, y: yPos };
    },
    [hexSize]
  );

  return (
    <div className="relative w-full h-full overflow-auto bg-darker-gray/50 backdrop-blur">
      <svg
        width={gridWidth}
        height={gridHeight}
        viewBox={`0 0 ${gridWidth} ${gridHeight}`}
        className="max-w-full max-h-full"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Grid background pattern */}
        <pattern
          id="grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(0, 243, 255, 0.1)"
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Render territories */}
        {territories.map((territory) => {
          const pos = getHexPosition(territory.x, territory.y);
          return (
            <HexTile
              key={`${territory.x}-${territory.y}`}
              x={pos.x}
              y={pos.y}
              size={hexSize}
              territory={territory}
              isSelected={selectedTerritory?.id === territory.id}
              isOwned={territory.owner === userAddress}
              onClick={() => onTerritorySelect(territory)}
            />
          );
        })}
      </svg>
    </div>
  );
}
