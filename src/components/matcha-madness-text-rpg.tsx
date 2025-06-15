"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { Character } from "@/lib/character-data"
import FrequencyVisualizer from "./FrequencyVisualizer"

// Enhanced sound manager with frequency-specific sounds
const soundManager = {
  playSound: (sound: string) => {
    console.log(`Would play sound: ${sound}`)
    
    // Play actual sound if we had the implementation
    // Different sound effects for different types of events
    switch(sound) {
      case "frequencyCollected":
        console.log("Playing harmonic chime for frequency collection")
        break
      case "frequencyBlocked":
        console.log("Playing dissonant tone for blocked frequency")
        break
      case "frequencyComplete":
        console.log("Playing harmonic progression for completed frequency set")
        break
    }
  },
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
  | "console"
  | "frequencies"
  | "ending"

interface GameState {
  currentScreen: GameScreen
  inventory: string[]
  currentTime: number
  textIndex: number
  showChoices: boolean
  gameComplete: boolean
  endingType: "legendary" | "heroic" | "clutch" | "miracle" | "failure"
  frequencyMessage?: string // Message to show for frequency collection guidance
  showFrequencyMessage: boolean // Whether to show the frequency message
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
    frequencyMessage: undefined,
    showFrequencyMessage: false
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMuted, setIsMuted] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [textVisible] = useState(true)

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

  // Check if frequencies are being collected in the correct order
  const checkFrequencySequence = (frequency: string, inventory: string[]): { valid: boolean; message?: string } => {
    // Define the correct collection order
    const validSequences = {
      // Center frequency can always be collected
      freq_174: { valid: true },
      
      // 6-family frequencies must be collected after center frequency
      freq_285: { 
        valid: inventory.includes("freq_174"),
        message: "The 174 Hz foundation frequency must be collected first. Hint: look for the frequency whose digits add up to 3 (1+7+4=12, 1+2=3). Seek out the Hydration Well."
      },
      freq_528: { 
        valid: inventory.includes("freq_174"),
        message: "The 174 Hz foundation frequency must be collected first. Hint: look for the frequency whose digits add up to 3 (1+7+4=12, 1+2=3). Seek out the Hydration Well."
      },
      freq_852: { 
        valid: inventory.includes("freq_174"),
        message: "The 174 Hz foundation frequency must be collected first. Hint: look for the frequency whose digits add up to 3 (1+7+4=12, 1+2=3). Seek out the Hydration Well."
      },
      
      // 9-family frequencies require at least one 6-family frequency
      freq_396: { 
        valid: inventory.some(item => ["freq_285", "freq_528", "freq_852"].includes(item)),
        message: "This higher consciousness frequency requires at least one regenerative frequency (285, 528, or 852 Hz)."
      },
      freq_639: { 
        valid: inventory.some(item => ["freq_285", "freq_528", "freq_852"].includes(item)),
        message: "This higher consciousness frequency requires at least one regenerative frequency (285, 528, or 852 Hz)."
      },
      freq_963: { 
        valid: inventory.some(item => ["freq_285", "freq_528", "freq_852"].includes(item)),
        message: "This higher consciousness frequency requires at least one regenerative frequency (285, 528, or 852 Hz)."
      },
    }
    
    if (frequency in validSequences) {
      return validSequences[frequency as keyof typeof validSequences]
    }
    
    return { valid: true }
  }
  
  // Handle choice selection
  const handleChoice = (destination: GameScreen, collectItem?: string | string[], returnToMap?: boolean) => {
    soundManager.playSound("areaTransition")

    // Add items to inventory if specified
    const newInventory = [...gameState.inventory]
    let itemsCollected = false
    let frequencyMessage: string | undefined = undefined
    
    // Handle single item or multiple items
    if (collectItem) {
      if (typeof collectItem === 'string') {
        // Single item
        if (!newInventory.includes(collectItem)) {
          // Special handling for frequencies
          if (collectItem.startsWith('freq_')) {
            const sequenceCheck = checkFrequencySequence(collectItem, gameState.inventory)
            
            if (sequenceCheck.valid) {
              newInventory.push(collectItem)
              soundManager.playSound("frequencyCollected")
              itemsCollected = true
            } else {
              // Invalid sequence, show message but don't add to inventory
              frequencyMessage = sequenceCheck.message
              soundManager.playSound("frequencyBlocked")
            }
          } else {
            // Regular item collection
            newInventory.push(collectItem)
            soundManager.playSound("questComplete")
            itemsCollected = true
          }
        }
      } else {
        // Multiple items
        let addedItems = false
        let hasFrequency = false
        
        collectItem.forEach(item => {
          if (!newInventory.includes(item)) {
            // Special handling for frequencies
            if (item.startsWith('freq_')) {
              const sequenceCheck = checkFrequencySequence(item, newInventory)
              
              if (sequenceCheck.valid) {
                newInventory.push(item)
                addedItems = true
                hasFrequency = true
              } else {
                // Store the last error message
                frequencyMessage = sequenceCheck.message
              }
            } else {
              // Regular item
              newInventory.push(item)
              addedItems = true
            }
          }
        })
        
        if (addedItems) {
          soundManager.playSound(hasFrequency ? "frequencyCollected" : "questComplete")
          itemsCollected = true
        } else if (frequencyMessage) {
          soundManager.playSound("frequencyBlocked")
        }
      }
    }

    // Check if all frequencies in a family are collected for special feedback
    const checkFrequencyCompletions = (inventory: string[]) => {
      const has6Family = ["freq_285", "freq_528", "freq_852"].every(f => inventory.includes(f))
      const has9Family = ["freq_396", "freq_639", "freq_963"].every(f => inventory.includes(f))
      
      // Play special sound effects for completing frequency families
      if (has6Family && !gameState.inventory.includes("freq_285") || 
          !gameState.inventory.includes("freq_528") || 
          !gameState.inventory.includes("freq_852")) {
        // First time completing 6 family
        soundManager.playSound("frequencyComplete")
        return "The regenerative triangle is complete. Higher consciousness frequencies are now available."
      } else if (has9Family && has6Family && 
                (!gameState.inventory.includes("freq_396") || 
                 !gameState.inventory.includes("freq_639") || 
                 !gameState.inventory.includes("freq_963"))) {
        // First time completing all frequencies
        soundManager.playSound("frequencyComplete")
        return "The Star of David frequency pattern is complete. You have unlocked the full potential."
      }
      
      return undefined
    }

    // Determine if we should return to map after collecting items
    // If returnToMap is explicitly set to false, we won't return to map
    // If itemsCollected is true and returnToMap isn't explicitly set to false, return to map
    const shouldReturnToMap = returnToMap !== false && itemsCollected && destination !== "map" && 
      destination !== "ending" && destination !== "console" && 
      !destination.includes("cart") && !destination.includes("postgame");
      
    const actualDestination = shouldReturnToMap ? "map" : destination;
    
    // Check for special frequency completions
    const completionMessage = itemsCollected ? checkFrequencyCompletions(newInventory) : undefined;
    const messageToShow = frequencyMessage || completionMessage;

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
        showFrequencyMessage: false,
      }))
    } else {
      // Regular navigation
      setGameState((prev) => ({
        ...prev,
        currentScreen: actualDestination,
        textIndex: 0,
        showChoices: false,
        inventory: newInventory,
        frequencyMessage: messageToShow,
        showFrequencyMessage: Boolean(messageToShow)
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
        sprite: "🌄",
        text: [
          `⏰ TIME REMAINING: ${Math.floor(gameState.currentTime / 60)}:${(gameState.currentTime % 60).toString().padStart(2, '0')}`,
          `✨ FREQUENCIES COLLECTED: ${countFrequencyShards()}/7`,
          `Select a destination to continue your frequency rescue mission.`,
          `Each zone contains unique vibrational patterns that can be collected.`
        ],
        choices: [
          { text: `💧 Hydration Well (174 Hz)${gameState.inventory.includes('freq_174') ? ' ✅' : ''}`, destination: "tea_gardens" },
          { text: `🔊 Sound Altar (396 Hz)${gameState.inventory.includes('freq_396') ? ' ✅' : ''}`, destination: "mountain_peak" },
          { text: `✨ Light Vault (528 Hz)${gameState.inventory.includes('freq_528') ? ' ✅' : ''}`, destination: "tropical_cove" },
          { text: `❄️ Cryo Bay (285 Hz)${gameState.inventory.includes('freq_285') ? ' ✅' : ''}`, destination: "sacred_temple" },
          { text: `🐋 Resonance Chamber (963 Hz)${gameState.inventory.includes('freq_963') ? ' ✅' : ''}`, destination: "ice_caves" },
          { text: `🌿 AOI Dome (639/852 Hz)${gameState.inventory.includes('freq_639') && gameState.inventory.includes('freq_852') ? ' ✅' : (gameState.inventory.includes('freq_639') || gameState.inventory.includes('freq_852') ? ' 🔶' : '')}`, destination: "deep_forest" },
          { text: "🍹 Water-Bar Lounge (Formulas)", destination: "crystal_lake" },
          { text: "💻 Master Console (Upload)", destination: "console" },
          { text: "🔁 Review Frequencies", destination: "cart_frequencies" },
          { text: "🥤 Review Formulas", destination: "cart_drinks" }
        ],
        bgColor: "from-fuchsia-900 via-purple-800 to-indigo-700",
      },

      /* --- SHARD STATIONS (Immersive narrative dialogues) ----------------------------- */
      tea_gardens: {
        title: "THE HYDRATION WELL — 174 Hz",
        sprite: "💧",
        text: [
          `Dr. Aqua kneels by the luminous waters of the Hydration Well, her fingertips sending waves across its liquid light.`,
          `"This isn't just water," she says. "It's encoded memory—Earth's original resonance. **174 Hz**: the stabilising frequency that grounds your field and prepares you to receive the higher codes."`,
          `"Here, take this vial of *Prana Spring* infused with elemental intelligence. Drink, and feel your system recalibrate—calm, clear, rooted in essence."`,
          `Your journey starts with water—because all vibration flows from stillness.`,
          `${gameState.inventory.includes("drink_prana") ? "✅ The Prana Spring vial hums gently in your pack." : ""}`,
          `${gameState.inventory.includes("freq_174")  ? "✅ 174 Hz shard pulses warmly in your collection."       : ""}`
        ],
        choices: [
          { text: "Drink the Prana Spring",                       destination: "tea_gardens", collectItem: "drink_prana" },
          { text: "Absorb the 174 Hz frequency shard",            destination: "tea_gardens", collectItem: "freq_174"    },
          { text: "✨ Complete the ritual (water + frequency)",    destination: "tea_gardens", collectItem: ["freq_174","drink_prana"] },
          { text: "🗺 Return to Frequency Map",                    destination: "map" }
        ],
        bgColor: "from-blue-800 via-cyan-600 to-teal-400",
      },
      tropical_cove: {
        title: "LIGHT VAULT — 528 Hz: THE HARMONIZER",
        sprite: "✨",
        text: [
          `Sol stands amidst vibrant prisms, beams of emerald and gold swirling around her. As you approach, the air itself seems to shimmer with possibility.`,
          `"**528 Hz**—the miracle tone," she whispers, her voice blending with the crystalline harmonics filling the chamber. "It realigns the very structure of matter—brings coherence to chaos, healing to disruption."`,
          `With elegant precision, she draws two luminous vessels from the light stream. One glows with soft amber pulses, the other with electric blue currents.`,
          `"*The Butterfly Effect* to calm your nervous system into receptivity. *Aqua Aura* to energize your field for integration. Both infused with this restorative frequency. Which resonates with your current state?"`,
          `You sense that the choice isn't about the drink—it's about which aspect of harmony you need to embody right now.`,
          `${gameState.inventory.includes("drink_butterfly") ? "✅ Butterfly Effect radiates gentle waves of amber calm from your collection." : ""}`,
          `${gameState.inventory.includes("drink_aqua") ? "✅ Aqua Aura pulses with electric vitality in your possession." : ""}`,
          `${gameState.inventory.includes("freq_528") ? "✅ 528 Hz crystal shard hums with the miracle tone, safely integrated into your field." : ""}`
        ],
        choices: [
          { text: "Choose Butterfly Effect", destination: "tropical_cove", collectItem: "drink_butterfly" },
          { text: "Choose Aqua Aura", destination: "tropical_cove", collectItem: "drink_aqua" },
          { text: "Collect the 528 Hz shard", destination: "tropical_cove", collectItem: "freq_528" },
          { text: "✨ Take both shard & Butterfly Effect", destination: "tropical_cove", collectItem: ["freq_528","drink_butterfly"] },
          { text: "✨ Take both shard & Aqua Aura", destination: "tropical_cove", collectItem: ["freq_528","drink_aqua"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-yellow-400 via-lime-300 to-green-300",
      },
      mountain_peak: {
        title: "SOUND ALTAR — 396 Hz: THE UNBLOCKER",
        sprite: "🔊",
        text: [
          `Echo raises a hand and strikes the copper bowl. The tone shimmers—subtle yet undeniable—reverberating through your ribcage, your memories, your unseen layers.`,
          `"**396 Hz** dissolves fear," Echo murmurs, eyes closed. "It releases guilt, shame, and ancestral echoes. It opens locked doors inside your body—without forcing."`,
          `She offers you a *Copper Refill Bottle*, its form sleek and warm to the touch.`,
          `"Copper channels frequency. This bottle carries the resonance—it amplifies the clearing and strengthens your field. Hydrate with it. Let the sound flow through you."`,
          `Feel the resonance—your past doesn't define your frequency.`,
          `${gameState.inventory.includes("drink_copper") ? "✅ Copper Refill Bottle resonates softly in your pack." : ""}`,
          `${gameState.inventory.includes("freq_396")   ? "✅ 396 Hz shard vibrates with quiet power."              : ""}`
        ],
        choices: [
          { text: "Take the Copper Refill Bottle",                destination: "mountain_peak", collectItem: "drink_copper" },
          { text: "Absorb the 396 Hz frequency shard",            destination: "mountain_peak", collectItem: "freq_396"     },
          { text: "✨ Complete the ritual (sound + frequency)",    destination: "mountain_peak", collectItem: ["freq_396","drink_copper"] },
          { text: "🗺 Return to Frequency Map",                    destination: "map" }
        ],
        bgColor: "from-rose-700 via-orange-600 to-amber-400",
      },
      ice_caves: {
        title: "RESONANCE CHAMBER — 963 Hz: THE PINNACLE",
        sprite: "🐋",
        text: [
          `Astra's voice reverberates through the crystalline chamber, washing over you in waves of pure sound.`,
          `"963 Hz is the divine frequency—the pinnacle of vibrational awareness. It connects directly to the universal field."`,
          `"Here, I've prepared the Transcendence elixir. Its molecular structure holds the memory of pure consciousness. Take it mindfully."`,
          `${gameState.inventory.includes("drink_transcend") ? "✅ Transcendence elixir glows with inner light in your collection." : ""}`,
          `${gameState.inventory.includes("exp_sound_bath") ? "✅ Sound Bath session reserved; prepare for total harmonic immersion." : ""}`,
          `${gameState.inventory.includes("freq_963") ? "✅ 963 Hz shard radiates with golden luminescence, the apex frequency secured." : ""}`
        ],
        choices: [
          { text: "Receive Transcendence elixir", destination: "ice_caves", collectItem: "drink_transcend" },
          { text: "Book Sound Bath experience", destination: "ice_caves", collectItem: "exp_sound_bath" },
          { text: "Secure 963 Hz frequency shard", destination: "ice_caves", collectItem: "freq_963" },
          { text: "✨ Complete resonance trinity (all three)", destination: "ice_caves", collectItem: ["freq_963", "drink_transcend", "exp_sound_bath"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-yellow-300 via-yellow-200 to-amber-500",
      },
      sacred_temple: {
        title: "CRYO BAY — 285 Hz: THE REGENERATOR",
        sprite: "❄️",
        text: [
          `Kelvin adjusts the cryo-chamber, icy mist drifting softly around you.`,
          `"285 Hz heals at the cellular level, regenerating and restoring tissues."`,
          `"Combine the Cryo Elixir—charged at precisely -285°—with a guided cold plunge. Together, they fortify your resilience."`,
          `${gameState.inventory.includes("drink_cryo") ? "✅ Cryo Elixir chills comfortingly in your inventory." : ""}`,
          `${gameState.inventory.includes("exp_ice_plunge") ? "✅ Cold Plunge booked; you'll breathe deep in icy clarity." : ""}`,
          `${gameState.inventory.includes("freq_285") ? "✅ 285 Hz frequency shard radiates restorative chill." : ""}`
        ],
        choices: [
          { text: "Take the Cryo Elixir", destination: "sacred_temple", collectItem: "drink_cryo" },
          { text: "Book Cold Plunge (breath-guided)", destination: "sacred_temple", collectItem: "exp_ice_plunge" },
          { text: "Secure 285 Hz frequency shard", destination: "sacred_temple", collectItem: "freq_285" },
          { text: "✨ Receive shard, elixir, & book plunge", destination: "sacred_temple", collectItem: ["freq_285","drink_cryo","exp_ice_plunge"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-blue-900 via-blue-700 to-cyan-300",
      },
      deep_forest: {
        title: "AOI DOME — 639 & 852 Hz: THE CONNECTOR",
        sprite: "🌿",
        text: [
          `Aria gestures within the glowing AOI Dome, the air pulsing with energy.`,
          `"Here, 639 Hz (connection) and 852 Hz (awakening) intertwine, elevating consciousness."`,
          `"Choose your path: book the immersive AIR Dome, revitalizing HEAT Sauna, soothing EARTH Solarium, or the invigorating ICE Plunge. Complement your journey with Butterfly Effect or Aqua Aura."`,
          `${gameState.inventory.includes("freq_639") ? "✅ 639 Hz shard harmonizes warmly." : ""}`,
          `${gameState.inventory.includes("freq_852") ? "✅ 852 Hz shard sings with clarity." : ""}`
        ],
        choices: [
          { text: "639 Hz shard", destination: "deep_forest", collectItem: "freq_639" },
          { text: "852 Hz shard", destination: "deep_forest", collectItem: "freq_852" },
          { text: "Butterfly Effect drink", destination: "deep_forest", collectItem: "drink_butterfly" },
          { text: "Aqua Aura drink", destination: "deep_forest", collectItem: "drink_aqua" },
          { text: "Book AIR Dome experience", destination: "deep_forest", collectItem: "exp_air_dome" },
          { text: "Book HEAT Sauna experience", destination: "deep_forest", collectItem: "exp_heat_sauna" },
          { text: "Book EARTH Solarium experience", destination: "deep_forest", collectItem: "exp_earth_bed" },
          { text: "Book ICE Plunge experience", destination: "deep_forest", collectItem: "exp_ice_plunge" },
          { text: "✨ All frequencies, drinks, and experiences", destination: "deep_forest", collectItem: ["freq_639","freq_852","drink_butterfly","drink_aqua","exp_air_dome","exp_heat_sauna","exp_earth_bed","exp_ice_plunge"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-purple-900 via-violet-700 to-indigo-400",
      },
      crystal_lake: {
        title: "WATER-BAR LOUNGE — FREQUENCY FORMULAS",
        sprite: "🍹",
        text: [
          `Nova gestures elegantly across the luminous counter, where vessels pulse with vibrant elixirs.`,
          `"Welcome to the Water-Bar, where frequencies are alchemized into transformative experiences."`,
          `"Our signature Inner Glow Elixir harmonizes multiple frequencies for radiance that emerges from deep within."`,
          `"All experiences are 350 AED each, with 10% discount when booked in advance of your visit."`,
          `"Would you like to review your frequency collection and experiences selected so far?"`,
          `${gameState.inventory.includes("drink_glow") ? "✅ Inner Glow Elixir shimmers enticingly in your collection." : ""}`
        ],
        choices: [
          { text: "Add Inner Glow Elixir to collection", destination: "crystal_lake", collectItem: "drink_glow" },
          { text: "🔍 Review Water Bar formulas", destination: "cart_drinks" },
          { text: "🔍 Review Booked Experiences", destination: "cart_experiences" },
          { text: "🗺 Return to Frequency Map", destination: "map" },
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
          `"Are you ready to finalize your frequency collection and upload to our secure quantum server?"`,
          `"Or would you like to continue exploring to find more healing frequencies?"`,
          `"Remember, once Y2K strikes at midnight, only the frequencies you've uploaded will be preserved."`
        ],
        choices: [
          { text: "✅ Upload my frequencies now", destination: "ending", collectItem: "upload_complete" },
          { text: "⚡ Review my frequencies", destination: "frequencies" },
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
      // Removed cart_drinks and cart_experiences screens as we're focusing solely on frequencies
      ending: {
        title: getEndingTitle(gameState.endingType),
        sprite: getEndingEmoji(gameState.endingType),
        text: [
          getEndingDescription(gameState.endingType, selectedCharacter.name),
          getEndingFlavor(gameState.endingType),
        ],
        choices: gameState.endingType === "failure" ? 
          [
            { text: "View Collected Frequencies", destination: "frequencies" },
            { text: "Play Again", destination: "intro" }
          ] : 
          [
            { text: "View Preserved Frequencies", destination: "frequencies" },
            { text: "Play Again", destination: "intro" }
          ],
        bgColor: getEndingBackground(gameState.endingType),
      },
      frequencies: {
        title: "PRESERVED FREQUENCIES",
        sprite: "⚡",
        text: [
          `✨ DIGITAL TRANSITION COMPLETE | Y2K ARRIVED`,
          `These frequencies have been successfully preserved beyond Y2K:`,
          `${formatCollectedFrequencies()}`,
          `Each frequency shard carries unique vibrational healing properties that have been saved for future generations.`,
          `🔍 ${countFrequencyShards()}/7 frequencies preserved`
        ],
        choices: [
          ...getFrequencyCartChoices(),
          { text: "🔙 Return to Results", destination: "ending" },
          { text: "🔄 Begin New Mission", destination: "intro" }
        ],
        bgColor: "from-indigo-900 via-blue-800 to-cyan-600",
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
        return `Y2K has arrived! Agent ${name} managed to preserve ${countFrequencyShards()} of 7 frequency shards before time ran out.`
    }
  }

  // Get ending flavor text based on type
  function getEndingFlavor(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "Your strategic frequency preservation mission is a complete success! As humanity awakens to a new millennium, your perfectly preserved frequency collection ensures the continuation of these healing vibrations. The fusion of ancient healing frequencies with future technology creates a wellness protocol that thrives for decades, transforming humanity's relationship with consciousness. The Morning Party celebrates your legendary achievement!"
      case "heroic":
        return "Your comprehensive frequency preservation ensures these sacred vibrations continue into the new millennium! The complete frequency collection you've saved becomes the foundation for a revolutionary approach to wellness that flourishes in the digital age. The Morning Party honors your heroic preservation of this ancient-future science!"
      case "clutch":
        return "The quantum servers pulse with energy as your frequency upload completes with seconds to spare! Despite the close call, your preserved frequencies become the core of a new wellness paradigm. The Morning Party celebrates your clutch performance that secured these healing vibrations for future generations!"
      case "miracle":
        return "In the final second before Y2K, you complete the frequency upload in a burst of quantum energy! Against impossible odds, your preserved frequencies create ripples through the digital transition. The Morning Party is astounded by your miraculous save, which ensures these healing vibrations continue to transform lives in the new millennium!"
      case "failure":
        return `The frequencies you've managed to save will continue to resonate! You preserved ${countFrequencyShards()} of 7 critical frequencies. Though incomplete, this collection remains invaluable to humanity's wellness future. You can add these frequencies to your personal collection now, or return to rescue more frequencies!`
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

  // This function has been removed as we're focusing only on frequencies
  
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

  // All drink and experience related functions have been removed
  // The game now focuses exclusively on frequency collection
  // Functions like formatCollectedDrinks, formatExperiencePrices, and countDrinkItems were removed
  
  // Removed unused getFrequencyBenefits function
  
  // Get frequency choices for review screen
  function getFrequencyCartChoices(): { text: string, destination: string, collectItem?: string }[] {
    const freqItems = gameState.inventory.filter(item => item.startsWith('freq_'))
    if (freqItems.length === 0) return []
    
    // No longer need cart functionality as we're focusing solely on frequencies
    return []
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
      frequencyMessage: undefined,
      showFrequencyMessage: false
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
          <div className="bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300 bg-clip-text text-transparent font-light tracking-wider text-xl">
            {currentContent.title}
          </div>
        </div>

        {/* Character Sprite */}
        <div className="text-center mb-6">
          <span className="text-8xl filter drop-shadow-lg">{currentContent.sprite}</span>
        </div>

        {/* Text Box */}
        <div className="bg-black/40 backdrop-blur-sm p-5 mb-5 flex-grow rounded-lg border border-blue-500/20">
          <p className="text-blue-100 font-light text-lg leading-relaxed">
            {textVisible && currentContent.text[gameState.textIndex]}
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

      {/* Frequency Message (shown when collecting out of order) */}
      {gameState.showFrequencyMessage && gameState.frequencyMessage && (
        <div className="w-full max-w-3xl mb-4">
          <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 p-4 rounded-xl border border-purple-400/40 shadow-lg shadow-purple-500/20">
            <div className="flex items-center">
              <span className="text-3xl mr-3">🔮</span>
              <p className="text-purple-100 font-light">{gameState.frequencyMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Character Info with Frequency Visualizer */}
      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md p-3 rounded-xl border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 p-2 rounded-full">
            <span className="text-3xl">⚡</span>
          </div>

          {/* Frequencies section */}
          <div className="flex items-center">
            <FrequencyVisualizer collectedFrequencies={gameState.inventory} size="small" />
          </div>
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
