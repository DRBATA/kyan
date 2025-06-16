"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import * as Tone from "tone"

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

// Color mapping for frequency families using type for safety
type FrequencyFamily = 3 | 6 | 9;
type ColorMapping = {
  node: string;
  glow: string;
  line: string;
};

const FAMILY_COLORS: Record<FrequencyFamily, ColorMapping> = {
  3: { node: "#ffffff", glow: "rgba(255, 255, 255, 0.8)", line: "rgba(255, 255, 255, 0.6)" },
  6: { node: "#0acbfe", glow: "rgba(0, 210, 255, 0.8)", line: "rgba(0, 210, 255, 0.6)" },
  9: { node: "#e266ff", glow: "rgba(220, 80, 255, 0.8)", line: "rgba(220, 80, 255, 0.6)" }
}

export default function FrequencyVisualizer({ 
  collectedFrequencies, 
  size = "medium" 
}: FrequencyVisualizerProps) {
  const [isSoundEnabled, setSoundEnabled] = useState(false)
  const synth = useRef<Tone.Synth | null>(null)
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

  // Determine if the 9-family (downward triangle) is complete
  const nineFamilyComplete = useMemo(() => {
    return (
      active.has("freq_396") && 
      active.has("freq_639") && 
      active.has("freq_963")
    )
  }, [active])

  // Determine if the entire star is complete
  const isStarComplete = useMemo(() => {
    return sixFamilyComplete && nineFamilyComplete
  }, [sixFamilyComplete, nineFamilyComplete])

  // Size mapping
  const dimensions = {
    small: { size: 100, viewBox: 300, nodeRadius: 8, centerRadius: 10, lineWidth: 1 },
    medium: { size: 200, viewBox: 300, nodeRadius: 10, centerRadius: 12, lineWidth: 1.5 },
    large: { size: 400, viewBox: 300, nodeRadius: 12, centerRadius: 15, lineWidth: 2 },
  }

  const { size: containerSize, viewBox, nodeRadius, centerRadius, lineWidth } = dimensions[size]
  const center = viewBox / 2

  // Initialize synth for sound
  useEffect(() => {
    // Initialize synth only once
    if (!synth.current) {
      synth.current = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.2,
          release: 0.5,
        },
      }).toDestination()
    }

    // Cleanup on unmount
    return () => {
      if (synth.current) {
        synth.current.dispose()
        synth.current = null
      }
    }
  }, [])

  // Helper function to calculate digital root
  const getDigitalRoot = (num: number) => {
    // Sum digits until we get a single digit
    let digitalRoot = num;
    while (digitalRoot > 9) {
      digitalRoot = String(digitalRoot).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return digitalRoot;
  }

  // Function to play a frequency with harmonics based on its family
  const playFrequency = async (hz: number) => {
    if (!isSoundEnabled || !synth.current) return
    
    try {
      await Tone.start() // Initialize audio context on first user interaction
      
      // Determine which family this frequency belongs to
      const digitalRoot = getDigitalRoot(hz)
      
      if (digitalRoot === 6) {
        // 6-family (285, 528, 852) - major chord
        // Play the main frequency
        synth.current.triggerAttackRelease(hz, "0.5")
        
        // Add a perfect fifth (ratio 3:2)
        setTimeout(() => {
          synth.current?.triggerAttackRelease(hz * 1.5, "0.3")
        }, 100)
        
        // Add a major third (ratio 5:4)
        setTimeout(() => {
          synth.current?.triggerAttackRelease(hz * 1.25, "0.3")
        }, 200)
      } 
      else if (digitalRoot === 9) {
        // 9-family (396, 639, 963) - minor chord
        // Play the main frequency
        synth.current.triggerAttackRelease(hz, "0.5")
        
        // Add a perfect fifth (ratio 3:2)
        setTimeout(() => {
          synth.current?.triggerAttackRelease(hz * 1.5, "0.3")
        }, 100)
        
        // Add a minor third (ratio 6:5)
        setTimeout(() => {
          synth.current?.triggerAttackRelease(hz * 1.2, "0.3")
        }, 200)
      }
      else if (digitalRoot === 3) {
        // 3-family (174) - drone with overtone series
        // Play the root frequency
        synth.current.triggerAttackRelease(hz, "1.0")
        
        // Add harmonics (octave and fifth)
        setTimeout(() => {
          synth.current?.triggerAttackRelease(hz * 2, "0.5") // Octave
        }, 200)
        setTimeout(() => {
          synth.current?.triggerAttackRelease(hz * 3, "0.5") // Perfect fifth + octave
        }, 400)
      }
      else {
        // Default behavior for any other frequency
        synth.current.triggerAttackRelease(hz, "0.3")
      }
    } catch (error) {
      console.error("Error playing tone:", error)
    }
  }

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
      {size !== "small" && (
        <button
          onClick={(e) => { e.stopPropagation(); setSoundEnabled(!isSoundEnabled) }}
          className="absolute top-0 right-0 z-10 px-2 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/80 rounded text-white/80 backdrop-blur-sm border border-white/10"
        >
          🔊 {isSoundEnabled ? "On" : "Off"}
        </button>
      )}
      <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Additional filters for each family color */}
          <filter id="glow-3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feFlood floodColor="#ffffff" result="whiteColor" />
            <feComposite in="whiteColor" in2="coloredBlur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow-6" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feFlood floodColor="#0acbfe" result="blueColor" />
            <feComposite in="blueColor" in2="coloredBlur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow-9" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feFlood floodColor="#e266ff" result="purpleColor" />
            <feComposite in="purpleColor" in2="coloredBlur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
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
              
              // Determine line color based on the connection type
              let lineColor = "#51c9ff"
              
              // If both nodes belong to the same family
              if (freqA.family === freqB.family) {
                // Assert the family is a valid key (3, 6, or 9)
                const family = freqA.family as FrequencyFamily
                lineColor = FAMILY_COLORS[family].line
              }
              // If we're connecting between the center node (174Hz) and another node
              else if (freqA.id === "freq_174" || freqB.id === "freq_174") {
                // Use the non-174Hz node's family color
                const nonCenterFreq = freqA.id === "freq_174" ? freqB : freqA
                // Assert the family is a valid key (3, 6, or 9)
                const family = nonCenterFreq.family as FrequencyFamily
                lineColor = FAMILY_COLORS[family].line
              }
              // For star completion, if connecting between different families
              else if (isStarComplete) {
                lineColor = "rgba(255, 220, 180, 0.7)"
              }

              return (
                <line
                  key={`${freqA.id}-${freqB.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={lineColor}
                  strokeWidth={lineWidth}
                  opacity={0.8}
                  className="transition-all duration-200"
                  filter="url(#glow)"
                />
              )
            })
          )}
        </g>

        {/* Nodes */}
        <g>
          {FREQUENCIES.map((freq) => {
            const [x, y] = coords(freq.angle, freq.r)
            const isActive = active.has(freq.id)
            
            // Get colors based on frequency family
            // Assert the family is a valid key (3, 6, or 9)
            const family = freq.family as FrequencyFamily
            const familyColors = FAMILY_COLORS[family]
            const nodeFill = isActive ? familyColors.node : "#444"
            const nodeGlow = isActive ? familyColors.glow : "none"

            return (
              <g key={freq.id} >
                <circle
                  cx={x}
                  cy={y}
                  r={freq.id === "freq_174" ? centerRadius : nodeRadius}
                  fill={nodeFill}
                  className={`transition-all duration-500 ${isActive ? "opacity-100" : "opacity-40"}`}
                  filter={isActive ? "url(#glow)" : "none"}
                  style={{
                    cursor: isActive ? "pointer" : "default", 
                    filter: isActive ? `drop-shadow(0 0 4px ${nodeGlow})` : "none"
                  }}
                  onClick={() => isActive && playFrequency(freq.hz)}
                />
                {size !== "small" && (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isActive ? "white" : "#aaa"}
                    fontSize={nodeRadius * 1.2}
                    fontWeight="bold"
                    style={{ pointerEvents: "none" }}
                  >
                    {freq.hz}
                  </text>
                )}
              </g>
            )
          })}
        </g>
        
        {/* Add node labels for non-small sizes */}
        {size !== "small" && (
          <g>
            {FREQUENCIES.map(freq => {
              const [x, y] = coords(freq.angle, freq.r)
              const isActive = active.has(freq.id)
              
              return (
                <text
                  key={`text-${freq.id}`}
                  x={x}
                  y={y + 5}
                  fontSize={size === "large" ? "12" : "8"}
                  textAnchor="middle"
                  fill={isActive ? "white" : "#999"}
                  className="pointer-events-none select-none"
                >
                  {freq.hz}
                </text>
              )
            })}
          </g>
        )}
      </svg>
    </div>
  )
}
