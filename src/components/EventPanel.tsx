"use client"

import React from "react"
import Link from "next/link"

const EventPanel = () => {
  return (
    <section className="text-green-400 font-mono space-y-6">
      {/* PUMPED 90s HEADLINE */}
      <header className="border-2 border-yellow-500 bg-slate-800 p-4 rounded-md text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-3xl text-yellow-500 font-bold tracking-wider">
            {'>'} JUNE 15 &apos;25
          </h2>
          <p className="text-green-200 mb-2">
            Join us on JUNE 15 as{" "}
            <a 
              href="https://www.instagram.com/kayanfestival/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-100 font-bold transition-colors underline decoration-dotted"
            >
              Kayan Festival
            </a>{" "}
            presents
          </p>
          <p className="text-green-200 mb-2">
            in association with{" "}
            <a 
              href="https://www.instagram.com/thewaterbarae/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-300 hover:text-cyan-100 font-bold transition-colors underline decoration-dotted"
            >
              The Water Bar
            </a>
          </p>
          <div>
            <Link
              href="https://www.eventbrite.com/e/the-morning-party-tickets-123456789"
              target="_blank"
              className="inline-block border-2 border-[#00FF6A] bg-[#00C54F] hover:bg-[#7AAA5D] text-white font-mono font-bold px-6 py-2 rounded-md shadow-lg transition-all duration-300 hover:scale-105"
            >
              🎟️  BUY TICKET — 150 AED
            </Link>
          </div>
        </div>
        <p className="mt-2 text-lg italic text-green-300">
          &quot;Wake up, plug in, drink green — <br className="sm:hidden" />
          the city reboots @ <span className="text-cyan-400">11:00 AM</span>.&quot;
        </p>
      </header>

      {/* QUICK-FIRE HYPE LIST */}
      <ul className="grid sm:grid-cols-2 gap-4">
        {/* AOI LIGHT ZONE */}
        <li className="border-2 border-purple-400 bg-slate-900 p-4 rounded-md relative">
          <span className="absolute -top-3 -left-3 bg-purple-400 text-slate-900 px-2 font-bold">
            TUNE
          </span>
          <h3 className="text-purple-300 text-xl font-bold flex items-center space-x-2">
            <span role="img" aria-label="stars">✨</span>
            <span>AOI Dome Frequency Bath</span>
          </h3>
          <p className="mt-1 text-green-400">
            Light-sound immersion at 528hz <br />
            Recharge your nervous system & vibe with your aura
          </p>
        </li>


     {/* AOI EARTH MODULE */}
<li className="border-2 border-green-400 bg-slate-900 p-4 rounded-md relative">
  <span className="absolute -top-3 -left-3 bg-green-400 text-slate-900 px-2 font-bold">
    GROUND
  </span>
  <h3 className="text-green-300 text-xl font-bold flex items-center space-x-2">
    <span role="img" aria-label="earth">🌍</span>
    <span>Solarium Rest Chamber</span>
  </h3>
  <p className="mt-1 text-green-400">
    Recline, realign, restore. Lay-flat zone for full-body chill <br />
    Earth pulse meets ambient tonewaves.
  </p>
</li>


{/* AOI FIRE + MOVEMENT */}
<li className="border-2 border-pink-400 bg-slate-900 p-4 rounded-md relative">
  <span className="absolute -top-3 -left-3 bg-pink-400 text-slate-900 px-2 font-bold">
    HEAT
  </span>
  <h3 className="text-pink-300 text-xl font-bold flex items-center space-x-2">
    <span role="img" aria-label="fire">🔥</span>
    <span>Infrared Sauna Lounge</span>
  </h3>
  <p className="mt-1 text-green-400">
    Detox like a data reset — sweat session w/ sound overlays <br />
    Can be paired with movement or stillness. You choose.
  </p>
</li>


        {/* AOI ICE + REFRESH */}
        <li className="border-2 border-cyan-400 bg-slate-900 p-4 rounded-md relative">
          <span className="absolute -top-3 -left-3 bg-cyan-400 text-slate-900 px-2 font-bold">
            REBOOT
          </span>
          <h3 className="text-cyan-300 text-xl font-bold flex items-center space-x-2">
            <span role="img" aria-label="ice cube">🧊</span>
            <span>AOI Ice Ritual Station</span>
          </h3>
          <p className="mt-1 text-green-400">
            Breath-guided plunge to recalibrate your mind + body <br />
            Optional chants, cold shot pairings, and camera moments.
          </p>
        </li>
      </ul>

   {/* WELLNESS TOOLS */}
   <div className="border-2 border-indigo-400 bg-slate-800 p-4 rounded-md">
     <h3 className="text-indigo-300 text-2xl font-bold">
       {'>'} WELLNESS TOOLS
     </h3>
     <div className="mt-3 space-y-3 text-green-400">
       <p className="font-bold text-purple-300">PranaPulse-Code:</p>
       <p>
         A unique 528hz light and sound program developed over 20 years of research into ancient healing modalities.
       </p>
       
       <p className="font-bold text-cyan-300 mt-4">360-degree Cellular Rejuvenation™:</p>
       <p>
         Experience the transformative power of our technology, promoting overall improvement in mental, energetic, and emotional health.
       </p>
       
       <div className="flex flex-wrap gap-2 mt-3">
         <a 
           href="https://facebook.com/artofimplosion" 
           target="_blank"
           rel="noopener noreferrer" 
           className="text-sm bg-blue-600/30 text-blue-300 px-2 py-1 rounded hover:bg-blue-600/50 transition-colors">
           facebook.com +6
         </a>
         <a 
           href="https://artofimplosion.com" 
           target="_blank"
           rel="noopener noreferrer" 
           className="text-sm bg-purple-600/30 text-purple-300 px-2 py-1 rounded hover:bg-purple-600/50 transition-colors">
           artofimplosion.com +6
         </a>
         <a 
           href="https://apps.apple.com/us/app/art-of-implosion/id123456789" 
           target="_blank"
           rel="noopener noreferrer" 
           className="text-sm bg-gray-600/30 text-gray-300 px-2 py-1 rounded hover:bg-gray-600/50 transition-colors">
           apps.apple.com +6
         </a>
       </div>
     </div>
   </div>
   
   {/* ART & FASHION */}
   <div className="border-2 border-pink-400 bg-slate-800 p-4 rounded-md">
     <h3 className="text-pink-300 text-2xl font-bold">
       {'>'} ART & FASHION
     </h3>
     <div className="mt-3 space-y-3 text-green-400">
       <p className="font-bold text-yellow-300">Art Gallery:</p>
       <p>
         Explore visionary works by Johny Dar and collaborating artists.
       </p>
       
       <p className="font-bold text-green-300 mt-4">Fashion Studio:</p>
       <p>
         Discover curated fashion pieces blending art and style.
       </p>
       
       <div className="flex flex-wrap gap-2 mt-3">
         <a 
           href="https://artofimplosion.com" 
           target="_blank"
           rel="noopener noreferrer" 
           className="text-sm bg-purple-600/30 text-purple-300 px-2 py-1 rounded hover:bg-purple-600/50 transition-colors">
           artofimplosion.com +4
         </a>
         <a 
           href="https://johnydar.com/gallery" 
           target="_blank"
           rel="noopener noreferrer" 
           className="text-sm bg-pink-600/30 text-pink-300 px-2 py-1 rounded hover:bg-pink-600/50 transition-colors">
           johnydar.com +4
         </a>
         <a 
           href="https://johnydar.com/fashion" 
           target="_blank"
           rel="noopener noreferrer" 
           className="text-sm bg-teal-600/30 text-teal-300 px-2 py-1 rounded hover:bg-teal-600/50 transition-colors">
           johnydar.com +4
         </a>
       </div>
     </div>
   </div>



      {/* FOOTER SLOGAN */}
      <footer className="text-center text-green-500 italic pt-4">
        Hydrate&nbsp;hard. Glow&nbsp;harder. See you under the neon sun.
      </footer>
    </section>
  )
}

export default EventPanel
