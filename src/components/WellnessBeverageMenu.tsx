"use client"

import React from 'react';

/* ------------------------------------------------------------------
   SVG DECORATIONS - Modern wellness-focused icons
-------------------------------------------------------------------*/
const WaterDropIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#4CC9F0" fillOpacity="0.9" />
    <path d="M12 5.5l3.5 3.5a5 5 0 1 1-7 0z" fill="#76E4FF" fillOpacity="0.7" />
  </svg>
)

const CopperVesselIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6H19L18 22H10L9 6Z" fill="#DD8E6C" fillOpacity="0.8" />
    <path d="M9 6H19L18 22H10L9 6Z" stroke="#C27B58" />
    <path d="M11 9H17M11 12H17M11 15H17" stroke="#C27B58" strokeOpacity="0.7" />
    <path d="M11 22V24H17V22" stroke="#C27B58" />
  </svg>
)

const SparklingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L12.8 8.2H19L14.1 12.2L15.5 18.6L12 14.8L8.5 18.6L9.9 12.2L5 8.2H11.2L12 2Z" fill="#F8D8FF" fillOpacity="0.9"/>
    <path d="M6 14L7 17M18 14L17 17M12 19V22" stroke="#BD93F9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ChagaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6C16.4183 6 20 9.58172 20 14C20 18.4183 16.4183 22 12 22C7.58172 22 4 18.4183 4 14C4 9.58172 7.58172 6 12 6Z" fill="#8E6C44" fillOpacity="0.8"/>
    <path d="M12 9C14.7614 9 17 11.2386 17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9Z" fill="#B08C64" fillOpacity="0.7"/>
    <path d="M8 5L9 2M12 4V1M16 5L15 2" stroke="#8E6C44" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const GingerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6C7.5 6 4 9.5 4 14C4 16 5 18 7 19C9 20 11 19.5 12 18C13 19.5 15 20 17 19C19 18 20 16 20 14C20 9.5 16.5 6 12 6Z" fill="#FB923C" fillOpacity="0.8"/>
    <path d="M12 10V14M9 12H15" stroke="#934C14" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ElectrolyteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L5 14H19L12 2Z" fill="#00B4D8" fillOpacity="0.7"/>
    <path d="M9 14L12 22L15 14" fill="#38E6FF" fillOpacity="0.5"/>
    <path d="M9 10H15" stroke="#0077B6" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const CacaoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V16C17 18.7614 14.7614 21 12 21C9.23858 21 7 18.7614 7 16V8Z" fill="#7B5E3E" fillOpacity="0.8"/>
    <path d="M9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8V16C15 17.6569 13.6569 19 12 19C10.3431 19 9 17.6569 9 16V8Z" fill="#A07B55" fillOpacity="0.7"/>
    <path d="M12 8V12M10 10H14" stroke="#5D3C0E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

/* ------------------------------------------------------------------
   WELLNESS BEVERAGE MENU DATA
-------------------------------------------------------------------*/
const wellnessDrinks = [
  {
    id: "prana-spring",
    icon: <WaterDropIcon />,
    headline: "Prana Spring Water",
    summary: "Silky, ultra-pure spring water formulated for gentle, rapid hydration.",
    notes: "Low mineralization (< 50 mg/L) and neutral pH (~ 7.4) for rapid, gentle hydration. Sourced from an Arctic Circle spring in Pushnoy, Russia.",
    price: 30,
    color: "#4CC9F0",
    textColor: "#0F172A",
    experience: "AOI ICE",
    benefit: "Deeply rehydrates and restores cellular balance. Promotes grounding and stability.",
  },
  {
    id: "copper-refill",
    icon: <CopperVesselIcon />,
    headline: "Copper Refill Bottle",
    summary: "Pure filtered water in a copper vessel for balanced, ritual-style hydration.",
    notes: "Polished copper vessel believed to support vitality and holistic balance. Unlimited refills; bottles refreshed every 2–4 hours to maintain purity.",
    price: 35,
    color: "#DD8E6C",
    textColor: "#0F172A",
    experience: "AOI EARTH",
    benefit: "Grounds and supports metabolic function. Enhances cellular regeneration and renewal.",
  },
  {
    id: "maison-perrier",
    icon: <SparklingIcon />,
    headline: "Maison Perrier® Chic Collection",
    summary: "Two low-calorie, alcohol-free sparkling mocktails with peach or lemon-mint accents.",
    notes: "Rosélini: delicate peach aromatics, fine effervescence. Lemonjito: zesty lemon and bright mint with gentle bubbles. Crafted for sophisticated taste without compromise.",
    price: 45,
    color: "#BD93F9",
    textColor: "#0F172A",
    experience: "AOI AIR / Detox Trinity",
    benefit: "Offers refined refreshment enhancing the elevating experience. Provides a celebratory finish.",
  },
  {
    id: "kimbucha-chaga",
    icon: <ChagaIcon />,
    headline: "YALA Kimbucha × New Mind Chaga",
    summary: "Sparkling kombucha infused with wildcrafted chaga for gut health and adaptogenic support.",
    notes: "Probiotic-rich for digestive balance. Adaptogenic chaga extract for mental clarity and calm.",
    price: 42,
    color: "#8E6C44",
    textColor: "#FFFFFF",
    experience: "AOI AIR / AOI EARTH / Detox Trinity",
    benefit: "Promotes cellular adaptation and supports mental calm. Stabilizes gut-brain balance for deeper relaxation.",
  },
  {
    id: "ginger-shots",
    icon: <GingerIcon />,
    headline: "Ginger Shots",
    summary: "Concentrated cold-pressed ginger shot for immunity, metabolism boost, and mental clarity.",
    notes: "Cold-pressed ginger for immune support and metabolic activation. Optional citrus (lemon or cayenne) adds bright finish.",
    price: 25,
    color: "#FB923C",
    textColor: "#0F172A",
    experience: "AOI HEAT",
    benefit: "Boosts metabolism and circulation. Supports release of blockages and fear patterns.",
  },
  {
    id: "aqua-aura",
    icon: <ElectrolyteIcon />,
    headline: "Aqua Aura",
    summary: "A vibrant, electrolyte-packed berry-lime-guava drink for mineral replenishment and natural energy.",
    notes: "Electrolyte-rich formula to replenish minerals and support muscle function. Natural energy boost with light tropical notes.",
    price: 38,
    color: "#00B4D8",
    textColor: "#0F172A",
    experience: "AOI ICE",
    benefit: "Replenishes electrolytes. Restores mood and encourages celebration post-cold exposure.",
  },
  {
    id: "gaia-experience",
    icon: <CacaoIcon />,
    headline: "The Gaia Experience",
    summary: "Grounding cacao-coconut blend with cinnamon and date for relaxation and sustained vitality.",
    notes: "Magnesium-rich cacao for relaxation and mood support. Cinnamon for circulation and date syrup for sustained energy.",
    price: 40,
    color: "#7B5E3E",
    textColor: "#FFFFFF",
    experience: "AOI HEAT",
    benefit: "Provides magnesium for muscle relaxation and mood balance. Supports release of tension.",
  },
]

/* ------------------------------------------------------------------
   WELLNESS BEVERAGE MENU COMPONENT
-------------------------------------------------------------------*/
const WellnessBeverageMenu = () => {
  return (
    <div className="text-slate-800 space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {wellnessDrinks.map((drink) => (
          <div
            key={drink.id}
            className="relative border bg-white/90 backdrop-blur-sm p-5 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{ 
              borderColor: `${drink.color}40`,
              background: `linear-gradient(to right, white, white, ${drink.color}10)`
            }}
          >
            <div className="absolute -right-4 -top-4 opacity-20" style={{ color: drink.color }}>
              {drink.icon}
            </div>

            <div className="flex justify-between items-start">
              <h3 className="flex items-center space-x-3 font-sans text-xl font-bold">
                {/* Colored icon */}
                <span className="text-2xl">{drink.icon}</span>
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {drink.headline}
                </span>
              </h3>
              <span className="text-slate-600 font-sans font-semibold px-3 py-1 bg-slate-50 rounded-full">
                {drink.price} AED
              </span>
            </div>

            <p className="text-slate-600 my-2">
              {drink.summary}
            </p>

            <div className="mt-3 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              <p>{drink.notes}</p>
            </div>
            
            {/* Experience and Resonance Information */}
            <div className="mt-3 border-t border-slate-200 pt-3">
              <div className="flex items-center">
                <span className="mr-2 text-xs px-2 py-1 bg-slate-800 text-blue-300 rounded-md font-medium">
                  {drink.experience}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2">{drink.benefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WellnessBeverageMenu;
