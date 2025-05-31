"use client"

import { useEffect, useRef } from 'react'

export default function ParallaxSquares() {
  const squaresRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleScroll = () => {
      if (!squaresRef.current) return
      
      const squares = squaresRef.current.querySelectorAll('.parallax-square')
      const scrollY = window.scrollY
      
      squares.forEach((square, index) => {
        const speed = 0.1 + (index * 0.05)
        const yPos = -(scrollY * speed)
        const xPos = (index % 2 === 0) ? (scrollY * speed * 0.3) : -(scrollY * speed * 0.3)
        const rotation = scrollY * (0.02 + (index * 0.01)) * (index % 2 === 0 ? 1 : -1)
        
        // Apply the transform
        ;(square as HTMLElement).style.transform = `translate3d(${xPos}px, ${yPos}px, 0) rotate(${rotation}deg)`
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={squaresRef} className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Top-right green square */}
      <div className="parallax-square absolute top-[10%] right-[5%] w-40 h-40 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 opacity-40 blur-sm"></div>
      
      {/* Bottom-left pink square */}
      <div className="parallax-square absolute bottom-[20%] left-[10%] w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-gradient-to-tr from-pink-500 to-pink-400 opacity-40 blur-sm"></div>
      
      {/* Mid-center yellow square */}
      <div className="parallax-square absolute top-[40%] left-[30%] w-24 h-24 md:w-40 md:h-40 rounded-3xl bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-30 blur-sm"></div>
      
      {/* Small cyan square */}
      <div className="parallax-square absolute top-[60%] right-[20%] w-16 h-16 md:w-32 md:h-32 rounded-3xl bg-gradient-to-l from-cyan-400 to-blue-500 opacity-30 blur-sm"></div>
      
      {/* Extra small green square */}
      <div className="parallax-square absolute top-[75%] right-[40%] w-12 h-12 md:w-24 md:h-24 rounded-3xl bg-gradient-to-bl from-green-300 to-teal-400 opacity-30 blur-sm"></div>
    </div>
  )
}
