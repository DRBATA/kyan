"use client"

import React from "react"
import { POSSIBLE_FATES } from "@/lib/mocktail-data" // ✅ keep if other parts of your app still use it

/* ------------------------------------------------------------------
   SVG DECORATIONS
-------------------------------------------------------------------*/
const MatchaLeaf = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 3C7.5 3 4 6.5 4 11C4 15.5 7.5 19 12 19C16.5 19 20 15.5 20 11C20 6.5 16.5 3 12 3Z" fill="#4CAF50" />
    <path d="M12 5C8.5 5 6 7.5 6 11C6 14.5 8.5 17 12 17C15.5 17 18 14.5 18 11C18 7.5 15.5 5 12 5Z" fill="#8BC34A" />
    <path d="M12 7C9.5 7 8 8.5 8 11C8 13.5 9.5 15 12 15C14.5 15 16 13.5 16 11C16 8.5 14.5 7 12 7Z" fill="#CDDC39" />
  </svg>
)

const CocktailGlass = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M8 4H20L16 16H12L8 4Z" fill="#E1F5FE" fillOpacity="0.7" />
    <path d="M8 4H20L16 16H12L8 4Z" stroke="#81D4FA" />
    <path d="M14 16V22" stroke="#81D4FA" />
    <path d="M10 24H18" stroke="#81D4FA" />
  </svg>
)

const WaterBottle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M10 2H14V4C14 5 15 6 15 7V21C15 21.6 14.6 22 14 22H10C9.4 22 9 21.6 9 21V7C9 6 10 5 10 4V2Z" fill="#BBDEFB" fillOpacity="0.8" stroke="#2196F3" />
    <path d="M9 10H15M9 14H15" stroke="#2196F3" />
  </svg>
)

const Cherry = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="16" r="4" fill="#E53935" />
    <circle cx="16" cy="16" r="4" fill="#C62828" />
    <path d="M8 12C8 8 10 6 12 4C14 6 16 8 16 12" stroke="#4CAF50" />
  </svg>
)

const CocktailUmbrella = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5C8 5 5 8 5 12H19C19 8 16 5 12 5Z" fill="#FF4081" stroke="#F06292" />
    <path d="M12 5V18" stroke="#F06292" />
  </svg>
)

const LimeSlice = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="#7CB342" />
    <circle cx="12" cy="12" r="6" fill="#AED581" />
    <circle cx="12" cy="12" r="3" fill="#F1F8E9" />
    <path d="M12 4V20M4 12H20" stroke="#558B2F" />
  </svg>
)

/* ------------------------------------------------------------------
   BAR MENU DATA  (all prices in AED)
-------------------------------------------------------------------*/
const matchaMocktails = [
  {
    id: "matcha-sunrise",
    emoji: "🌅",
    headline: "MATCHA SUNRISE ‘99",
    flavorText:
      "Premium matcha + OJ + grenadine. Watch the millennium boot-up sequence in your glass.",
    price: 35,
    color: "#FFB74D",
    textColor: "#1f2937",
  },
  {
    id: "desert-oasis",
    emoji: "🏝️",
    headline: "DESERT OASIS v1.0",
    flavorText:
      "Matcha, coconut water, mint, lime, agave. Hydration patch for Y2K survivors.",
    price: 37,
    color: "#66BB6A",
    textColor: "#1f2937",
  },
  {
    id: "y2k-fizz",
    emoji: "💾",
    headline: "Y2K FIZZ",
    flavorText:
      "Ceremonial matcha, passion fruit, lychee, sparkling water. Debugs midnight glitches.",
    price: 39,
    color: "#AB47BC",
    textColor: "#FFFFFF",
  },
]

const additionalDrinks = [
  {
    id: "kombucha-drink",
    emoji: "🍹",
    headline: "KOMBUCHA .EXE",
    flavorText:
      "Fermented startup culture in a bottle. Live cultures > bug culture.",
    price: 35,
    color: "#FFCA28",
    textColor: "#1f2937",
  },
  {
    id: "chaga",
    emoji: "🍄",
    headline: "CHAGA PATCH 1.9",
    flavorText:
      "Ancient forest wisdom DLL loaded for immune overclocking.",
    price: 37,
    color: "#A1887F",
    textColor: "#FFFFFF",
  },
  {
    id: "perrier-chic",
    emoji: "💦",
    headline: "PERRIER dot-CHIC",
    flavorText:
      "Bubbles with a French accent. Dial-up fizz, broadband refresh.",
    price: 32,
    color: "#81D4FA",
    textColor: "#1f2937",
  },
  {
    id: "perrier-magnetic",
    emoji: "✨",
    headline: "PERRIER MAG-NETIC",
    flavorText:
      "Mineral pull that auto-saves hydration. Click to refresh.",
    price: 34,
    color: "#90CAF9",
    textColor: "#1f2937",
  },
]

/* ------------------------------------------------------------------
   DECORATIVE ELEMENT PICKER
-------------------------------------------------------------------*/
const getDecorativeElement = (index: number) => {
  switch (index % 6) {
    case 0:
      return (
        <div className="absolute -top-3 -right-3 animate-pulse">
          <MatchaLeaf />
        </div>
      )
    case 1:
      return (
        <div className="absolute top-1/2 -right-3 animate-float">
          <Cherry />
        </div>
      )
    case 2:
      return (
        <div className="absolute -bottom-3 -right-3 animate-bounce-slow">
          <CocktailGlass />
        </div>
      )
    case 3:
      return (
        <div className="absolute -top-3 -left-3 animate-spin-slow">
          <CocktailUmbrella />
        </div>
      )
    case 4:
      return (
        <div className="absolute top-1/2 -left-3 animate-float">
          <LimeSlice />
        </div>
      )
    case 5:
      return (
        <div className="absolute -bottom-3 -left-3 animate-pulse">
          <WaterBottle />
        </div>
      )
    default:
      return null
  }
}

/* ------------------------------------------------------------------
   MENU COMPONENT
-------------------------------------------------------------------*/
const FancyMocktailMenu = () => {
  const allDrinks = [...matchaMocktails, ...additionalDrinks] // ✅ fate-wheel drinks removed

  return (
    <div className="text-green-400 space-y-6">
      <h2 className="text-yellow-500 font-mono text-2xl mb-6 text-center font-bold">
        Y2K MATCHA BAR MENU
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {allDrinks.map((drink, index) => (
          <div
            key={drink.id}
            className="relative border-2 bg-slate-800 p-4 rounded-md overflow-hidden"
            style={{ borderColor: drink.color }}
          >
            {/* floating SVG garnish */}
            {getDecorativeElement(index)}

            <div className="flex justify-between items-center">
              <h3 className="flex items-center space-x-2 font-mono text-xl font-bold">
                {/* little colored dot to echo fate-wheel palette */}
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: drink.color }}
                />
                <span className="text-yellow-500">{drink.headline}</span>
              </h3>
              <span className="text-yellow-400 font-mono font-bold">
                {drink.price} AED
              </span>
            </div>

            <p className="text-green-400 font-mono italic my-2">
              “{drink.flavorText}”
            </p>

            {/* main emoji */}
            <span className="text-2xl">{drink.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FancyMocktailMenu
