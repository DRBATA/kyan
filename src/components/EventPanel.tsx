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
        {/* DJ */}
        <li className="border-2 border-cyan-400 bg-slate-900 p-4 rounded-md relative">
  <span className="absolute -top-3 -left-3 bg-cyan-400 text-slate-900 px-2 font-bold">
    DJ DECK
  </span>
  <h3 className="text-cyan-300 text-xl font-bold flex items-center space-x-2">
    <span role="img" aria-label="vinyl">🎧</span>
    <a 
      href="https://www.instagram.com/lacrespower_/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:text-pink-300 transition-colors duration-300 underline decoration-dotted underline-offset-2"
    >
      Oriana on the Faders
    </a>
  </h3>
  <p className="mt-1 text-green-400">
    90-minute Tech House <br />
    <a 
      href="https://www.youtube.com/watch?v=In7T5iwVUn8" 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-cyan-300 hover:text-pink-300 transition-colors duration-300 underline decoration-dotted underline-offset-2"
    >
      “Major league vibes” — YouTube
    </a>
  </p>
</li>


     {/* FITNESS */}
<li className="border-2 border-pink-400 bg-slate-900 p-4 rounded-md relative">
  <span className="absolute -top-3 -left-3 bg-pink-400 text-slate-900 px-2 font-bold">
    MOVE
  </span>
  <h3 className="text-pink-300 text-xl font-bold flex items-center space-x-2">
    <span role="img" aria-label="flex">
      💪
    </span>
    <span>
      <a 
        href="https://www.instagram.com/coachdias_/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-cyan-300 transition-colors duration-300 underline decoration-dotted underline-offset-2"
      >
        F45 POP-UP WITH DIAS
      </a>
    </span>
  </h3>
  <p className="mt-1 text-green-400">
    20-min HIIT blast <br />
    for core-memory mornings
  </p>
</li>


{/* MATCHA FEATURE */}
<li className="border-2 border-lime-400 bg-slate-900 p-4 rounded-md relative">
  <span className="absolute -top-3 -left-3 bg-lime-400 text-slate-900 px-2 font-bold">
    SIP
  </span>
  <h3 className="text-lime-300 text-xl font-bold flex items-center space-x-2">
    <span role="img" aria-label="tea">
      🍵
    </span>
    <span>
      Featured Matcha{' '}
      <a 
        href="https://www.instagram.com/matcha_ibrahim/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-cyan-300 transition-colors duration-300 underline decoration-dotted underline-offset-2"
      >
        Mixologist
      </a>
    </span>
  </h3>
  <p className="mt-1 text-green-400">
    Signature ceremonial pours <br />
    from the heart of matcha culture
  </p>
</li>


        {/* RAFFLE */}
        <li className="border-2 border-yellow-400 bg-slate-900 p-4 rounded-md relative">
          <span className="absolute -top-3 -left-3 bg-yellow-400 text-slate-900 px-2 font-bold">
            WIN
          </span>
          <h3 className="text-yellow-300 text-xl font-bold flex items-center space-x-2">
            <span role="img" aria-label="ticket">
              🎟️
            </span>
            <span><a 
      href="https://www.instagram.com/powderbeautyofficial/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="hover:text-cyan-300 transition-colors duration-300 underline decoration-dotted underline-offset-2"
    >
      Powder Beauty Raffle
    </a></span>
          </h3>
          <p className="mt-1 text-green-400">
            AED 1 000 bespoke hamper <br />
            draw @ 1 : 45 PM
          </p>
        </li>
      </ul>

   {/* TIMELINE */}
   <div className="border-2 border-green-400 bg-slate-800 p-4 rounded-md">
  <h3 className="text-green-300 text-2xl font-bold">
    {'>'} RUN OF SHOW
  </h3>
  <ol className="list-decimal pl-6 mt-2 space-y-2 text-green-400">
    <li>11:00 — Guest check-in & claim your free Matcha token</li>
    <li>11:30 — Breathwork session</li>
    <li>
      12:15 — Welcome & Opening by{' '}
      <a
        href="https://www.instagram.com/catchamatcha/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-300 underline decoration-dotted underline-offset-2 hover:text-pink-300 transition-colors"
      >
        Hadeel (Catcha Matcha)
      </a>
    </li>
    <li>12:30 — DJ spin-up + activations open</li>
    <li>
      12:30–2:45 — Ongoing activations:
      <ul className="list-disc pl-6 mt-1 space-y-1">
        <li>
          🍵 Matcha face masks —{' '}
          <a
            href="https://www.instagram.com/catchamatcha/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 underline decoration-dotted hover:text-pink-300"
          >
            Catcha Matcha
          </a>
        </li>
        <li>
          💆 Express massages —{' '}
          <a
            href="https://www.instagram.com/saanteselfcare/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 underline decoration-dotted hover:text-pink-300"
          >
            Saante
          </a>
        </li>
        <li>⚡ Electrolyte shots — Oneshot</li>
        <li>💊 Collagen samples — Valeo</li>
        <li>📸 Photobooth moments</li>
      </ul>
    </li>
    <li>
      2:45 — Raffle draw by{' '}
      <a
        href="https://www.instagram.com/powderbeautyofficial/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-300 underline decoration-dotted hover:text-pink-300"
      >
        Powder Beauty
      </a>
    </li>
  </ol>
</div>



      {/* FOOTER SLOGAN */}
      <footer className="text-center text-green-500 italic pt-4">
        Hydrate&nbsp;hard. Glow&nbsp;harder. See you under the neon sun.
      </footer>
    </section>
  )
}

export default EventPanel
