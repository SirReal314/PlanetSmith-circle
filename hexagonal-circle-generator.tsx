"use client"

import { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export default function HexagonalCircleGenerator() {
  const [radius, setRadius] = useState(10)
  const [gridSize, setGridSize] = useState(21)
  const maxRadius = 50

  // Dynamic hexagon size calculation
  const baseHexSize = 10
  const hexSize = Math.max(baseHexSize - radius / 10, 2)
  const hexHeight = hexSize * 2
  const hexWidth = Math.sqrt(3) * hexSize

  useEffect(() => {
    // Ensure grid size is always odd and large enough to contain the circle
    setGridSize(Math.max(Math.ceil(radius * 2.5) | 1, 21))
  }, [radius])

  const Hexagon = ({ x, y, fill }: { x: number; y: number; fill: boolean }) => {
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
        fill={fill ? "#3b82f6" : "transparent"}
        stroke={fill ? "#2563eb" : "transparent"}
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
          const isOnCircumference = Math.abs(distance - radius) < 0.6
          hexagons.push(<Hexagon key={`${q},${r}`} x={x} y={y} fill={isOnCircumference} />)
        }
      }
    }

    return hexagons
  }

  const svgSize = (gridSize + 1) * hexSize * 2
  const containerSize = Math.min(600, Math.max(200, radius * 10)) // Scale container size with radius

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Hexagonal Circle Outline Generator</h1>
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
      <div 
        className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
          transition: 'width 0.3s, height 0.3s'
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`${-svgSize/2} ${-svgSize/2} ${svgSize} ${svgSize}`}
        >
          {generateHexagonalCircle()}
        </svg>
      </div>
    </div>
  )
}