"use client"

import { useEffect, useRef } from "react"

// Future is Now - Wellness Color Palette
const FUTURE_WELLNESS_PALETTE = [
  // Fluid blues and teals
  { r: 76, g: 201, b: 240, a: 0.85 },  // HYDRATION-BLUE (#4CC9F0)
  { r: 58, g: 134, b: 255, a: 0.85 },  // MINDFUL-AZURE (#3A86FF)
  { r: 0, g: 180, b: 216, a: 0.85 },   // DEEP-AQUA (#00B4D8)
  
  // Organic purples and pinks
  { r: 121, g: 80, b: 242, a: 0.85 },  // AMETHYST-GLOW (#7950F2)
  { r: 189, g: 147, b: 249, a: 0.85 }, // LAVENDER-PULSE (#BD93F9)
  { r: 255, g: 107, b: 214, a: 0.85 }, // ENERGY-PINK (#FF6BD6)
  
  // Grounding neutrals
  { r: 237, g: 242, b: 244, a: 0.85 }, // CLARITY-WHITE (#EDF2F4)
  { r: 43, g: 45, b: 66, a: 0.75 },    // FOCUSED-DEPTH (#2B2D42) 
]

const BACKGROUND_COLOR = "rgba(16, 24, 39, 0.95)" // Deep space blue background

export default function FluidEnergyField() {
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
      const gridSize = 35 // Larger grid cells for a more spacious, fluid pattern
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

          // Wave calculation: gentler sin wave for more fluid motion
          const waveOffset = Math.sin(normalizedDistance * 8 - time * 0.8) * 0.3 + 0.6 // Smoother intensity

          // Size of the dot based on wave - softer size variation for organic feel
          const dotSize = gridSize * waveOffset * 0.8 + gridSize * 0.2 // Min size 20% of grid, max 100%
          
          // Multiple layered waves for complex fluid dynamics
          const secondaryWave = Math.cos(normalizedDistance * 5 - time * 1.2) * 0.15
          const tertiaryWave = Math.sin(normalizedDistance * 3 + time * 0.5) * 0.1
          const finalDotSize = dotSize * (1 + secondaryWave + tertiaryWave)

          if (finalDotSize < gridSize * 0.12) continue // Slightly higher minimum size threshold

          // Color selection with smoother transitions
          const colorIndex = Math.floor(
            (x + y + colorCycleOffset + waveOffset * FUTURE_WELLNESS_PALETTE.length) % FUTURE_WELLNESS_PALETTE.length,
          )
          const color = FUTURE_WELLNESS_PALETTE[colorIndex]

          ctx.beginPath()
          ctx.arc(dotX, dotY, finalDotSize / 2, 0, Math.PI * 2)
          
          // Enhanced ethereal glow effect
          const glowSize = finalDotSize * 2.0 // Larger glow
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
      // Clear canvas with a subtle trail effect for smoother transitions
      ctx.fillStyle = BACKGROUND_COLOR.replace(", 0.95)", ", 0.15)") // Lower alpha for longer, ethereal trails
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      drawHalftoneWave()

      time += 0.008 // Slower animation for more meditative, flowing waves
      colorCycleOffset += 0.02 // Gentler color cycling for subtle transitions
      if (colorCycleOffset > FUTURE_WELLNESS_PALETTE.length * 10) colorCycleOffset = 0 // Reset to prevent large numbers

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
