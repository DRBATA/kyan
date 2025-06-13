"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Character } from "@/lib/character-data"

// Mock sound manager since the actual file doesn't exist
const soundManager = {
  playSound: (sound: string) => console.log(`Would play sound: ${sound}`),
  stopAllSounds: () => console.log('Would stop all sounds'),
  setVolume: (volume: number) => console.log(`Would set volume to: ${volume}`),
  // Add missing methods to fix type errors
  playBackgroundMusic: () => console.log('Would play background music'),
  stopBackgroundMusic: () => console.log('Would stop background music'),
  toggleMute: () => {
    console.log('Would toggle mute');
    return false; // Return false to indicate not muted
  }
}

interface TextRPGProps {
  selectedCharacter: Character
}

type GameScreen =
  | "intro"
  | "village"
  | "map"
  | "tea_gardens"
  | "tropical_cove"
  | "mountain_peak"
  | "ice_caves"
  | "sacred_temple"
  | "deep_forest"
  | "crystal_lake"
  | "console"
  | "cart_frequencies"
  | "cart_drinks"
  | "checkout"
  | "postgame_frequencies"
  | "postgame_drinks"
  | "ending"

interface GameState {
  currentScreen: GameScreen
  inventory: string[]
  currentTime: number
  textIndex: number
  showChoices: boolean
  gameComplete: boolean
  endingType: "legendary" | "heroic" | "clutch" | "miracle" | "failure"
}

export default function MatchaMadnessTextRPG({ selectedCharacter }: TextRPGProps) {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: "intro",
    inventory: [],
    currentTime: 23 * 60 + 30, // 11:30 PM in minutes since midnight
    textIndex: 0,
    showChoices: false,
    gameComplete: false,
    endingType: "failure",
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [textVisible] = useState(true)
  const [blinkCursor, setBlinkCursor] = useState(true)

  // Blink the cursor for that authentic 90s feel
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(blinkInterval)
  }, [])

  // Start game
  const startGame = () => {
    setHasStarted(true)
    soundManager.playBackgroundMusic()
  }

  // Toggle mute - preserved for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleMute = () => {
    const muted = soundManager.toggleMute()
    setIsMuted(muted)
  }

  // Advance text
  const advanceText = () => {
    soundManager.playSound("dialogueBeep")
    
    const currentScreenContent = getScreenContent(gameState.currentScreen)
    const textArray = currentScreenContent.text
    
    if (gameState.textIndex < textArray.length - 1) {
      // Find the next non-empty text entry
      let nextIndex = gameState.textIndex + 1
      while (nextIndex < textArray.length - 1 && !textArray[nextIndex]) {
        nextIndex++
      }
      
      setGameState((prev) => ({
        ...prev,
        textIndex: nextIndex,
        showChoices: nextIndex === textArray.length - 1, // Show choices if we've skipped to the last entry
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        showChoices: true,
      }))
    }
  }

  // Handle choice selection
  const handleChoice = (destination: GameScreen, collectItem?: string | string[], returnToMap?: boolean) => {
    soundManager.playSound("areaTransition")

    // Add items to inventory if specified
    const newInventory = [...gameState.inventory]
    let itemsCollected = false
    
    // Handle single item or multiple items
    if (collectItem) {
      if (typeof collectItem === 'string') {
        // Single item
        if (!newInventory.includes(collectItem)) {
          newInventory.push(collectItem)
          soundManager.playSound("questComplete")
          itemsCollected = true
        }
      } else {
        // Multiple items
        let addedItems = false
        collectItem.forEach(item => {
          if (!newInventory.includes(item)) {
            newInventory.push(item)
            addedItems = true
          }
        })
        if (addedItems) {
          soundManager.playSound("questComplete")
          itemsCollected = true
        }
      }
    }

    // Determine if we should return to map after collecting items
    // If returnToMap is explicitly set to false, we won't return to map
    // If itemsCollected is true and returnToMap isn't explicitly set to false, return to map
    const shouldReturnToMap = returnToMap !== false && itemsCollected && destination !== "map" && 
      destination !== "ending" && destination !== "console" && 
      !destination.includes("cart") && !destination.includes("postgame");
      
    const actualDestination = shouldReturnToMap ? "map" : destination;

    // Check for game completion
    if (actualDestination === "ending") {
      const endingType = determineEnding(gameState.currentTime)
      soundManager.stopBackgroundMusic()

      if (endingType === "failure") {
        soundManager.playSound("failureBuzzer")
      } else if (endingType === "miracle") {
        soundManager.playSound("miracleSave")
      } else {
        soundManager.playSound("victoryFanfare")
      }

      setGameState((prev) => ({
        ...prev,
        currentScreen: actualDestination,
        textIndex: 0,
        showChoices: false,
        gameComplete: true,
        endingType,
      }))
    } else {
      // Regular navigation
      setGameState((prev) => ({
        ...prev,
        currentScreen: actualDestination,
        textIndex: 0,
        showChoices: false,
        inventory: newInventory,
      }))
    }
  }

  // Countdown timer - time moves toward midnight
  useEffect(() => {
    if (!hasStarted || gameState.gameComplete) return

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.currentTime + 1 // Each second = 1 minute of game time

        // Check for failure at midnight (24 * 60 = 1440 minutes)
        if (newTime >= 24 * 60) {
          soundManager.stopBackgroundMusic()
          soundManager.playSound("failureBuzzer")
          return {
            ...prev,
            currentTime: 24 * 60,
            gameComplete: true,
            currentScreen: "ending",
            endingType: "failure",
            textIndex: 0,
            showChoices: false,
          }
        }

        return { ...prev, currentTime: newTime }
      })
    }, 4000) // Every 4 seconds = 1 minute of game time

    return () => clearInterval(timer)
  }, [hasStarted, gameState.gameComplete])

  // Determine ending based on how close to midnight
  const determineEnding = (currentTime: number): GameState["endingType"] => {
    const minutesFromStart = currentTime - (23 * 60 + 30) // Minutes since 11:30

    if (currentTime >= 24 * 60) return "failure" // Midnight = failure
    if (minutesFromStart <= 10) return "legendary" // Under 10 minutes
    if (minutesFromStart <= 20) return "heroic" // Under 20 minutes
    if (minutesFromStart <= 25) return "clutch" // Under 25 minutes
    return "miracle" // 25+ minutes but before midnight
  }

  // Get content for current screen
  const getScreenContent = (screen: GameScreen) => {
    // Define all screens
    const screens = {
      /* --- INTRO ------------------------------------------------------------ */
      intro: {
        title: "31 DEC 1999 • 23:30",
        sprite: "🛰️",
        text: [
          `A holographic projection of Johny Dar appears before you, surrounded by intricate geometric patterns that pulse with harmonic light.`,
          `"${selectedCharacter.name}, the world is at a frequency crossroads. While others rush outward in panic, we must travel inward."`,
          `"Y2K isn't just a technological glitch—it's a vibrational distortion threatening our biofield."`,
          `His hands weave through multidimensional patterns as he speaks, "My life's work—implosion rather than explosion—has prepared us for this moment."`,
          `"Through sacred geometry, biofield tuning, and the mathematical symmetry of wellness, we've encoded The Morning Party frequencies."`,
          `"But our Future-Is-Now protocol will vanish at midnight unless you help preserve these source vibrations."`,
          `"Your mission:"`,
          `☑ Recover 7 Frequency Shards matching our multi-lingual artistic codes`,
          `☑ Collect Drinks & Experiences that embody these vibrations`,
          `☑ Upload everything to the reboot console before 00:00 to collapse external distractions and reconnect with source"`,
          `"Remember, true wellness isn't found in overstimulation—it's in the inward journey where The Water Bar legacy lives."`
        ],
        choices: [{ text: "Access Frequency Map", destination: "map" }],
        bgColor: "from-purple-900 to-indigo-900",
      },

      /* --- OPERATIONS HUB (ORIGINAL) - KEEPING FOR REFERENCE ------------------- */
      village: {
        title: "OPERATIONS HUB",
        sprite: "💻",
        text: [
          `Johny Dar's hologram flickers on-screen:`,
          `"Welcome, Frequency Hero. Our mission is critical."`,
          `"Each frequency shard represents a unique healing vibration."`,
          `"Collect these shards and pair them with the right Water Bar elixir or AOI experience."`,
          `"Remember: frequency without embodiment is just noise."`,
          `"Which frequency zone calls to you first?"`
        ],
        choices: [
          { text: "Open Navigation Map", destination: "map" }
        ],
        bgColor: "from-indigo-800 to-blue-600",
      },
      
      /* --- FREQUENCY MAP - MAIN NAVIGATION HUB ------------------------------ */
      map: {
        title: "FREQUENCY MAP • NAVIGATION",
        sprite: "🏔️",
        text: [
          `⏰ TIME REMAINING: ${Math.floor(gameState.currentTime / 60)}:${(gameState.currentTime % 60).toString().padStart(2, '0')}`,
          `✨ FREQUENCIES COLLECTED: ${countFrequencyShards()}/7`,
          `🍹 FORMULAS SELECTED: ${countDrinkItems()}`,
          `Select a destination to continue your frequency rescue mission.`,
          `Each zone contains unique vibrational patterns that can be collected.`
        ],
        choices: [
          { text: "💧 Hydration Well (174 Hz)${gameState.inventory.includes('freq_174') ? ' ✅' : ''}", destination: "tea_gardens" },
          { text: "🔊 Sound Altar (396 Hz)${gameState.inventory.includes('freq_396') ? ' ✅' : ''}", destination: "mountain_peak" },
          { text: "✨ Light Vault (528 Hz)${gameState.inventory.includes('freq_528') ? ' ✅' : ''}", destination: "tropical_cove" },
          { text: "❄️ Cryo Bay (285 Hz)${gameState.inventory.includes('freq_285') ? ' ✅' : ''}", destination: "sacred_temple" },
          { text: "🐋 Resonance Chamber (963 Hz)${gameState.inventory.includes('freq_963') ? ' ✅' : ''}", destination: "ice_caves" },
          { text: "🌿 AOI Dome (639/852 Hz)${gameState.inventory.includes('freq_639') && gameState.inventory.includes('freq_852') ? ' ✅' : (gameState.inventory.includes('freq_639') || gameState.inventory.includes('freq_852') ? ' 🔶' : '')}", destination: "deep_forest" },
          { text: "🍹 Water-Bar Lounge (Formulas)", destination: "crystal_lake" },
          { text: "💻 Master Console (Upload)", destination: "console" },
          { text: "🔁 Review Frequencies", destination: "cart_frequencies" },
          { text: "🥤 Review Formulas", destination: "cart_drinks" }
        ],
        bgColor: "from-fuchsia-900 via-purple-800 to-indigo-700",
      },

      /* --- SHARD STATIONS (Immersive narrative dialogues) ----------------------------- */
      tea_gardens: {
        title: "HYDRATION WELL — 174 Hz: THE FOUNDATION",
        sprite: "💧",
        text: [
          `Dr. Aqua dips her fingers into the glowing waters of the Hydration Well, ripples radiating softly.`,
          `"This water holds the memory of Earth's purest vibrations—the 174 Hz frequency. It grounds and stabilizes every frequency you'll encounter."`,
          `"Here, take this vial of Prana Spring Water. Drink it and feel instant clarity and calm. Your cells will thank you."`,
          `${gameState.inventory.includes("drink_prana") ? "✅ You've secured your vial of Prana Spring Water, shimmering gently." : ""}`,
          `${gameState.inventory.includes("freq_174") ? "✅ 174 Hz shard pulses warmly in your collection." : ""}`
        ],
        choices: [
          { text: "Take the Prana Spring Water", destination: "tea_gardens", collectItem: "drink_prana" },
          { text: "Absorb the 174 Hz frequency shard", destination: "tea_gardens", collectItem: "freq_174" },
          { text: "✨ Secure both water and frequency shard", destination: "tea_gardens", collectItem: ["freq_174","drink_prana"] },
          { text: "🗺 Return to Frequency Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-blue-700 via-blue-500 to-cyan-400",
      },
      tropical_cove: {
        title: "LIGHT VAULT — 528 HZ: THE HARMONIZER",
        sprite: "🌈",
        text: [
          `Sol, the keeper of light codes, stands before spirals of gold and emerald beams.`,
          `"This is the 528 Hz miracle tone. Here, light splits into healing patterns—DNA realignment."`,
          `In-game: You absorb a vial of YALA Kimbucha × Chaga, glowing with transformation.`,
          `IRL: This is our YALA Kimbucha × Chaga—probiotic, adaptogenic, crafted for gut-brain harmony.`,
          `Would you like to add this to your formula?`,
          `${gameState.inventory.includes("drink_yala") ? "✅ YALA Kimbucha × Chaga added to your collection!" : ""}`,
          `${gameState.inventory.includes("freq_528") ? "✅ 528 Hz frequency shard preserved!" : ""}`
        ],
        choices: [
          { text: "Add YALA Kimbucha to cart", destination: "tropical_cove", collectItem: "drink_yala" },
          { text: "Collect 528 Hz frequency shard", destination: "tropical_cove", collectItem: "freq_528" },
          { text: "✨ Collect both frequency and kimbucha", destination: "tropical_cove", collectItem: ["freq_528", "drink_yala"] },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-yellow-400 via-lime-300 to-green-300",
      },
      mountain_peak: {
        title: "SOUND ALTAR — 396 HZ: THE UNBLOCKER",
        sprite: "🔊",
        text: [
          `Echo, the sound healer, tunes crystalline singing bowls.`,
          `"396 Hz clears obstacles and fears. The copper amplifies and conducts its power."`,
          `In-game: You attune a Copper Refill Bottle, which hums with resonance.`,
          `IRL: This is our Copper Refill Bottle—traditionally thought to boost immunity and support flow.`,
          `Would you like to add this to your formula?`,
          `${gameState.inventory.includes("drink_gaia") ? "✅ Copper Refill Bottle added to your collection!" : ""}`,
          `${gameState.inventory.includes("freq_396") ? "✅ 396 Hz frequency shard preserved!" : ""}`
        ],
        choices: [
          { text: "Add Copper Refill Bottle to cart", destination: "mountain_peak", collectItem: "drink_gaia" },
          { text: "Collect 396 Hz frequency shard", destination: "mountain_peak", collectItem: "freq_396" },
          { text: "✨ Collect both frequency and bottle", destination: "mountain_peak", collectItem: ["freq_396", "drink_gaia"] },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-amber-700 via-amber-500 to-yellow-300",
      },
      ice_caves: {
        title: "RESONANCE CHAMBER — 963 HZ: THE PINNACLE",
        sprite: "☀️",
        text: [
          `Astra, the frequency keeper, stands within a chamber of pure crystalline resonance.`,
          `"This is 963 Hz—the divine frequency. The peak of all vibrations."`,
          `"This frequency opens the door to pure awareness and unified consciousness."`,
          `In-game: You discover a hidden doorway that was invisible until now.`,
          `IRL: This represents the highest form of frequency healing—pure connection and awareness.`,
          `${gameState.inventory.includes("freq_963") ? "✅ 963 Hz frequency shard preserved! The divine frequency is part of your collection." : ""}`
        ],
        choices: [
          { text: "Collect 963 Hz frequency shard", destination: "ice_caves", collectItem: "freq_963" },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-yellow-300 via-yellow-200 to-amber-500",
      },
      sacred_temple: {
        title: "CRYO BAY — 285 HZ: THE REGENERATOR",
        sprite: "❄️",
        text: [
          `Kelvin, the thermal physicist, monitors a chamber of pulsing blue energy waves.`,
          `"This is 285 Hz—the cellular repair frequency. My cryo-technology preserves it in this quantum state."`,
          `In-game: You extract a vial of Cryo Elixir, chilled to precisely -285°.`,
          `IRL: This is our Cryo Elixir—a cellular rejuvenation formula with super-cooled molecular structure.`,
          `Would you like to add this to your formula?`,
          `${gameState.inventory.includes("drink_cryo") ? "✅ Cryo Elixir added to your collection!" : ""}`,
          `${gameState.inventory.includes("freq_285") ? "✅ 285 Hz frequency shard preserved!" : ""}`
        ],
        choices: [
          { text: "Add Cryo Elixir to cart", destination: "sacred_temple", collectItem: "drink_cryo" },
          { text: "Collect 285 Hz frequency shard", destination: "sacred_temple", collectItem: "freq_285" },
          { text: "✨ Collect both frequency and elixir", destination: "sacred_temple", collectItem: ["freq_285", "drink_cryo"] },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-blue-900 via-blue-700 to-cyan-300",
      },
      deep_forest: {
        title: "AOI DOME — 639 & 852 HZ: THE CONNECTOR",
        sprite: "🌿",
        text: [
          `Aria, the frequency architect, stands within a geodesic dome of interweaving light patterns.`,
          `"This dual-frequency chamber vibrates at 639 Hz and 852 Hz simultaneously—connection and awakening."`,
          `In-game: You receive Neural Awakening, a nootropic formula that enhances brain hemispheric connection.`,
          `IRL: This represents the AOI (Art of Implosion) experience—consciousness expansion through sensory integration.`,
          `Would you like to add this to your formula?`,
          `${gameState.inventory.includes("drink_awaken") ? "✅ Neural Awakening added to your collection!" : ""}`,
          `${gameState.inventory.includes("freq_639") ? "✅ 639 Hz frequency shard preserved!" : ""}`,
          `${gameState.inventory.includes("freq_852") ? "✅ 852 Hz frequency shard preserved!" : ""}`
        ],
        choices: [
          { text: "Add Neural Awakening to cart", destination: "deep_forest", collectItem: "drink_awaken" },
          { text: "Book AOI Experience", destination: "deep_forest", collectItem: "freq_639" },
          { text: "Collect 852 Hz frequency shard", destination: "deep_forest", collectItem: "freq_852" },
          { text: "✨ Collect all experiences", destination: "deep_forest", collectItem: ["drink_awaken", "freq_639", "freq_852"] },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-purple-900 via-violet-700 to-indigo-400",
      },
      crystal_lake: {
        title: "WATER-BAR LOUNGE — FREQUENCY FORMULAS",
        sprite: "🍹",
        text: [
          `Nova, the Water Bar mixologist, stands behind a counter of glowing bottles and vessels.`,
          `"Beyond individual frequencies, true magic lies in the combinations we create."`,
          `"Our signature drinks integrate multiple vibrational patterns for holistic wellness."`,
          `In-game: The Inner Glow Elixir combines multiple frequencies for radiance from within.`,
          `IRL: This is our bestselling beauty tonic, designed to support skin, hair and cellular hydration.`,
          `${gameState.inventory.includes("drink_glow") ? "✅ Inner Glow Elixir added to your collection!" : ""}`
        ],
        choices: [
          { text: "Add Inner Glow Elixir to cart", destination: "crystal_lake", collectItem: "drink_glow" },
          { text: "View all Water Bar formulas", destination: "cart_drinks" },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-pink-500 via-rose-400 to-rose-300",
      },
      console: {
        title: "MASTER CONSOLE — FREQUENCY UPLOAD",
        sprite: "💻",
        text: [
          `⏰ COUNTDOWN: ${Math.floor(gameState.currentTime / 60)}:${(gameState.currentTime % 60).toString().padStart(2, '0')} UNTIL Y2K`,
          `Johny Dar's hologram expands to fill the room with data visualizations of your collection.`,
          `"This is the quantum upload station for preserving frequencies beyond Y2K."`,
          `✨ FREQUENCY STATUS: ${countFrequencyShards()}/7 frequency shards collected`,
          `🍹 FORMULA STATUS: ${countDrinkItems()} Water Bar formulas selected`,
          `"Are you ready to finalize your collection and upload to our secure quantum server?"`,
          `"Or would you like to continue exploring to find more frequencies and formulas?"`,
          `"Remember, once Y2K strikes at midnight, only what you've uploaded will be preserved."`
        ],
        choices: [
          { text: "✅ Upload my collection now", destination: "ending", collectItem: "upload_complete" },
          { text: "⚡ Review my frequencies", destination: "cart_frequencies" },
          { text: "🥤 Review my formulas", destination: "cart_drinks" },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-blue-900 via-indigo-700 to-indigo-500",
      },
      cart_frequencies: {
        title: "FREQUENCY COLLECTION",
        sprite: "⚡️",
        text: [
          `✨ QUANTUM STORAGE ACTIVE | Y2K COUNTDOWN: ${Math.floor(gameState.currentTime / 60)}:${(gameState.currentTime % 60).toString().padStart(2, '0')}`,
          `Your collected frequency shards shimmer in a protective quantum field:`,
          `${formatCollectedFrequencies()}`,
          `Each shard represents a healing vibration that will be preserved beyond the digital transition.`,
          `These frequencies can be integrated into your personalized wellness protocol at the Water Bar.`,
          `🔍 ${countFrequencyShards()}/7 frequencies collected`
        ],
        choices: [
          ...(getFrequencyCartChoices()),
          { text: "✅ Complete frequency upload", destination: "ending", collectItem: "upload_complete" },
          { text: "💻 Return to Master Console", destination: "console" },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-indigo-900 via-blue-700 to-blue-400",
      },
      cart_drinks: {
        title: "WATER BAR FORMULAS",
        sprite: "🍹",
        text: [
          `🌊 FORMULA STABILIZATION | Y2K COUNTDOWN: ${Math.floor(gameState.currentTime / 60)}:${(gameState.currentTime % 60).toString().padStart(2, '0')}`,
          `Your selected Water Bar formulas glow with vibrational potency:`,
          `${formatCollectedDrinks()}`,
          `These specialized formulas are designed to integrate frequency healing into your daily wellness protocol.`,
          `Each one harmonizes with specific frequencies to enhance their restorative power.`,
          `🔍 ${countDrinkItems()} formulas selected`
        ],
        choices: [
          ...(getDrinkCartChoices()),
          { text: "✅ Complete frequency upload", destination: "ending", collectItem: "upload_complete" },
          { text: "💻 Return to Master Console", destination: "console" },
          { text: "🗺 Return to Map", destination: "map", returnToMap: false },
        ],
        bgColor: "from-purple-900 via-fuchsia-700 to-pink-400",
      },
      ending: {
        title: getEndingTitle(gameState.endingType),
        sprite: getEndingEmoji(gameState.endingType),
        text: [
          getEndingDescription(gameState.endingType, selectedCharacter.name),
          getEndingFlavor(gameState.endingType),
        ],
        choices: gameState.endingType === "failure" ? 
          [
            { text: "View Collected Frequencies", destination: "postgame_frequencies" },
            { text: "View Collected Drinks", destination: "postgame_drinks" },
            { text: "💳 View Water Bar Receipt", destination: "postgame_checkout" },
            { text: "Play Again", destination: "intro" }
          ] : 
          [
            { text: "View Preserved Frequencies", destination: "postgame_frequencies" },
            { text: "View Water Bar Formulas", destination: "postgame_drinks" },
            { text: "💳 View Water Bar Receipt", destination: "postgame_checkout" },
            { text: "Play Again", destination: "intro" }
          ],
        bgColor: getEndingBackground(gameState.endingType),
      },
      postgame_frequencies: {
        title: "PRESERVED FREQUENCIES",
        sprite: "⚡",
        text: [
          `✨ DIGITAL TRANSITION COMPLETE | Y2K ARRIVED`,
          `These frequencies have been successfully preserved beyond Y2K:`,
          `${formatCollectedFrequencies()}`,
          `Each frequency shard carries unique vibrational healing properties that can be added to your personal collection.`,
          `🔍 ${countFrequencyShards()}/7 frequencies preserved`
        ],
        choices: [
          ...getFrequencyCartChoices(),
          { text: "🍹 View Preserved Formulas", destination: "postgame_drinks" },
          { text: "🔙 Return to Results", destination: "ending" },
          { text: "🔄 Begin New Mission", destination: "intro" }
        ],
        bgColor: "from-indigo-900 via-blue-800 to-cyan-600",
      },
      postgame_drinks: {
        title: "PRESERVED WATER BAR FORMULAS",
        sprite: "🍹",
        text: [
          `🌊 FORMULA ARCHIVE ACCESSED | Y2K TRANSITION COMPLETE`,
          `These Water Bar formulas have been preserved in your digital vault:`,
          `${formatCollectedDrinks()}`,
          `Each formula works synergistically with specific frequencies to enhance your personal wellness protocol.`,
          `🔍 ${countDrinkItems()} formulas preserved`
        ],
        choices: [
          ...getDrinkCartChoices(),
          { text: "💳 View Water Bar Request", destination: "postgame_checkout" },
          { text: "⚡ View Preserved Frequencies", destination: "postgame_frequencies" },
          { text: "🔙 Return to Results", destination: "ending" },
          { text: "🔄 Begin New Mission", destination: "intro" }
        ],
        bgColor: "from-violet-900 via-purple-800 to-fuchsia-600",
      },
      postgame_checkout: {
        title: "WATER BAR REQUEST",
        sprite: "💳",
        text: [
          `✨ DIGITAL TRANSITION COMPLETE | YOUR PRESERVED FORMULAS`,
          ``,
          `🗝️ WATER BAR REQUEST:`,
          `${formatDrinkPrices()}`,
          ``,
          `💰 TOTAL: ${calculateTotalPrice()} AED`,
          ``,
          `✨ FREQUENCY BENEFITS INCLUDED:`,
          `${getFrequencyBenefits()}`,
          ``,
          `Visit The Water Bar to experience these frequency-infused`,
          `formulas and preserve your wellness beyond the digital realm.`
        ],
        choices: [
          { text: "🍹 View Formula Details", destination: "postgame_drinks" },
          { text: "⚡ View Frequency Benefits", destination: "postgame_frequencies" },
          { text: "🔙 Return to Results", destination: "ending" },
          { text: "🔄 Begin New Mission", destination: "intro" }
        ],
        bgColor: "from-emerald-700 via-teal-600 to-cyan-500",
      },
    }

    // Type assertion to ensure the screen exists
    if (!(screen in screens)) {
      console.error(`Screen "${screen}" not found, falling back to intro`)
      return screens.intro
    }
    return screens[screen as keyof typeof screens]
  }

  // Get ending title based on type
  function getEndingTitle(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "🌟 FREQUENCY MASTER: ALL 7 SAVED 🌟"
      case "heroic":
        return "🎉 FREQUENCY GUARDIAN: MISSION COMPLETE 🎉"
      case "clutch":
        return "⚡ QUANTUM SAVIOR: JUST IN TIME ⚡"
      case "miracle":
        return "🔥 FREQUENCY MIRACLE: FINAL SECOND UPLOAD 🔥"
      case "failure":
        return "✨ PARTIAL FREQUENCY PRESERVATION ✨"
    }
  }

  // Get ending emoji based on type
  function getEndingEmoji(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "🌌"
      case "heroic":
        return "🗿"
      case "clutch":
        return "🔍"
      case "miracle":
        return "💡"
      case "failure":
        return "💻"
    }
  }

  // Get ending description based on type
  function getEndingDescription(type: GameState["endingType"], name: string): string {
    switch (type) {
      case "legendary":
        return `Agent ${name} has preserved all 7 healing frequencies! The complete frequency spectrum has been secured for humanity's future wellness!`
      case "heroic":
        return `Agent ${name} uploaded the frequency collection with confidence and precision! The Water Bar's healing legacy is secure!`
      case "clutch":
        return `In a race against the digital clock, Agent ${name} saved the frequencies with just seconds to spare!`
      case "miracle":
        return `INCREDIBLE! With just one second remaining, Agent ${name} completed the frequency upload at exactly 11:59:59 PM!`
      case "failure":
        return `Y2K has arrived! Agent ${name} managed to preserve ${countFrequencyShards()} of 7 frequency shards and ${countDrinkItems()} Water Bar formulas.`
    }
  }

  // Get ending flavor text based on type
  function getEndingFlavor(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "Your strategic frequency preservation mission is a complete success! As humanity awakens to a new millennium, your perfectly preserved frequency collection ensures the Water Bar's continued healing mission. The fusion of ancient healing vibrations with future technology creates a wellness protocol that thrives for decades, transforming humanity's relationship with hydration and consciousness. The Morning Party celebrates your legendary achievement!"
      case "heroic":
        return "Your comprehensive frequency preservation ensures the Water Bar's mission continues into the new millennium! The complete frequency-formula combinations you've saved become the foundation for a revolutionary approach to wellness that flourishes in the digital age. The Morning Party honors your heroic preservation of this ancient-future science!"
      case "clutch":
        return "The quantum servers pulse with energy as your frequency upload completes with seconds to spare! Despite the close call, your preserved frequencies and formulas become the core of the Water Bar's evolving wellness protocol. The Morning Party celebrates your clutch performance that secured these healing vibrations for future generations!"
      case "miracle":
        return "In the final second before Y2K, you complete the frequency upload in a burst of quantum energy! Against impossible odds, your preserved frequencies create ripples through the digital transition. The Morning Party is astounded by your miraculous save, which ensures these healing vibrations continue to transform lives in the new millennium!"
      case "failure":
        return `The frequencies and formulas you've saved will continue to resonate! You preserved ${countFrequencyShards()} of 7 critical frequencies and ${countDrinkItems()} Water Bar formulas. Though incomplete, this collection remains invaluable to humanity's wellness future. You can add these items to your personal collection now, or return to rescue more frequencies before checkout!`
    }
  }

  // Get ending background color based on type
  function getEndingBackground(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "from-violet-900 via-purple-600 to-indigo-400"
      case "heroic":
        return "from-blue-900 via-cyan-600 to-teal-400"
      case "clutch":
        return "from-indigo-900 via-blue-600 to-cyan-400"
      case "miracle":
        return "from-fuchsia-900 via-purple-700 to-violet-500"
      case "failure":
        return "from-slate-900 via-gray-800 to-zinc-700"
    }
  }

  // Count collected frequency shards
  function countFrequencyShards(): number {
    return gameState.inventory.filter(item => item.startsWith('freq_')).length
  }

  // Count collected drink items
  function countDrinkItems(): number {
    return gameState.inventory.filter(item => item.startsWith('drink_')).length
  }
  
  // Format collected frequencies for display
  function formatCollectedFrequencies(): string {
    const freqItems = gameState.inventory.filter(item => item.startsWith('freq_'))
    if (freqItems.length === 0) return "You haven't collected any frequencies yet."
    
    const items = {
      freq_174: "💧 174 Hz - The Foundation Frequency (Grounding)",
      freq_285: "❄️ 285 Hz - The Wholeness Frequency (Transformation)",
      freq_396: "🔊 396 Hz - The Liberation Frequency (Releasing Fear)",
      freq_528: "✨ 528 Hz - The Miracle Frequency (DNA Repair)", 
      freq_639: "🌿 639 Hz - The Connection Frequency (Harmonizing)",
      freq_852: "🌊 852 Hz - The Awakening Frequency (Spiritual Return)",
      freq_963: "☀️ 963 Hz - The Divine Frequency (Pure Awareness)"
    }
    
    return freqItems.map(item => items[item as keyof typeof items] || item).join('\n')
  }
  
  // Format collected drinks for display
  function formatCollectedDrinks(): string {
    const drinkItems = gameState.inventory.filter(item => item.startsWith('drink_'))
    if (drinkItems.length === 0) return "You haven't added any formulas to cart yet."
    
    const items = {
      drink_prana: "💧 Prana Spring Water (Immunity & Balance)",
      drink_gaia: "🌱 Gaia Copper Refill Bottle (Vitality)",
      drink_yala: "🧪 YALA Kimbucha × Chaga (Adaptogenic)",
      drink_cryo: "❄️ Cryo Elixir (Recovery & Cooling)", 
      drink_glow: "✨ Inner Glow Formula (Radiance & Clarity)",
      drink_awaken: "🧠 Neural Awakening (Consciousness Expansion)"
    }
    
    return drinkItems.map(item => items[item as keyof typeof items] || item).join('\n')
  }
  
  // Get pricing information for drinks
  function getDrinkPrice(drinkItem: string): number {
    const prices = {
      drink_prana: 20, // AED
      drink_gaia: 120, // AED
      drink_yala: 45, // AED
      drink_cryo: 30, // AED
      drink_glow: 75, // AED
      drink_awaken: 65, // AED
    }
    return prices[drinkItem as keyof typeof prices] || 0
  }
  
  // Calculate total price of drinks in cart
  function calculateTotalPrice(): number {
    const drinkItems = gameState.inventory.filter(item => item.startsWith('drink_'))
    return drinkItems.reduce((total, item) => total + getDrinkPrice(item), 0)
  }
  
  // Format drink prices for display in checkout
  function formatDrinkPrices(): string {
    const drinkItems = gameState.inventory.filter(item => item.startsWith('drink_'))
    if (drinkItems.length === 0) return "No formulas selected."
    
    const drinkNames = {
      drink_prana: "Prana Spring Water",
      drink_gaia: "Copper Refill Bottle",
      drink_yala: "YALA Kimbucha × Chaga",
      drink_cryo: "Aqua Aura", 
      drink_glow: "The Butterfly Effect",
      drink_awaken: "The Gaia Experience"
    }
    
    return drinkItems.map(item => 
      `${drinkNames[item as keyof typeof drinkNames] || item} - ${getDrinkPrice(item)} AED`
    ).join('\n')
  }
  
  // Get frequency shard benefits for display
  function getFrequencyBenefits(): string {
    const freqItems = gameState.inventory.filter(item => item.startsWith('freq_'))
    if (freqItems.length === 0) return "No frequencies collected."
    
    const benefits = {
      freq_174: "✓ Foundation: Grounding and physical healing",
      freq_285: "✓ Transformation: Cellular regeneration and renewal",
      freq_396: "✓ Liberation: Release of fear and trauma patterns",
      freq_528: "✓ Miracle: DNA repair and harmonic resonance", 
      freq_639: "✓ Connection: Heart opening and relationship harmony",
      freq_852: "✓ Awakening: Intuition enhancement and clarity",
      freq_963: "✓ Divine: Connection to universal consciousness"
    }
    
    return freqItems.map(item => benefits[item as keyof typeof benefits] || item).join('\n')
  }
  
  // Get cart choices for frequencies
  function getFrequencyCartChoices(): { text: string, destination: string, collectItem?: string }[] {
    const freqItems = gameState.inventory.filter(item => item.startsWith('freq_'))
    if (freqItems.length === 0) return []
    
    const choices = [
      { text: "Add all frequencies to cart", destination: "cart_frequencies", collectItem: "cart_all_freq" }
    ]
    
    // Add individual frequency choices if needed in the future
    
    return choices
  }
  
  // Get cart choices for drinks
  function getDrinkCartChoices(): { text: string, destination: string, collectItem?: string }[] {
    const drinkItems = gameState.inventory.filter(item => item.startsWith('drink_'))
    if (drinkItems.length === 0) return []
    
    // For now just add all to cart, could be expanded to individual items with display names
    // if we want to show individual items in the future
    const choices = [
      { text: "Add all drinks to cart", destination: "cart_drinks", collectItem: "cart_all_drinks" }
    ]
    
    return choices
  }

  // Format inventory for display
  const formatInventory = () => {
    const items = {
      freq_174: "💧 174Hz",
      freq_285: "❄️ 285Hz",
      freq_396: "🔊 396Hz",
      freq_528: "✨ 528Hz",
      freq_639: "🌿 639Hz",
      freq_852: "🌊 852Hz",
      drink_prana: "🥤 Prana Spring",
      drink_gaia: "☕ Gaia Cacao",
      drink_yala: "🍹 YALA Elixir",
      exp_heat: "🔥 AOI Heat",
      exp_ice: "❄️ AOI Ice",
      formula: "⚡ Frequency Formula"
    }

    return gameState.inventory.map((item) => items[item as keyof typeof items] || item).join(" | ")
  }

  // Format current time as 11:XX PM
  const formatTime = () => {
    const totalMinutes = gameState.currentTime
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours === 23) {
      return `11:${minutes.toString().padStart(2, "0")} PM`
    } else if (hours === 24 || hours === 0) {
      return "12:00 AM - MIDNIGHT!"
    } else {
      return `${hours}:${minutes.toString().padStart(2, "0")} AM`
    }
  }

  // Restart game function preserved for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const restartGame = () => {
    setGameState({
      currentScreen: "intro",
      inventory: [],
      currentTime: 23 * 60 + 30,
      textIndex: 0,
      showChoices: false,
      gameComplete: false,
      endingType: "failure",
    })
    soundManager.playBackgroundMusic()
  }

  // If game hasn't started, show title screen
  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-blue-950 to-black p-4">
        <div className="text-center max-w-2xl bg-black/40 backdrop-blur-md rounded-xl p-8 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
          <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
            THE JOHNY DAR ADVENTURE
          </h1>
          <h2 className="text-3xl font-light mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            FREQUENCY RESCUE
          </h2>

          <div className="relative w-64 h-64 mb-8 mx-auto">
            <Image
              src={selectedCharacter.sprite || "/placeholder.svg"}
              alt={selectedCharacter.name}
              width={256}
              height={256}
              className="rounded-full object-cover border-2 border-blue-400/50 shadow-lg shadow-blue-500/30 p-1 bg-gradient-to-b from-indigo-900/30 to-black/30"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-md p-6 mb-6 rounded-xl border border-blue-400/20">
            <h3 className="text-2xl font-light text-blue-300 mb-2">{selectedCharacter.name}</h3>
            <p className="text-slate-300 text-lg mb-2 italic">&quot;{selectedCharacter.catchphrase}&quot;</p>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-6 mb-8 rounded-xl border border-indigo-500/20">
            <p className="text-white/90 mb-4 text-center text-lg">
              On the edge of Y2K, healing frequencies are at risk of digital erasure.
            </p>
            <p className="text-blue-300 text-center">
              As a Frequency Hero, you must collect energy shards and pair them with embodied experiences to create a formula that will preserve The Morning Party legacy.
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-light rounded-full text-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/30"
          >
            BEGIN MISSION
          </button>

          <p className="text-xs text-blue-400/80 mt-6"> 2025 THE WATER BAR | AOI FREQUENCIES</p>
        </div>
      </div>
    )
  }

  const currentContent = getScreenContent(gameState.currentScreen)

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-b ${currentContent.bgColor} p-4`}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-3xl mb-3">
        <h1 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">FREQUENCY RESCUE</h1>
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md p-3 mb-4 flex justify-between items-center rounded-xl border border-blue-500/30">
        <div className="text-cyan-400 font-light">TIME: {formatTime()}</div>
        <div className="text-cyan-400 font-light">INVENTORY: {formatInventory() || "None"}</div>
      </div>

      {/* Main Game Window */}
      <div className="w-full max-w-3xl bg-black/50 backdrop-blur-md border border-indigo-500/40 rounded-xl p-6 mb-4 min-h-[400px] flex flex-col shadow-lg shadow-blue-500/10">
        {/* Location Title */}
        <div className="bg-gradient-to-r from-indigo-900/70 to-blue-900/70 p-3 mb-5 text-center rounded-lg border-b border-blue-400/30">
          <h2 className="text-xl font-light tracking-wider text-white">{currentContent.title}</h2>
        </div>

        {/* Character Sprite */}
        <div className="text-center mb-6">
          <span className="text-8xl filter drop-shadow-lg">{currentContent.sprite}</span>
        </div>

        {/* Text Box */}
        <div className="bg-black/40 backdrop-blur-sm p-5 mb-5 flex-grow rounded-lg border border-blue-500/20">
          <p className="text-blue-100 font-light text-lg leading-relaxed">
            {textVisible && currentContent.text[gameState.textIndex]}
            {blinkCursor && <span className="animate-pulse ml-1 text-cyan-400">▮</span>}
          </p>
        </div>

        {/* Choices or Continue */}
        <div className="flex flex-col space-y-2">
          {gameState.showChoices ? (
            currentContent.choices.map((choice: {text: string, destination: string, collectItem?: string | string[]}, index: number) => (
              <button
                key={index}
                onClick={() => handleChoice(
                  choice.destination as GameScreen, 
                  'collectItem' in choice ? choice.collectItem : undefined
                )}
                className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white font-light py-3 px-5 rounded-full text-left transition-all hover:shadow-md hover:shadow-blue-400/20 border border-blue-400/20"
              >
                {choice.text}
              </button>
            ))
          ) : (
            <button
              onClick={advanceText}
              className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-700/80 hover:to-indigo-700/80 text-white font-light py-3 px-6 rounded-full text-center transition-all hover:shadow-md hover:shadow-blue-400/20 border border-blue-400/20"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      {/* Character Info */}
      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md p-3 rounded-xl border border-blue-500/30 flex items-center">
        <div className="mr-4 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 p-2 rounded-full">
          <span className="text-3xl">⚡</span>
        </div>
        <div>
          <p className="text-blue-300 font-light">
            {selectedCharacter.name}: <span className="italic text-blue-200/90">&quot;{selectedCharacter.catchphrase}&quot;</span>
          </p>
        </div>
      </div>

      <p className="text-xs text-blue-300/70 mt-4"> 2025 THE WATER BAR | THE JOHNY DAR ADVENTURE</p>
    </div>
  )
}
