"use client"

import { useState } from "react"
import Image from "next/image"
import { CHARACTERS, type Character } from "@/lib/character-data"

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void
}

export default function CharacterSelection({ onCharacterSelect }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [hoveredCharacter, setHoveredCharacter] = useState<Character | null>(null)

  const handleSelect = () => {
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-900 via-yellow-800 to-orange-900 p-4">
      <div className="text-center bg-black bg-opacity-80 p-8 rounded-xl border-4 border-yellow-400 max-w-4xl">
        <h1 className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">🏎️ CHOOSE YOUR RIDER 🏎️</h1>
        <h2 className="text-2xl font-bold text-orange-300 mb-8">Who will save the Y2K Matcha Party?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {Object.values(CHARACTERS).map((character) => (
            <div
              key={character.id}
              className={`relative p-6 rounded-lg border-4 cursor-pointer transition-all transform hover:scale-105 ${
                selectedCharacter?.id === character.id
                  ? "border-yellow-400 bg-yellow-900 bg-opacity-50"
                  : "border-gray-600 bg-gray-800 bg-opacity-50 hover:border-yellow-600"
              }`}
              onClick={() => setSelectedCharacter(character)}
              onMouseEnter={() => setHoveredCharacter(character)}
              onMouseLeave={() => setHoveredCharacter(null)}
            >
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src={character.sprite || "/placeholder.svg"}
                  alt={character.name}
                  width={192}
                  height={192}
                  className="rounded-lg object-contain bg-black bg-opacity-40 p-2 pixelated border-2 border-yellow-500"
                  style={{ imageRendering: 'pixelated' }}
                  priority
                  unoptimized={true}
                />
                {selectedCharacter?.id === character.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold">✓</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-bold text-yellow-400 mb-2">{character.name}</h3>
              <p className="text-orange-300 text-lg mb-4 italic">&quot;{character.catchphrase}&quot;</p>
              <p className="text-white mb-4">{character.description}</p>

              <div className="text-left">
                <h4 className="text-yellow-300 font-bold mb-2">PERSONALITY:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {character.personality.map((trait, index) => (
                    <li key={index}>• {trait}</li>
                  ))}
                </ul>
              </div>

              {(hoveredCharacter?.id === character.id || selectedCharacter?.id === character.id) && (
                <div className="mt-4 p-3 bg-black bg-opacity-60 rounded">
                  <p className="text-yellow-300 text-sm font-bold">SAMPLE REACTION:</p>
                  <p className="text-white text-sm italic">&quot;{character.reactions.questComplete[0]}&quot;</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedCharacter && (
          <div className="mb-6 p-4 bg-green-900 bg-opacity-50 rounded-lg border-2 border-green-400">
            <h3 className="text-xl font-bold text-green-400 mb-2">RIDER SELECTED:</h3>
            <p className="text-white text-lg">
              <span className="text-yellow-400">{selectedCharacter.name}</span> is ready to save the matcha party!
            </p>
          </div>
        )}

        <button
          onClick={handleSelect}
          disabled={!selectedCharacter}
          className={`px-10 py-5 font-bold rounded-lg text-2xl transition-all shadow-lg transform ${
            selectedCharacter
              ? "bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:from-orange-700 hover:to-yellow-700 hover:scale-105 border-2 border-yellow-400"
              : "bg-gray-600 text-gray-400 cursor-not-allowed border-2 border-gray-500"
          }`}
        >
          {selectedCharacter ? "🎵 START THE MISSION!" : "SELECT A RIDER FIRST"}
        </button>

        <p className="text-xs text-gray-300 mt-4">Choose wisely - the fate of matcha culture depends on you!</p>
      </div>
    </div>
  )
}
