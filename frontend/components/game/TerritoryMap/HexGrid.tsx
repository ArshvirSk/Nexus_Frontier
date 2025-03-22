import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type { Territory } from "../../../types/game";
import { HexTile } from "./HexTile";
import { Button } from "@/components/ui/button";

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
  // State for pan and zoom
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

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

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    setScale(prevScale => {
      const newScale = Math.max(0.5, Math.min(prevScale + delta, 2));
      return newScale;
    });
  }, []);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, []);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart]);

  // Handle mouse up to stop panning
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset view
  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Add event listeners for mouse up outside the component
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-darker-gray/50 backdrop-blur">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="w-8 h-8 rounded-full bg-black/50 border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
          onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
        >
          <span className="text-lg">+</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="w-8 h-8 rounded-full bg-black/50 border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
        >
          <span className="text-lg">-</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="w-8 h-8 rounded-full bg-black/50 border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
          onClick={resetView}
        >
          <span className="text-xs">Reset</span>
        </Button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded border border-purple-500/30">
        Zoom: {Math.round(scale * 100)}%
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${gridWidth} ${gridHeight}`}
        className="max-w-full max-h-full cursor-grab"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Grid pattern */}
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
            
            {/* Cyberpunk grid lines */}
            <pattern
              id="cyberpunk-grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="transparent" />
              <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(137, 0, 250, 0.15)" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="100" stroke="rgba(0, 234, 255, 0.15)" strokeWidth="1" />
            </pattern>
          </defs>
          
          {/* Background patterns */}
          <rect width={gridWidth} height={gridHeight} fill="url(#grid)" />
          <rect width={gridWidth} height={gridHeight} fill="url(#cyberpunk-grid)" />
          
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
        </g>
      </svg>
    </div>
  );
}
