"use client"

import { useEffect, useRef } from "react"

// Matcha-inspired color palette with softer transitions
const MATCHA_PALETTE = [
  // Greens for matcha focus
  { r: 76, g: 175, b: 80, a: 0.9 }, // Green (increased opacity)
  { r: 0, g: 150, b: 136, a: 0.9 }, // Teal (increased opacity)
  // Accent colors - limited for less distraction
  { r: 255, g: 235, b: 59, a: 0.8 }, // Yellow (increased opacity)
  { r: 255, g: 64, b: 129, a: 0.8 }, // Pink (increased opacity)
  // Additional vibrant colors for wave variation
  { r: 129, g: 199, b: 132, a: 0.9 }, // Light green
  { r: 129, g: 212, b: 250, a: 0.8 }, // Light blue
]

const BACKGROUND_COLOR = "rgba(5, 15, 25, 0.95)" // Darker background for higher contrast

export default function HalftoneWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    let colorCycleOffset = 0

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    const drawHalftoneWave = () => {
      const gridSize = 25 // Slightly smaller grid cells for more detailed pattern
      const rows = Math.ceil(window.innerHeight / gridSize)
      const cols = Math.ceil(window.innerWidth / gridSize)

      const waveCenterX = window.innerWidth / 2
      const waveCenterY = window.innerHeight / 2
      const maxDistance = Math.sqrt(Math.pow(waveCenterX, 2) + Math.pow(waveCenterY, 2))

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dotX = x * gridSize + gridSize / 2
          const dotY = y * gridSize + gridSize / 2

          const distanceFromCenter = Math.sqrt(Math.pow(dotX - waveCenterX, 2) + Math.pow(dotY - waveCenterY, 2))
          const normalizedDistance = distanceFromCenter / maxDistance

          // Wave calculation: enhanced sin wave based on distance and time
          const waveOffset = Math.sin(normalizedDistance * 12 - time * 1.5) * 0.4 + 0.5 // Increased intensity and adjusted frequency

          // Size of the dot based on wave - more dramatic size variation
          const dotSize = gridSize * waveOffset * 0.7 + gridSize * 0.15 // Min size 15% of grid, max 85%
          
          // Add secondary wave effect
          const secondaryWave = Math.cos(normalizedDistance * 8 - time * 3) * 0.2
          const finalDotSize = dotSize * (1 + secondaryWave)

          if (finalDotSize < gridSize * 0.1) continue // Don't draw tiny dots

          // Color selection - slower cycling
          const colorIndex = Math.floor(
            (x + y + colorCycleOffset + waveOffset * MATCHA_PALETTE.length) % MATCHA_PALETTE.length,
          )
          const color = MATCHA_PALETTE[colorIndex]

          ctx.beginPath()
          ctx.arc(dotX, dotY, finalDotSize / 2, 0, Math.PI * 2)
          
          // Add a subtle glow effect to the dots
          const glowSize = finalDotSize * 1.4
          const gradient = ctx.createRadialGradient(
            dotX, dotY, 0,
            dotX, dotY, glowSize / 2
          )
          
          gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * waveOffset})`)
          gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)
          
          ctx.fillStyle = gradient
          ctx.fill()
        }
      }
    }

    const animate = () => {
      // Clear canvas with a more pronounced trail effect
      ctx.fillStyle = BACKGROUND_COLOR.replace(", 0.95)", ", 0.2)") // Even lower alpha for longer, more visible trails
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      drawHalftoneWave()

      time += 0.015 // Slightly faster animation for more dynamic waves
      colorCycleOffset += 0.05 // Faster color cycling
      if (colorCycleOffset > MATCHA_PALETTE.length * 10) colorCycleOffset = 0 // Reset to prevent large numbers

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" style={{opacity: 1}} />
}
