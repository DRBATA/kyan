"use client"

import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 z-10 max-w-7xl mx-auto">
      {/* Main title with glow effect */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 relative">
          <span className="inline-block relative">
            <span className="relative z-10">The Morning Party</span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-pink-500 blur-xl opacity-30 z-0"></span>
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90">Experience the Vibe. Feel the Science.</p>
      </div>

      {/* Central matcha image */}
      <div className="relative w-full max-w-xl my-8">
        <div className="aspect-square relative overflow-hidden rounded-md shadow-2xl border-4 border-green-500/40">
          <div className="absolute inset-0 bg-pink-600 flex items-center justify-center">
            <Image
              src="/matcha-powder.jpg" 
              alt="Vibrant matcha powder"
              width={600}
              height={600}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
        <div className="bg-green-500/20 backdrop-blur-md p-6 rounded-lg border border-green-500/30 transform hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold text-white mb-2">ANTIOXIDANT POWER</h3>
          <p className="text-white/80">Powerful catechins for whole body wellness</p>
        </div>
        <div className="bg-yellow-400/20 backdrop-blur-md p-6 rounded-lg border border-yellow-400/30 transform hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold text-white mb-2">MATCHA FOCUS</h3>
          <p className="text-white/80">Balanced energy without the crash</p>
        </div>
        <div className="bg-pink-500/20 backdrop-blur-md p-6 rounded-lg border border-pink-500/30 transform hover:scale-105 transition-transform">
          <h3 className="text-2xl font-bold text-white mb-2">DOPAMINE RUSH</h3>
          <p className="text-white/80">Feel-good vibes to power your morning</p>
        </div>
      </div>
    </section>
  )
}
