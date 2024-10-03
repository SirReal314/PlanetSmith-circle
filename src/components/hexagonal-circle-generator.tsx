"use client";

import { useState, useMemo, useEffect } from 'react';
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

export default function HexagonalCircleGenerator() {
  const [radius, setRadius] = useState(10)
  const [displayedRadius, setDisplayedRadius] = useState(10)
  const maxRadius = 50

  // Calculate dynamic hexSize based on radius
  const hexSize = useMemo(() => {
    const maxSvgSize = Math.min(window.innerWidth, window.innerHeight) * 0.8
    const circumradius = (2 / Math.sqrt(3)) * displayedRadius
    return maxSvgSize / ((2 * circumradius + 4) * 2)
  }, [displayedRadius])

  // Memoized gridSize calculation
  const gridSize = useMemo(() => {
    const circumradius = (2 / Math.sqrt(3)) * displayedRadius
    return Math.ceil(2 * circumradius) + 4
  }, [displayedRadius])

  // Hexagon component
  const Hexagon = ({
    x,
    y,
    isOnCircumference,
    isCenter,
  }: {
    x: number
    y: number
    isOnCircumference: boolean
    isCenter: boolean
  }) => {
    const points = [
      [hexSize, 0],
      [hexSize / 2, Math.sqrt(3) * hexSize / 2],
      [-hexSize / 2, Math.sqrt(3) * hexSize / 2],
      [-hexSize, 0],
      [-hexSize / 2, -Math.sqrt(3) * hexSize / 2],
      [hexSize / 2, -Math.sqrt(3) * hexSize / 2],
    ]
      .map(([px, py]) => `${px + x},${py + y}`)
      .join(' ')

    return (
      <polygon
        points={points}
        fill={isCenter ? "#3b82f6" : isOnCircumference ? "#3b82f6" : "transparent"}
        stroke="#d1d5db"
        strokeWidth="1"
      />
    )
  }

  // Memoized hexagons generation to avoid unnecessary recalculations
  const hexagons = useMemo(() => {
    const generateHexagonalCircle = () => {
      const hexagons = []
      const center = Math.floor(gridSize / 2)

      for (let q = -center; q <= center; q++) {
        for (let r = -center; r <= center; r++) {
          const s = -q - r
          if (Math.abs(s) <= center) {
            const x = hexSize * (3 / 2) * q
            const y = hexSize * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r)
            const distance = Math.sqrt(q * q + r * r + s * s) / Math.sqrt(2)
            const isOnCircumference = Math.abs(distance - displayedRadius) < 0.5
            const isCenter = q === 0 && r === 0 && s === 0
            hexagons.push(
              <Hexagon
                key={`${q},${r}`}
                x={x}
                y={y}
                isOnCircumference={isOnCircumference}
                isCenter={isCenter}
              />
            )
          }
        }
      }
      return hexagons
    }

    return generateHexagonalCircle()
  }, [displayedRadius, gridSize, hexSize])

  // Effect to update displayedRadius with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedRadius(radius)
    }, 300)

    return () => clearTimeout(timer)
  }, [radius])

  // Manual input handler
  const handleManualRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= maxRadius) {
      setRadius(value)
    }
  }

  const svgSize = (gridSize + 1) * hexSize * 2

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Hexagonal Circle Generator</h1>

      {/* Slider and Manual Input for Radius */}
      <div className="flex items-center w-full max-w-sm space-x-6">
        <Label htmlFor="radius-slider" className="text-sm font-medium">
          Radius:
        </Label>
        <Slider
          id="radius-slider"
          min={1}
          max={maxRadius}
          step={1}
          value={[radius]}
          onValueChange={(value) => setRadius(value[0])}
          className="flex-1"
        />
        <input
          type="number"
          min={1}
          max={maxRadius}
          value={radius}
          onChange={handleManualRadiusChange}
          className="w-20 border border-gray-300 p-2 rounded ml-2"
          placeholder="Radius"
        />
      </div>

      {/* SVG Rendering */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`${-svgSize / 2} ${-svgSize / 2} ${svgSize} ${svgSize}`}
        >
          {hexagons}
        </svg>
      </div>
    </div>
  )
}