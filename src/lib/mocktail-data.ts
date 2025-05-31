export interface Fate {
  id: string
  emoji: string
  headline: string
  flavorText: string
  color: string // A hex color for the wheel segment
  textColor: string // For contrast on the wheel segment
}

export const POSSIBLE_FATES: Fate[] = [
  {
    id: "matcha",
    emoji: "🍵",
    headline: "MATCHA MATCH",
    flavorText: "You drew the green sword of clarity. Razor-bright focus, creamy calm, and a smug aura of wellness.",
    color: "#84cc16",
    textColor: "#1f2937",
  },
  {
    id: "perrier",
    emoji: "🥒",
    headline: "THE DASTARDLY PERRIER",
    flavorText:
      "Flat in spirit, bubbly in complexion. It's basically sparkling self-doubt with a lime wedge. Hydrate, reflect, repent.",
    color: "#38bdf8",
    textColor: "#ffffff",
  },
  {
    id: "kombucha",
    emoji: "🧉",
    headline: "KOMBUCHA KURSE",
    flavorText:
      "Welcome to Funky Town: probiotic tang, vinegar sass, and a hint of 'did I just lick a barn?' Your gut will thank you. Your tongue—maybe not.",
    color: "#f97316",
    textColor: "#ffffff",
  },
  {
    id: "mojito",
    emoji: "🌶️",
    headline: "SPICY SAD MOJITO",
    flavorText: "Mint-jalapeño chaos. Tears optional, nose-run guaranteed. You didn't lose—you just leveled up.",
    color: "#ef4444",
    textColor: "#ffffff",
  },
  {
    id: "unicorn",
    emoji: "🪄",
    headline: "UNICORN FOAM",
    flavorText:
      "Lavender-vanilla cloud, topped with color-shift shimmer. Twice as pretty as you, zero calories of guilt.",
    color: "#c084fc",
    textColor: "#1f2937",
  },
  {
    id: "empty",
    emoji: "🖤",
    headline: "EMPTY CHAMBER",
    flavorText:
      "Nothing poured. Existential silence. The bartender stares into your soul and whispers, 'Water is an option.'",
    color: "#475569",
    textColor: "#ffffff",
  },
]

export const ROULETTE_CONFIG = {
  numSpins: 10, // How many full rotations before settling
  spinDuration: 5000, // ms
  wheelRadius: 3,
  wheelHeight: 1,
  segmentArc: (2 * Math.PI) / POSSIBLE_FATES.length,
}
