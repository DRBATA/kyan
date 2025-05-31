"use client"

import { useEffect, useRef, useState, useMemo } from "react"

interface AudioReactiveTitleProps {
  title: string
  subtitle?: React.ReactNode
  audioSrc: string
}

// Character wrapper for individual character animations
// @ts-ignore: Intentionally avoiding typed parameters as they caused crashes previously
function AnimatedCharacter({ char, index, isPlaying, bassLevel = 0, midLevel = 0, highLevel = 0 }) {
  const randomOffset = useMemo(() => Math.random() * 0.5, [])
  const delayMs = useMemo(() => index * 30, [index])
  
  // Base styling with always-on green glow effect
  const style = {
    display: 'inline-block',
    position: 'relative' as const,
    transition: 'transform 50ms ease-out',
    animation: isPlaying ? `neon-pulse 1.5s infinite ${randomOffset}s ${delayMs}ms` : 'none',
    transform: isPlaying ? `
      translateY(${Math.sin(Date.now() / 500 + index) * midLevel * 10}px)
      scale(${1 + bassLevel * 0.2})
      rotate(${(midLevel - 0.5) * 5}deg)
    ` : 'none',
    filter: `hue-rotate(${index * 10 + highLevel * 90}deg)`,
    color: 'white',
    textShadow: isPlaying ? `
      0 0 5px rgba(255, 255, 255, ${0.5 + highLevel * 0.5}),
      0 0 10px rgba(255, 255, 255, ${0.3 + highLevel * 0.7}),
      ${-bassLevel * 15}px 0 ${2 + bassLevel * 8}px rgba(255, 0, 0, ${0.5 + bassLevel * 0.5}),
      ${bassLevel * 15}px 0 ${2 + bassLevel * 8}px rgba(0, 255, 255, ${0.5 + bassLevel * 0.5}),
      0 0 ${20 + highLevel * 30}px rgba(255, 255, 255, ${0.2 + highLevel * 0.3})
    ` : `
      0 0 5px rgba(255, 255, 255, 0.8),
      0 0 10px rgba(255, 255, 255, 0.5),
      0 0 15px rgba(0, 197, 79, 0.7),
      0 0 25px rgba(0, 255, 106, 0.6),
      0 0 35px rgba(0, 255, 106, 0.4),
      -3px 0 5px rgba(122, 170, 93, 0.6),
      3px 0 5px rgba(0, 255, 106, 0.6)
    `,
    // Combined animation delay into the animation shorthand above
  }
  
  return <span style={style}>{char}</span>
}

export default function AudioReactiveTitle({ title, subtitle, audioSrc }: AudioReactiveTitleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationFrameRef = useRef<number>(0)
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const outlineRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevels, setAudioLevels] = useState({ bass: 0, mid: 0, high: 0, overall: 0 })
  
  // Initialize audio context and analyzer
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create audio element
    const audio = new Audio(audioSrc)
    audio.crossOrigin = "anonymous"
    audio.loop = true // Loop the track
    audioRef.current = audio

    // Set up audio context and analyzer
    // @ts-expect-error: Safari support requires webkitAudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    // Create analyzer node
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 512 // Higher resolution for better frequency analysis
    analyser.smoothingTimeConstant = 0.85 // Smoother transitions
    analyserRef.current = analyser

    // Connect audio to analyzer
    const source = audioContext.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    // Create data array for frequency data
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    dataArrayRef.current = dataArray

    // Event listeners
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
    })

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [audioSrc])

  // Add CSS keyframes for animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Create and inject keyframes style
    const style = document.createElement('style')
    style.textContent = `
      @keyframes neon-pulse {
        0% { opacity: 1; filter: brightness(1); }
        50% { opacity: 0.8; filter: brightness(1.2); }
        100% { opacity: 1; filter: brightness(1); }
      }
      
      @keyframes rgb-shift {
        0% { text-shadow: -5px 0 2px rgba(255,0,0,0.7), 5px 0 2px rgba(0,255,255,0.7); }
        33% { text-shadow: -5px 0 2px rgba(255,0,255,0.7), 5px 0 2px rgba(255,255,0,0.7); }
        66% { text-shadow: -5px 0 2px rgba(0,255,0,0.7), 5px 0 2px rgba(0,0,255,0.7); }
        100% { text-shadow: -5px 0 2px rgba(255,0,0,0.7), 5px 0 2px rgba(0,255,255,0.7); }
      }
      
      @keyframes outline-pulse {
        0% { opacity: 0.7; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
        100% { opacity: 0.7; transform: scale(1); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Handle play/pause
  const togglePlay = async () => {
    if (!audioRef.current || !audioContextRef.current) return
    
    // Resume audio context if suspended (needed due to browser policies)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    
    if (isPlaying) {
      audioRef.current.pause()
      cancelAnimationFrame(animationFrameRef.current)
      setIsPlaying(false)
      // Reset audio levels
      setAudioLevels({ bass: 0, mid: 0, high: 0, overall: 0 })
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        analyzeAudio()
      } catch (error) {
        console.error("Audio playback failed:", error)
      }
    }
  }

  // Beat detection helpers
  const beatHistoryRef = useRef<number[]>([])
  const lastBeatTimeRef = useRef<number>(0)
  const energyThresholdRef = useRef<number>(0.65) // Threshold for detecting beats
  
  // Detect beat in bass range
  const detectBeat = (bassEnergy: number, time: number): boolean => {
    // Keep a history of energies to calculate average
    const history = beatHistoryRef.current
    history.push(bassEnergy)
    if (history.length > 20) history.shift() // Keep last 20 samples
    
    // Calculate average energy
    const avgEnergy = history.reduce((sum, val) => sum + val, 0) / history.length
    
    // Check if current energy significantly exceeds average and not too soon after last beat
    const beatDetected = 
      bassEnergy > avgEnergy * energyThresholdRef.current && 
      time - lastBeatTimeRef.current > 300 // Minimum 300ms between beats
    
    // Update last beat time if beat detected
    if (beatDetected) {
      lastBeatTimeRef.current = time
    }
    
    return beatDetected
  }

  // Analyze audio and apply effects
  const analyzeAudio = () => {
    if (!analyserRef.current || !dataArrayRef.current || !titleContainerRef.current) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)
      return
    }

    // Get frequency data
    analyserRef.current.getByteFrequencyData(dataArrayRef.current)
    
    // Calculate audio levels for different frequency ranges
    // For a 512 fftSize (256 dataArray length):
    // Bass: 0-120Hz (roughly indices 0-7)
    // Mid: 120-1500Hz (roughly indices 8-30) 
    // High: 1500Hz+ (roughly indices 31+)
    const bassSum = dataArrayRef.current.slice(0, 8).reduce((a, b) => a + b, 0)
    const midSum = dataArrayRef.current.slice(8, 30).reduce((a, b) => a + b, 0)
    const highSum = dataArrayRef.current.slice(30, 60).reduce((a, b) => a + b, 0)
    
    // Normalize values between 0-1
    const bassLevel = bassSum / (255 * 8)
    const midLevel = midSum / (255 * 22)
    const highLevel = highSum / (255 * 30)
    
    // Calculate overall volume
    const overallLevel = dataArrayRef.current.slice(0, 60).reduce((a, b) => a + b, 0) / 
                         (60 * 255)
    
    // Update state with current levels (will be used by AnimatedCharacter components)
    setAudioLevels({
      bass: bassLevel,
      mid: midLevel,
      high: highLevel,
      overall: overallLevel
    })
    
    // Detect beats for special effects
    const now = Date.now()
    const isBeat = detectBeat(bassLevel, now)
    
    // Apply special effects on beat detection
    if (isBeat && outlineRef.current) {
      // Create multiple RGB-shifted outlines that expand and fade
      const outline = document.createElement('div')
      outline.className = 'absolute inset-0 z-0'
      outline.style.color = 'transparent'
      outline.style.textShadow = `
        -3px 0 2px rgba(255,0,0,0.7),
        3px 0 2px rgba(0,255,255,0.7),
        0 -3px 2px rgba(0,255,0,0.7),
        0 3px 2px rgba(0,0,255,0.7)
      `
      outline.style.animation = 'outline-pulse 1s forwards'
      outline.style.opacity = '0'
      outline.style.transform = 'scale(1.2)' // Increased initial scale to avoid small text
      outline.style.fontSize = 'inherit'
      outline.style.fontWeight = 'inherit'
      outline.style.lineHeight = 'inherit'
      outline.style.letterSpacing = 'inherit'
      outline.innerText = title
      
      outlineRef.current.appendChild(outline)
      
      // Remove after animation completes
      setTimeout(() => {
        if (outlineRef.current && outlineRef.current.contains(outline)) {
          outlineRef.current.removeChild(outline)
        }
      }, 1000)
    }
    
    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(analyzeAudio)
  }

  // Split title into characters for individual animation
  const titleChars = title.split('')

  return (
    <div className="relative text-center z-10">
      <div ref={titleContainerRef} className="relative">
        {/* Expanding outlines container */}
        <div ref={outlineRef} className="absolute inset-0 pointer-events-none overflow-visible">
          {/* Dynamic outlines will be added here on beats */}
        </div>
        
        {/* Main title with per-character animation */}
        <h1 className="text-6xl md:text-9xl font-bold text-white mb-8 relative tracking-tight transition-all duration-75">
          <span className="relative z-10 inline-block">
            {titleChars.map((char, index) => (
              <AnimatedCharacter
                key={index}
                char={char}
                index={index}
                isPlaying={isPlaying}
                bassLevel={audioLevels.bass}
                midLevel={audioLevels.mid}
                highLevel={audioLevels.high}
              />
            ))}
          </span>
        </h1>
      </div>
      
      {subtitle && (
        <div className={`text-white text-xl tracking-wide mb-8 transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}>
          {subtitle}
        </div>
      )}
      
      <button 
        onClick={togglePlay}
        className={`px-6 py-3 bg-black/50 border border-white/30 rounded-full text-white 
                  hover:bg-black/70 transition-colors ${isPlaying ? 'animate-pulse' : ''}`}
      >
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>
    </div>
  )
}
