"use client"

import React from "react"

const EventPanel = () => {
  return (
    <section className="text-green-400 font-mono space-y-6">
      {/* PUMPED 90s HEADLINE */}
      <header className="border-2 border-yellow-500 bg-slate-800 p-4 rounded-md text-center">
        <h2 className="text-3xl text-yellow-500 font-bold tracking-wider">
          > THE MORNING PARTY :: JUNE 15 '25
        </h2>
        <p className="mt-2 text-lg italic text-green-300">
          "Wake up, plug in, drink green — <br className="sm:hidden" />
          the city reboots @ <span className="text-cyan-400">11:00 AM</span>."
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
            <span role="img" aria-label="vinyl">
              🎧
            </span>
            <span>BLISS ON THE FADERS</span>
          </h3>
          <p className="mt-1 text-green-400">
            3-hour sunrise house set <br />
            <span className="text-cyan-300">100 % vibe ↑</span>
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
            <span>AZZA ALMUGHARRY PILATES POP-UP</span>
          </h3>
          <p className="mt-1 text-green-400">
            20-min power flow <br />
            for core-memory mornings
          </p>
        </li>

        {/* MATCHA ACTIVATION */}
        <li className="border-2 border-lime-400 bg-slate-900 p-4 rounded-md relative">
          <span className="absolute -top-3 -left-3 bg-lime-400 text-slate-900 px-2 font-bold">
            SIP
          </span>
          <h3 className="text-lime-300 text-xl font-bold flex items-center space-x-2">
            <span role="img" aria-label="tea">
              🍵
            </span>
            <span>Hadeel's MATCHA BAR</span>
          </h3>
          <p className="mt-1 text-green-400">
            45 AED signature pour &plus; <br />
            face-mask station (75 AED)
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
            <span>POWDER BEAUTY RAFFLE</span>
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
          > RUN OF SHOW
        </h3>
        <ol className="list-decimal pl-6 mt-2 space-y-1 text-green-400">
          <li>11 : 00 — Check-in & drink tokens</li>
          <li>11 : 15 — Hadeel's 90s intro + welcome sip</li>
          <li>11 : 30 — DJ spin-up & activations open</li>
          <li>12 : 30 — "Mocktail Roulette" live round</li>
          <li>13 : 45 — Powder Beauty raffle draw</li>
          <li>14 : 00 — Soft close / mingle</li>
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
