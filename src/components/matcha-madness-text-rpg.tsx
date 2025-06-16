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
  
  // Video states
  const [showVideo, setShowVideo] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  // State for frequency visualizer modal
  const [showFrequencyModal, setShowFrequencyModal] = useState(false)

  // Start game
  const startGame = () => {
    setHasStarted(true)
    setShowVideo(true)
    // Background music will start after video completes
  }
  
  // Handle video end
  const handleVideoEnd = () => {
    setVideoEnded(true)
    setShowVideo(false)
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
          `"Each frequency shard represents a unique healing vibration which you can see in the visualizer a the bottom of your time travel console - double click on it to open and hear the frequencies"`,
          `"Collect these shards in the frequency zones, as you collect them the visualizer will update, but they need to be built from the core up"`,
          `"Remember: 3, 6 and 9 are the foundations of the universe"`,
          `You seem to intuivitley know that adding the digits of each frequency will yield a foundation and you know some how you need 3 first`
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
          `Cold immersion to stabilize your field and reset your frequency baseline. Begin your journey with clarity and grounding.`,
          `Dr. Aqua dips her fingers into the iridescent waters of the Hydration Well, sending concentric ripples across the surface.`,
          `"174 Hz stabilizes your energetic baseline—it anchors you in the Now. Cold is clarity. Breath is entry."`,
          `“Before transformation, we must return to stillness. This is where the shift begins.”`,
          `“Drink this. Let it guide your system back to truth. The Hydration Well remembers who you are beneath the noise.”`,
          `${gameState.inventory.includes("drink_prana") ? "✅ Ginger Shot awakens immunity, metabolism, and natural energy. Bold and warming—ideal after cold immersion." : ""}`,
          `${gameState.inventory.includes("freq_174")  ? "174 Hz shard pulses with Arctic-deep resonance—anchoring your energy in crystalline stillness." : ""}`
        ],
        choices: [
          { text: "Experience Ginger Shot",                 destination: "tea_gardens", collectItem: "drink_prana" },
          { text: "Attune to 174 Hz frequency",               destination: "tea_gardens", collectItem: "freq_174"    },
          { text: "✨ Full foundation experience",       destination: "tea_gardens", collectItem: ["freq_174","drink_prana"] },
          { text: "🗺 Return to Frequency Map",                       destination: "map" }
        ],
        bgColor: "from-blue-800 via-cyan-600 to-teal-400",
      },
      tropical_cove: {
        title: "LIGHT VAULT — 528 Hz: THE HARMONIZER",
        sprite: "✨",
        text: [
          `Sol stands before a vault made of fractal light—vines of pure color flowing from floor to ceiling.`,
          `“Inside the Light Vault, you’ll receive a full-spectrum recalibration. 528 Hz—the DNA harmonizer—will awaken the codes already within you.”`,
          `“This isn’t about becoming more. It’s about remembering all that you are.”`,
          `She offers two small vials: one golden, one teal, “Choose. One soothes. One energizes. Both respond to your current frequency.”.`,
          `${gameState.inventory.includes("drink_kayan") ? "✅ Golden Kayan Elixir bathes your field in peach-gold coherence—prebiotic fibers awaken gut clarity and calm. Antioxidant-rich and clarifying—an ideal bridge between float and daily life." : ""}`,
          `${gameState.inventory.includes("drink_aqua") ? "✅ Aqua Aura, vibrant berry blend of electrolytes, citrus, and agave nectar, surges with electric hydration sparking cellular vitality - perfect to extend your glow." : ""}`,
          `${gameState.inventory.includes("freq_528") ? "✅ 528 Hz crystal shard EMANATES the miracle tone, its geometric perfection transforming everything nearby." : ""}`
        ],
        choices: [
          { text: "Experience Golden Kayan Elixir", destination: "tropical_cove", collectItem: "drink_kayan" },
          { text: "Experience Aqua Aura", destination: "tropical_cove", collectItem: "drink_aqua" },
          { text: "Attune to 528 Hz frequency", destination: "tropical_cove", collectItem: "freq_528" },
          { text: "✨ Full experience: 528 Hz & Golden Kayan", destination: "tropical_cove", collectItem: ["freq_528","drink_kayan"] },
          { text: "✨ Full experience: 528 Hz & Aqua Aura", destination: "tropical_cove", collectItem: ["freq_528","drink_aqua"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-yellow-400 via-lime-300 to-green-300",
      },
      mountain_peak: {
        title: "SOUND ALTAR — 396 Hz: THE UNBLOCKER",
        sprite: "🔊",
        text: [
          `Lie down in harmonic sound and light. This deep resonance clears emotional blocks and restores energetic flow.`,
          `Echo stands beside a circular altar carved from earthstone, copper coils humming softly with resonance.`,
          `"This is the Sound Altar—where emotion meets frequency and releases its grip."`,
          `"396 Hz will begin the dissolution of fear. As you lie here, the light and tone will unbind what's buried."`,
          `She places a copper disk over your chest. "This conductor amplifies the field and grounds the work. You're not just hearing sound. You're becoming it."`,
          `${gameState.inventory.includes("drink_copper") ? "✅ The Gaia Experience, chaga crystals blended with coconut crema, cinnamon, and golden date syrup. Grounding and heart-opening, this earthy elixir anchors your resonance." : ""}`,
          `${gameState.inventory.includes("freq_396")   ? "✅ 396 Hz shard PULSES with transformative power, dissolving resistance within a 3-meter radius." : ""}`
        ],
        choices: [
          { text: "Experience The Gaia Experience",      destination: "mountain_peak", collectItem: "drink_copper" },
          { text: "Attune to 396 Hz frequency",               destination: "mountain_peak", collectItem: "freq_396"     },
          { text: "✨ Full liberation experience",       destination: "mountain_peak", collectItem: ["freq_396","drink_copper"] },
          { text: "🗺 Return to Frequency Map",                       destination: "map" }
        ],
        bgColor: "from-rose-700 via-orange-600 to-amber-400",
      },
      ice_caves: {
        title: "RESONANCE CHAMBER — 963 Hz: THE PINNACLE",
        sprite: "🐋",
        text: [
          `Float weightlessly in silence and frequency. Deep theta states open the door to nervous system recovery and expanded awareness.`,
          `Astra greets you at the threshold of a spherical pod, its inner walls pulsating with soft indigo light.`,
          `"Welcome to the Resonance Chamber. Here, your body dissolves, and your system listens."`,
          `"963 Hz vibrates at the level of divine intelligence. While you float, you will meet yourself beyond form."`,
          `She places a drop of an iridescent elixir on your tongue. "This helps open the third gateway. Let go. You are safe in the silence."`,
          `${gameState.inventory.includes("drink_transcend") ? "✅ Golden Kayan Elixir, a sparkling digestive blend of peach, pineapple, and calming botanicals. Antioxidant-rich and clarifying—an ideal bridge between float and daily life." : ""}`,
          `${gameState.inventory.includes("exp_sound_bath") ? "✅ Sound Bath reservation PULSATES with multi-dimensional harmonic potential." : ""}`,
          `${gameState.inventory.includes("freq_963") ? "✅ 963 Hz shard EMANATES golden light—the apex frequency creating a portal to higher awareness." : ""}`
        ],
        choices: [
          { text: "Experience Golden Kayan Elixir", destination: "ice_caves", collectItem: "drink_transcend" },
          { text: "Enjoy Sound Bath immersion", destination: "ice_caves", collectItem: "exp_sound_bath" },
          { text: "Attune to 963 Hz frequency", destination: "ice_caves", collectItem: "freq_963" },
          { text: "✨ Complete cosmic trinity experience", destination: "ice_caves", collectItem: ["freq_963", "drink_transcend", "exp_sound_bath"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-yellow-300 via-yellow-200 to-amber-500",
      },
      sacred_temple: {
        title: "THE SWEAT CODE — 285 Hz: THE PURIFIER",
        sprite: "🔥",
        text: [
          `A dry sauna experience to release toxins and tension. Allow the heat to purify your body and prepare your field for integration.`,
          `Kelvin tends to the glowing coils at the center of a dry cedar sanctuary, aromatic with ancient resins.`,
          `"The Sweat Code is more than heat—it's purification through frequency. 285 Hz promotes cellular regeneration."`,
          `"As the body releases, the field clears. This is physical preparation for multidimensional work."`,
          `He hands you a towel infused with juniper and citrus. "Wrap yourself in this frequency imprint. You're shedding more than sweat—you're shedding what's no longer aligned."`,
          `${gameState.inventory.includes("drink_cryo") ? "✅ Inscribed Copper Bottle contains pure, filtered water. Naturally antimicrobial and recharged every 2–4 hours for optimal hydration after heat purification." : ""}`,
          `${gameState.inventory.includes("drink_perrier") ? "✅ Maison Perrier® Chic radiates rejuvenating sub-zero energy with crisp minerality and cellular hydration properties. Ideal for post-sauna temperature regulation." : ""}`,
          `${gameState.inventory.includes("exp_ice_plunge") ? "✅ ICE Plunge reservation PULSES with transformative potential, promising quantum resilience." : ""}`,
          `${gameState.inventory.includes("freq_285") ? "✅ 285 Hz frequency shard EMANATES rejuvenating chill—cellular restoration codes manifesting physically." : ""}`
        ],
        choices: [
          { text: "Experience Inscribed Copper Bottle", destination: "sacred_temple", collectItem: "drink_cryo" },
          { text: "Experience Maison Perrier® Chic", destination: "sacred_temple", collectItem: "drink_perrier" },
          { text: "Enjoy ICE Plunge (breath-guided)", destination: "sacred_temple", collectItem: "exp_ice_plunge" },
          { text: "Attune to 285 Hz frequency shard", destination: "sacred_temple", collectItem: "freq_285" },
          { text: "✨ Full experience: shard, elixir & plunge", destination: "sacred_temple", collectItem: ["freq_285","drink_cryo","exp_ice_plunge"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-blue-900 via-blue-700 to-cyan-300",
      },
      deep_forest: {
        title: "FREQUENCY GATEWAY — 417 & 852 Hz: THE TRANSFORMER",
        sprite: "🌿",
        text: [
          `You step into a vertical prism chamber—walls alive with shifting spectrums of electric blue, violet, and ultraviolet light. Pulses of sound spiral upward like invisible ladders. The energy here is undeniable. A tall figure, cloaked in mirrored textiles, steps forward—Noor, Guardian of the Gateway.`,
          `Noor speaks, her voice resonating from every direction: "Welcome to the Frequency Gateway, where the codes of coherence are activated in minutes. You'll be standing between 417 Hz and 852 Hz—frequencies of transformation and intuition."`,
          `"This is not passive light. It speaks. It realigns. It remembers." The chamber's crystalline walls pulse in perfect sync with your heartbeat, creating architectural rhythms that seem to breathe with conscious intelligence.`,
          `She hands you a small crystal sphere, vibrating faintly in your palm. "Carry this through the stream. It will mirror your current frequency and record the recalibration. Keep it with you. It becomes your anchor in moments of dissonance."`,
          `As you move deeper into the Gateway, every photon of light carries information—rewiring neural pathways, dissolving blockages, awakening dormant abilities that have always existed within your cellular memory.`,
          `${gameState.inventory.includes("freq_417") ? "✅ 417 Hz crystal sphere vibrates with transformative potential—mirroring your personal frequency and amplifying your resonance field." : ""}`,
          `${gameState.inventory.includes("freq_852") ? "✅ 852 Hz intuition catalyst shimmers with prismatic light—neural pathways activating in response to its presence." : ""}`,
          `${gameState.inventory.includes("drink_kayan") ? "✅ Golden Kayan Elixir, a sparkling digestive blend of peach, pineapple, and calming botanicals. Antioxidant-rich and clarifying—an ideal companion to frequency work." : ""}`,
          `${gameState.inventory.includes("drink_aqua") ? "✅ Aqua Aura, a vibrant berry blend of electrolytes, citrus, and agave nectar. Cell-hydrating and energetically aligned with the Gateway frequencies." : ""}`,
          `${gameState.inventory.includes("drink_coffee") ? "✅ AOI Coffee, beans infused with sound patterns at 417 & 852 Hz frequencies, creating an awakened state of clarity. Rich notes of dark chocolate and blackberry enhance intuitive reception." : ""}`
        ],
        choices: [
          { text: "Attune to 417 Hz crystal sphere", destination: "deep_forest", collectItem: "freq_417" },
          { text: "Attune to 852 Hz intuition catalyst", destination: "deep_forest", collectItem: "freq_852" },
          { text: "Experience Golden Kayan Elixir", destination: "deep_forest", collectItem: "drink_kayan" },
          { text: "Experience Aqua Aura", destination: "deep_forest", collectItem: "drink_aqua" },
          { text: "Experience AOI Coffee", destination: "deep_forest", collectItem: "drink_coffee" },
          { text: "Enter Light Stream", destination: "deep_forest", collectItem: "exp_air_dome" },
          { text: "Enjoy Thermal Recalibration", destination: "deep_forest", collectItem: "exp_heat_sauna" },
          { text: "Explore Harmonic Field", destination: "deep_forest", collectItem: "exp_earth_bed" },
          { text: "Experience Neural Reset", destination: "deep_forest", collectItem: "exp_ice_plunge" },
          { text: "✨ Complete Gateway transformation", destination: "deep_forest", collectItem: ["freq_417","freq_852","drink_kayan","drink_aqua","exp_air_dome","exp_heat_sauna","exp_earth_bed","exp_ice_plunge"] },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-purple-900 via-violet-700 to-indigo-400",
      },
      crystal_lake: {
        title: "FREQUENCY SYNTHESIS CHAMBER",
        sprite: "🌊",
        text: [
          `DIMENSIONAL CONVERGENCE! Your collected frequency shards ACTIVATE simultaneously—creating a living geometric field around Nova as she stands at the central synthesis node! Each shard below PULSES in perfect resonance with its counterpart in the chamber!`,
          `"WITNESS THE FIELD SYNTHESIS!" her voice resonates at exactly the frequencies you've collected. "The visualization pattern below is now creating a PHYSICAL MANIFESTATION that can be experienced directly!"`,
          `The chamber's architecture RESPONDS to your unique frequency collection pattern—rearranging molecular structures to match the exact harmonic sequence displayed in your field visualization. Your previously collected shards SURGE with increased luminosity!`,
          `"This synthesis unlocks the Inner Resonance Experience—a direct neural bridge between your digital frequency collection and embodied transformation at The Morning Party events. What you're seeing in your field below will become TANGIBLE!"`,
          `As she gestures toward your frequency visualization, the shards in your field below PULSE WITH INCREASED INTENSITY—sending visible energy tendrils upward that connect to their corresponding nodes in the chamber!`,
          `"Ready to transform this digital frequency collection into lived experience? The pattern you've created is uniquely yours—it can't be replicated. At our physical space, this same pattern will guide your journey."`,
          `${gameState.inventory.includes("synthesis_complete") ? "✅ Frequency Synthesis COMPLETED—your unique pattern now fully mapped and ready for physical manifestation!" : ""}`
        ],
        choices: [
          { text: "⚡ Complete Frequency Synthesis", destination: "crystal_lake", collectItem: "synthesis_complete" },
          { text: "🗺 Return to Frequency Map", destination: "map" },
        ],
        bgColor: "from-violet-600 via-fuchsia-500 to-pink-400",
      },
      console: {
        title: "MASTER CONSOLE — FREQUENCY UPLOAD",
        sprite: "💻",
        text: [
          `TIMELINE COLLAPSE IMMINENT! ⏰ ${Math.floor(gameState.currentTime / 60)}:${(gameState.currentTime % 60).toString().padStart(2, '0')} UNTIL VIBRATIONAL RESET! Digital clock numbers FLICKERING between dimensions!`,
          `Johny Dar's hologram EXPLODES outward—filling the entire room with LIVING DATA! Your collected frequencies manifest as pulsing geometric forms—each one ROTATING and SHIFTING in perfect mathematical harmony!`,
          `"THE CULMINATION POINT APPROACHES!" His voice resonates from everywhere at once. "This quantum portal exists at the precise intersection between digital recoding and vibrational truth!"`,
          `Holographic interfaces MATERIALIZE around you—showing real-time biometric feedback of how each frequency is already TRANSFORMING your field! Neural pathways VISIBLY rewiring as you stand at the console!`,
          `✨ FREQUENCY INTEGRATION STATUS: ${countFrequencyShards()}/7 frequency shards harmonizing | Field Coherence: ${Math.min(countFrequencyShards() * 14, 98)}%`,
          `"The Morning Party legacy can only survive through YOUR field's integration with these prime frequencies! Every shard, every formula, every experience—all converging in this PRECISE MOMENT!"`,
          `Time itself seems to BEND around the console—reality flickering between multiple potential futures—as the countdown to vibrational reset accelerates with each passing second!`,
          `${gameState.inventory.includes("synthesis_complete") ? 
            `"UPLOAD PROTOCOL READY! Your synthesized frequency pattern has been registered and awaits final preservation!"` : 
            `"⚠️ UPLOAD UNAVAILABLE! Your frequency pattern requires SYNTHESIS before it can be preserved. Visit the Frequency Synthesis Chamber to prepare your unique constellation!"`}`,
          `${gameState.inventory.includes("synthesis_complete") ? "✅ Frequency Pattern SYNTHESIZED—field harmony achieved and ready for upload!" : ""}`,
          `"MAKE YOUR CHOICE! Upload now and crystallize your current frequency collection, or return to gather more shards—but remember, midnight waits for NO ONE!"`
        ],
        choices: [
          ...(gameState.inventory.includes("synthesis_complete") ? 
            [{ text: "✅ INITIATE QUANTUM UPLOAD", destination: "ending", collectItem: "upload_complete" }] : 
            [{ text: "⚠️ Visit Synthesis Chamber First", destination: "crystal_lake" }]
          ),
          { text: "⚡ Review Frequency Collection", destination: "frequencies" },
          { text: "🗺 Return to Field Exploration", destination: "map", returnToMap: false },
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
      {/* Intro Video Overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <video 
            src="/videos/INTROVID.mp4" 
            className="w-full h-full object-cover" 
            autoPlay 
            muted={isMuted}
            controls={false}
            onEnded={handleVideoEnd}
          />
          <button 
            onClick={() => handleVideoEnd()} 
            className="absolute bottom-8 right-8 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md backdrop-blur-sm"
          >
            Skip Intro
          </button>
        </div>
      )}
      
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
          <div 
            className="mr-4 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 p-2 rounded-full cursor-pointer hover:from-blue-500/50 hover:to-indigo-500/50 transition-all" 
            onClick={() => setShowFrequencyModal(true)}
            title="Click to expand frequency visualizer"
          >
            <span className="text-3xl">⚡</span>
          </div>

          {/* Frequencies section */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setShowFrequencyModal(true)}
            title="Click to expand frequency visualizer"
          >
            <FrequencyVisualizer collectedFrequencies={gameState.inventory} size="small" />
          </div>
        </div>
        <div>
          <p className="text-blue-300 font-light">
            {selectedCharacter.name}: <span className="italic text-blue-200/90">&quot;{selectedCharacter.catchphrase}&quot;</span>
          </p>
        </div>
      </div>
      
      {/* Frequency Visualizer Modal */}
      {showFrequencyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900/90 to-blue-900/90 p-8 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20 w-11/12 max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-light text-cyan-300">Sacred Frequency Lattice</h3>
              <button 
                onClick={() => setShowFrequencyModal(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="flex justify-center items-center mb-6">
              <FrequencyVisualizer collectedFrequencies={gameState.inventory} size="large" />
            </div>
            
            <p className="text-center text-blue-200/80 mb-8">
              {gameState.inventory.filter(item => item.startsWith('freq_')).length > 0 
                ? "Click any collected frequency node to hear its resonance." 
                : "Collect frequencies during your journey to form the sacred lattice."}
            </p>
            
            <div className="text-center">
              <button 
                onClick={() => setShowFrequencyModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white font-light rounded-full"
              >
                Return to Journey
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-blue-300/70 mt-4"> 2025 THE WATER BAR | THE JOHNY DAR ADVENTURE</p>
    </div>
  )
}
