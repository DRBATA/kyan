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
  | "tea_gardens"
  | "tropical_cove"
  | "mountain_peak"
  | "ice_caves"
  | "sacred_temple"
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

  // Toggle mute
  const toggleMute = () => {
    const muted = soundManager.toggleMute()
    setIsMuted(muted)
  }

  // Advance text
  const advanceText = () => {
    soundManager.playSound("dialogueBeep")

    if (gameState.textIndex < getScreenContent(gameState.currentScreen).text.length - 1) {
      setGameState((prev) => ({
        ...prev,
        textIndex: prev.textIndex + 1,
        showChoices: false,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        showChoices: true,
      }))
    }
  }

  // Handle choice selection
  const handleChoice = (destination: GameScreen, collectItem?: string) => {
    soundManager.playSound("areaTransition")

    // Add item to inventory if specified
    const newInventory = [...gameState.inventory]
    if (collectItem && !newInventory.includes(collectItem)) {
      newInventory.push(collectItem)
      soundManager.playSound("questComplete")
    }

    // Check for game completion
    if (destination === "ending") {
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
        currentScreen: destination,
        textIndex: 0,
        showChoices: false,
        gameComplete: true,
        endingType,
      }))
    } else {
      // Regular navigation
      setGameState((prev) => ({
        ...prev,
        currentScreen: destination,
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
    const screens = {
      intro: {
        title: "DECEMBER 31, 1999 - 11:30 PM",
        sprite: "🕰️",
        text: [
          `The world stands on the brink of Y2K. Computers everywhere are expected to crash when the clock strikes midnight.`,
          `But there's an even greater crisis at hand: The Morning Party is in danger!`,
          `The sacred recipe for the legendary matcha blend has been digitized, but the Y2K bug will permanently erase it at midnight!`,
          `Ancient tradition states that if the recipe isn't physically recreated before the digital version is lost, it can NEVER be recovered!`,
          `You, ${selectedCharacter.name}, have been chosen to save this recipe before the crash. Your radical dune buggy skills are the only hope!`,
          `You must gather the sacred ingredients and prepare the blend before midnight strikes - or morning celebrations as we know them will never exist!`,
        ],
        choices: [{ text: "Head to Zen Village", destination: "village" }],
        bgColor: "from-purple-900 to-indigo-900",
      },
      village: {
        title: "ZEN VILLAGE",
        sprite: "🧙‍♂️",
        text: [
          `Master Sencha greets you with urgency in his eyes.`,
          `"Time traveler! You've arrived just in time!"`,
          `"The Morning Party of January 1, 2000 is in CRISIS!"`,
          `"The sacred matcha recipe was digitized, but the Y2K bug will permanently delete it at midnight!"`,
          `"Ancient law decrees: if we don't recreate it physically before the digital copy is lost, the recipe will be lost FOREVER!"`,
          `"You must gather the ingredients and mix them before midnight - or this 25-year tradition will never begin!"`,
          `"Start with the Tea Gardens - hurry!"`,
        ],
        choices: [
          { text: "Go to Tea Gardens", destination: "tea_gardens" },
          { text: "Visit Tropical Cove", destination: "tropical_cove" },
        ],
        bgColor: "from-green-800 to-green-600",
      },
      tea_gardens: {
        title: "TEA GARDENS",
        sprite: "👨‍🌾",
        text: [
          `The Garden Keeper is tending to the last batch of matcha plants before Y2K hits.`,
          `"The Morning Party guests will be arriving at dawn!"`,
          `"This matcha powder is our last hope - it's Y2K compliant!"`,
          `"The computers may crash at midnight, but this tea will shine at sunrise!"`,
          `"Take it quickly - time is running out to prepare for the dawn celebration!"`,
        ],
        choices: [
          { text: "Take the matcha powder", destination: "tea_gardens", collectItem: "matcha_powder" },
          { text: "Return to the village", destination: "village" },
          ...(gameState.inventory.includes("matcha_powder")
            ? [{ text: "Go to Honey Mountain", destination: "mountain_peak" }]
            : []),
        ],
        bgColor: "from-green-700 to-green-500",
      },
      tropical_cove: {
        title: "TROPICAL COVE",
        sprite: "🏄‍♀️",
        text: [
          `Coco the coconut vendor is chilling on the beach, unworried about Y2K.`,
          `"Dude! I heard about The Morning Party emergency!"`,
          `"This coconut milk is totally fresh - no preservatives, no Y2K worries!"`,
          `"It's gonna make that matcha smooth for the first dawn of 2000!"`,
          `"Save the morning celebration, time traveler!"`,
        ],
        choices: [
          { text: "Take the coconut milk", destination: "tropical_cove", collectItem: "coconut_milk" },
          { text: "Return to the village", destination: "village" },
          ...(gameState.inventory.includes("coconut_milk")
            ? [{ text: "Go to Ice Caves", destination: "ice_caves" }]
            : []),
        ],
        bgColor: "from-blue-700 to-cyan-500",
      },
      mountain_peak: {
        title: "HONEY MOUNTAIN",
        sprite: "🐝",
        text: [
          `Buzz the beekeeper is frantically trying to calm his bees before Y2K.`,
          `"*frantic buzzing*"`,
          `"The bees are worried about Y2K too!"`,
          `"But this honey? It's been the same recipe for millennia!"`,
          `"No computer can crash nature's sweetness!"`,
          `"Take it - The Morning Party MUST happen at dawn!"`,
        ],
        choices: [
          { text: "Take the honey", destination: "mountain_peak", collectItem: "honey" },
          { text: "Return to Tea Gardens", destination: "tea_gardens" },
          ...(gameState.inventory.includes("honey") && gameState.inventory.length >= 3
            ? [{ text: "Go to Party Temple", destination: "sacred_temple" }]
            : []),
        ],
        bgColor: "from-amber-700 to-amber-500",
      },
      ice_caves: {
        title: "CRYSTAL ICE CAVES",
        sprite: "❄️",
        text: [
          `Frost the ice spirit hovers mysteriously in the frozen air.`,
          `"Time traveler... I've been expecting you..."`,
          `"These ice cubes have been waiting since the last ice age."`,
          `"No Y2K bug can touch what's already frozen in time!"`,
          `"Take them - the countdown to midnight has begun, but these will keep the matcha fresh until dawn!"`,
        ],
        choices: [
          { text: "Take the ice cubes", destination: "ice_caves", collectItem: "ice_cubes" },
          { text: "Return to Tropical Cove", destination: "tropical_cove" },
          ...(gameState.inventory.includes("ice_cubes") && gameState.inventory.length >= 3
            ? [{ text: "Go to Party Temple", destination: "sacred_temple" }]
            : []),
        ],
        bgColor: "from-blue-900 to-blue-700",
      },
      sacred_temple: {
        title: "MATCHA TEMPLE - 11:55 PM",
        sprite: "🎧",
        text: [
          `DJ Harmony is frantically checking the countdown clock as midnight approaches.`,
          `"You made it! The Y2K crash is almost here - we have seconds left before the digital recipe is wiped forever!"`,
          `"Quick! Use this ancient whisk to physically recreate the legendary matcha blend before it's lost to time!"`,
          `"Once you've mixed it with your own hands, the recipe will be preserved despite any computer crash!"`,
          `"HURRY! THE COUNTDOWN TO DIGITAL OBLIVION IS ALMOST COMPLETE!"`,
        ],
        choices: [{ text: "Mix the ingredients", destination: "ending", collectItem: "matcha_latte" }],
        bgColor: "from-purple-800 to-purple-600",
      },
      ending: {
        title: getEndingTitle(gameState.endingType),
        sprite: getEndingEmoji(gameState.endingType),
        text: [
          getEndingDescription(gameState.endingType, selectedCharacter.name),
          getEndingFlavor(gameState.endingType),
        ],
        choices: [{ text: "Play Again", destination: "intro" }],
        bgColor: getEndingBackground(gameState.endingType),
      },
    }

    return screens[screen]
  }

  // Get ending title based on type
  function getEndingTitle(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "🌟 DAWN OF A NEW ERA 🌟"
      case "heroic":
        return "🎉 MATCHA MORNING CHAMPION 🎉"
      case "clutch":
        return "⚡ DAYBREAK DEADLINE BEATER ⚡"
      case "miracle":
        return "🔥 MIDNIGHT MIRACLE WORKER 🔥"
      case "failure":
        return "💥 Y2K MATCHA CATASTROPHE 💥"
    }
  }

  // Get ending emoji based on type
  function getEndingEmoji(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "🏆"
      case "heroic":
        return "🎊"
      case "clutch":
        return "⏱️"
      case "miracle":
        return "✨"
      case "failure":
        return "💻"
    }
  }

  // Get ending description based on type
  function getEndingDescription(type: GameState["endingType"], name: string): string {
    switch (type) {
      case "legendary":
        return `${name} ensured the matcha survived Y2K! The Morning Party on January 1st will be unforgettable!`
      case "heroic":
        return `${name} prepared the perfect matcha blend with time to spare! The Morning Party is ready to begin!`
      case "clutch":
        return `Talk about cutting it close! ${name} finished the matcha blend seconds before midnight, ensuring The Morning Party could happen!`
      case "miracle":
        return `UNBELIEVABLE! ${name} completed the matcha blend at literally 11:59:59 PM, completely alone!`
      case "failure":
        return `Time ran out! The matcha was ruined and The Morning Party never happened!`
    }
  }

  // Get ending flavor text based on type
  function getEndingFlavor(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "While others celebrated at midnight, you secured the future of the morning after! As the sun rises on 2000, The Morning Party begins—the perfect matcha celebration to welcome the new millennium. Your heroism establishes a tradition that thrives 25 years later, where Morning Parties continue to honor the legacy you created that fateful night!"
      case "heroic":
        return "The first sunrise of 2000 reveals a spectacular Morning Party thanks to your efforts! While others recover from midnight celebrations, you've ensured matcha culture thrives in the morning light. Your heroism inspires Morning Parties that continue 25 years later, honoring the tradition you established that historic New Year's Day!"
      case "clutch":
        return "The tension is unbearable as you race against the clock! With seconds left before midnight, you complete the perfect matcha blend! Hours later as dawn breaks, The Morning Party can begin thanks to your last-minute heroics. Your heart-stopping finish creates a tradition that still thrives in 2025, where Morning Parties celebrate your legendary clutch performance!"
      case "miracle":
        return "With a single second left until Y2K, you complete the perfect matcha blend in solitude! Hours later, as dawn breaks, The Morning Party guests are shocked to hear how close they came to disaster. Your miraculous solo save creates a legend still celebrated 25 years later at Morning Parties where everyone toasts your last-second heroics!"
      case "failure":
        return "As midnight strikes, your matcha blend remains incomplete. The digital disaster corrupts all matcha recipes and knowledge. As dawn breaks on January 1, 2000, there is no Morning Party—only disappointment. In this dark timeline, morning celebrations forever lack the vibrant matcha culture that could have been. In 2025, no one even remembers what they missed..."
    }
  }

  // Get ending background color based on type
  function getEndingBackground(type: GameState["endingType"]): string {
    switch (type) {
      case "legendary":
        return "from-yellow-700 to-yellow-500"
      case "heroic":
        return "from-green-700 to-green-500"
      case "clutch":
        return "from-orange-700 to-orange-500"
      case "miracle":
        return "from-red-700 to-red-500"
      case "failure":
        return "from-gray-900 to-gray-700"
    }
  }

  // Format inventory for display
  const formatInventory = () => {
    const items = {
      matcha_powder: "🍵 Matcha",
      coconut_milk: "🥥 Coconut Milk",
      honey: "🍯 Honey",
      ice_cubes: "🧊 Ice",
      matcha_latte: "✨ Matcha Latte",
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold text-green-400 mb-4 animate-pulse font-mono">MATCHA MADNESS</h1>
          <h2 className="text-3xl font-bold text-green-300 mb-6 font-mono">Y2K CRISIS</h2>

          <div className="relative w-64 h-64 mb-6 mx-auto">
            <Image
              src={selectedCharacter.sprite || "/placeholder.svg"}
              alt={selectedCharacter.name}
              width={256}
              height={256}
              className="animate-bounce rounded-lg object-contain bg-black bg-opacity-40 p-3"
            />
          </div>

          <div className="bg-green-900 border-2 border-green-400 p-4 mb-6 rounded-lg">
            <h3 className="text-2xl font-bold text-green-400 mb-2 font-mono">{selectedCharacter.name}</h3>
            <p className="text-green-300 text-lg mb-4 italic font-mono">&quot;{selectedCharacter.catchphrase}&quot;</p>
          </div>

          <div className="bg-black border-2 border-green-500 p-4 mb-8 rounded-lg">
            <p className="text-white mb-2 text-center font-mono">
            December 31, 1999 — Y2K looms; the sacred matcha recipe will be deleted at midnight.  
            </p>
            <p className="text-green-300 text-sm text-center font-mono">
            Race to physically recreate the recipe before the Y2K crash, preserving The Morning Party tradition for the next 25 years.
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-4 bg-green-700 text-white font-bold rounded-lg text-xl hover:bg-green-600 transition-all shadow-lg transform hover:scale-105 border-2 border-green-400 font-mono"
          >
            &gt; START GAME
          </button>

          <p className="text-xs text-gray-500 mt-4 font-mono">© 1999 MATCHA SYSTEMS INC.</p>
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
      <div className="flex items-center justify-between w-full max-w-3xl mb-2">
        <h1 className="text-3xl font-bold text-white font-mono">MATCHA MADNESS: Y2K</h1>
      </div>

      {/* Status Bar */}
      <div className="w-full max-w-3xl bg-black border-2 border-green-400 p-2 mb-4 flex justify-between items-center">
        <div className="text-green-400 font-mono">TIME: {formatTime()}</div>
        <div className="text-green-400 font-mono">GEAR: {formatInventory() || "None"}</div>
      </div>

      {/* Main Game Window */}
      <div className="w-full max-w-3xl bg-black border-4 border-green-500 rounded-lg p-6 mb-4 min-h-[400px] flex flex-col">
        {/* Location Title */}
        <div className="bg-green-900 border-2 border-green-400 p-2 mb-4 text-center">
          <h2 className="text-2xl font-bold text-white font-mono">{currentContent.title}</h2>
        </div>

        {/* Character Sprite */}
        <div className="text-center mb-4">
          <span className="text-8xl">{currentContent.sprite}</span>
        </div>

        {/* Text Box */}
        <div className="bg-black border-2 border-green-400 p-4 mb-4 flex-grow">
          <p className="text-green-400 font-mono text-lg">
            {textVisible && currentContent.text[gameState.textIndex]}
            {blinkCursor && <span className="animate-pulse">▮</span>}
          </p>
        </div>

        {/* Choices or Continue */}
        <div className="flex flex-col space-y-2">
          {gameState.showChoices ? (
            currentContent.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(
                  choice.destination as GameScreen, 
                  'collectItem' in choice ? choice.collectItem : undefined
                )}
                className="bg-green-800 hover:bg-green-700 text-white font-mono py-2 px-4 border-2 border-green-400 rounded text-left"
              >
                &gt; {choice.text}
              </button>
            ))
          ) : (
            <button
              onClick={advanceText}
              className="bg-green-800 hover:bg-green-700 text-white font-mono py-2 px-4 border-2 border-green-400 rounded text-center"
            >
              &gt; Continue
            </button>
          )}
        </div>
      </div>

      {/* Character Info */}
      <div className="w-full max-w-3xl bg-black border-2 border-green-400 p-2 flex items-center">
        <div className="mr-4">
          <span className="text-4xl">🏎️</span>
        </div>
        <div>
          <p className="text-green-400 font-mono">
            {selectedCharacter.name}: &quot;{selectedCharacter.catchphrase}&quot;
          </p>
        </div>
      </div>

      <p className="text-xs text-white mt-4 font-mono">© 2025 THEWATERBAR.AE | 640K RAM REQUIRED</p>
    </div>
  )
}
