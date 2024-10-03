"use client";

import { useState, useEffect } from 'react';
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

export default function HexagonalCircleGenerator() {
  const [radius, setRadius] = useState(10)
  const [gridSize, setGridSize] = useState(21)
  const maxRadius = 50

  const hexSize = 10 // Size of hexagon (distance from center to corner)
  const hexHeight = hexSize * 2
  const hexWidth = Math.sqrt(3) * hexSize

  useEffect(() => {
    // Calculate grid size based on inradius
    // The inradius of a hexagon is (sqrt(3)/2) * circumradius
    // Add 4 to ensure there's always a border of hexagons around the circle
    const circumradius = (2 / Math.sqrt(3)) * radius
    setGridSize(Math.ceil(2 * circumradius) + 4)
  }, [radius])

  const Hexagon = ({ x, y, isOnCircumference, isCenter }: { x: number; y: number; isOnCircumference: boolean; isCenter: boolean }) => {
    const points = [
      [hexSize, 0],
      [hexSize / 2, hexWidth / 2],
      [-hexSize / 2, hexWidth / 2],
      [-hexSize, 0],
      [-hexSize / 2, -hexWidth / 2],
      [hexSize / 2, -hexWidth / 2]
    ].map(([px, py]) => `${px + x},${py + y}`).join(' ')

    return (
      <polygon
        points={points}
        fill={isCenter ? "#3b82f6" : isOnCircumference ? "#3b82f6" : "transparent"}
        stroke="#d1d5db"
        strokeWidth="1"
      />
    )
  }

  const generateHexagonalCircle = () => {
    const hexagons = []
    const center = Math.floor(gridSize / 2)

    for (let q = -center; q <= center; q++) {
      for (let r = -center; r <= center; r++) {
        const s = -q - r
        if (Math.abs(s) <= center) {
          const x = hexSize * 3/2 * q
          const y = hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r)
          const distance = Math.sqrt(q*q + r*r + s*s) / Math.sqrt(2)
          const isOnCircumference = Math.abs(distance - radius) < 0.5
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

  const svgSize = (gridSize + 1) * hexSize * 2

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Hexagonal Circle Generator</h1>
      <div className="w-full max-w-sm">
        <Label htmlFor="radius-slider" className="text-sm font-medium">
          Radius: {radius}
        </Label>
        <Slider
          id="radius-slider"
          min={1}
          max={maxRadius}
          step={1}
          value={[radius]}
          onValueChange={(value) => setRadius(value[0])}
          className="mt-2"
        />
      </div>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <svg 
          width={svgSize} 
          height={svgSize} 
          viewBox={`${-svgSize/2} ${-svgSize/2} ${svgSize} ${svgSize}`}
        >
          {generateHexagonalCircle()}
        </svg>
      </div>
    </div>
  )
}