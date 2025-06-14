"use client"

import { useMemo } from "react"

interface FrequencyVisualizerProps {
  collectedFrequencies: string[]
  size?: "small" | "medium" | "large"
}

// Constants for frequency rendering
const FREQUENCIES = [
  { id: "freq_174", hz: 174, family: 3, angle: 0, r: 0 },
  { id: "freq_285", hz: 285, family: 6, angle: 0, r: 120 },
  { id: "freq_528", hz: 528, family: 6, angle: 120, r: 120 },
  { id: "freq_852", hz: 852, family: 6, angle: 240, r: 120 },
  { id: "freq_396", hz: 396, family: 9, angle: 60, r: 120 },
  { id: "freq_639", hz: 639, family: 9, angle: 300, r: 120 },
  { id: "freq_963", hz: 963, family: 9, angle: 180, r: 120 },
]

export default function FrequencyVisualizer({ 
  collectedFrequencies, 
  size = "medium" 
}: FrequencyVisualizerProps) {
  // Calculate active frequencies
  const active = useMemo(() => {
    const activeSet = new Set<string>()
    collectedFrequencies.forEach(freq => {
      if (freq.startsWith("freq_")) {
        activeSet.add(freq)
      }
    })
    return activeSet
  }, [collectedFrequencies])

  // Determine if the 6-family (upward triangle) is complete
  const sixFamilyComplete = useMemo(() => {
    return (
      active.has("freq_285") && 
      active.has("freq_528") && 
      active.has("freq_852")
    )
  }, [active])

  // Determine if the entire star is complete
  const isStarComplete = useMemo(() => {
    return (
      sixFamilyComplete &&
      active.has("freq_396") &&
      active.has("freq_639") &&
      active.has("freq_963")
    )
  }, [sixFamilyComplete, active])

  // Size mapping
  const dimensions = {
    small: { size: 100, viewBox: 300, nodeRadius: 8, centerRadius: 10, lineWidth: 1 },
    medium: { size: 200, viewBox: 300, nodeRadius: 10, centerRadius: 12, lineWidth: 1.5 },
    large: { size: 400, viewBox: 300, nodeRadius: 12, centerRadius: 15, lineWidth: 2 },
  }

  const { size: containerSize, viewBox, nodeRadius, centerRadius, lineWidth } = dimensions[size]
  const center = viewBox / 2

  // Calculate coordinates
  const coords = (angle: number, r: number) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return [center + r * Math.cos(rad), center + r * Math.sin(rad)]
  }

  return (
    <div 
      className="relative" 
      style={{ 
        width: `${containerSize}px`, 
        height: `${containerSize}px`
      }}
    >
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Lines between collected frequencies */}
        <g>
          {FREQUENCIES.filter(freq => active.has(freq.id)).map((freqA, i, activeFreqs) =>
            activeFreqs.slice(i + 1).map((freqB) => {
              const [x1, y1] = coords(freqA.angle, freqA.r)
              const [x2, y2] = coords(freqB.angle, freqB.r)

              return (
                <line
                  key={`${freqA.id}-${freqB.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className={isStarComplete ? "stroke-fuchsia-400" : "stroke-cyan-400"}
                  strokeWidth={lineWidth}
                  strokeOpacity={0.6}
                  style={{ filter: isStarComplete ? "url(#glow)" : "none" }}
                />
              )
            })
          )}
        </g>

        {/* Nodes */}
        <g>
          {FREQUENCIES.map(freq => {
            const [x, y] = coords(freq.angle, freq.r)
            const isCenter = freq.id === "freq_174"
            const isActive = active.has(freq.id)
            const isSixFamily = freq.family === 6
            const isNineFamily = freq.family === 9
            const isLocked = isNineFamily && !sixFamilyComplete

            return (
              <circle
                key={freq.id}
                cx={x}
                cy={y}
                r={isCenter ? centerRadius : nodeRadius}
                className={`
                  ${isActive ? "opacity-100" : "opacity-40"}
                  ${isActive && isCenter ? "fill-white" : ""}
                  ${isActive && isSixFamily ? "fill-cyan-400" : ""}
                  ${isActive && isNineFamily ? "fill-fuchsia-500" : ""}
                  ${!isActive ? "fill-gray-700" : ""}
                  ${isLocked ? "fill-gray-800" : ""}
                  transition-all duration-300
                  ${isActive ? "animate-pulse" : ""}
                `}
                style={{
                  animationDuration: "2s",
                  filter: isActive ? "url(#glow)" : "none",
                }}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
