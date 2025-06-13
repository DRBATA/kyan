"use client"

import { useState } from "react"
import Image from "next/image"
import { CHARACTERS, type Character } from "@/lib/character-data"

interface WellnessProfileSelectionProps {
  onCharacterSelectAction: (character: Character) => void
}

export default function WellnessProfileSelection({ onCharacterSelectAction }: WellnessProfileSelectionProps) {
  const [selectedProfile, setSelectedProfile] = useState<Character | null>(null)
  const [hoveredProfile, setHoveredProfile] = useState<Character | null>(null)

  const handleSelect = () => {
    if (selectedProfile) {
      onCharacterSelectAction(selectedProfile)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-900 p-6">
      <div className="text-center bg-slate-900/90 backdrop-blur-sm p-8 rounded-xl border border-blue-400/30 max-w-4xl shadow-lg shadow-blue-500/10">
        <h1 className="text-4xl md:text-5xl font-light text-white mb-3">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Choose Your Frequency Hero</span>
        </h1>
        <h2 className="text-xl font-normal text-slate-300 mb-8">Your Y2K mission to save the healing frequencies begins now</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {Object.values(CHARACTERS).map((character) => (
            <div
              key={character.id}
              className={`relative p-6 rounded-xl border cursor-pointer transition-all transform hover:scale-102 ${
                selectedProfile?.id === character.id
                  ? "border-cyan-400/50 bg-gradient-to-br from-slate-800/90 to-blue-900/30 shadow-lg shadow-blue-500/20"
                  : "border-slate-700/50 bg-slate-800/50 hover:border-blue-500/30"
              }`}
              onClick={() => setSelectedProfile(character)}
              onMouseEnter={() => setHoveredProfile(character)}
              onMouseLeave={() => setHoveredProfile(null)}
            >
              <div className="relative w-48 h-48 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-lg"></div>
                <Image
                  src={character.sprite || "/placeholder.svg"}
                  alt={character.name}
                  width={192}
                  height={192}
                  className="rounded-full object-cover border border-slate-500/30 p-1"
                  style={{ objectPosition: "center top" }}
                  priority
                />
                {selectedProfile?.id === character.id && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white">✓</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-medium text-blue-300 mb-2">{character.name}</h3>
              <p className="text-slate-300 text-lg mb-4 italic">&quot;{character.catchphrase}&quot;</p>
              <p className="text-slate-400 mb-4">{character.description}</p>

              <div className="text-left">
                <h4 className="text-cyan-300 font-medium mb-2">Frequency Powers:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  {character.personality.map((trait, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-cyan-400">•</span> {trait}
                    </li>
                  ))}
                </ul>
              </div>

              {(hoveredProfile?.id === character.id || selectedProfile?.id === character.id) && (
                <div className="mt-4 p-4 bg-slate-900/70 backdrop-blur-sm rounded-lg border border-slate-700/50">
                  <p className="text-blue-300 text-sm font-medium">Frequency Affinity:</p>
                  <p className="text-slate-300 text-sm italic">&quot;{character.reactions.questComplete[0]}&quot;</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedProfile && (
          <div className="mb-6 p-5 bg-gradient-to-r from-slate-800/50 to-blue-900/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
            <h3 className="text-xl font-medium text-blue-300 mb-2">Frequency Hero Selected:</h3>
            <p className="text-slate-300 text-lg">
              Johny Dar has recruited <span className="text-cyan-300 font-medium">{selectedProfile.name}</span> for the Y2K frequency rescue mission
            </p>
          </div>
        )}

        <button
          onClick={handleSelect}
          disabled={!selectedProfile}
          className={`px-10 py-4 font-medium rounded-full text-lg transition-all shadow-lg ${
            selectedProfile
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 hover:shadow-cyan-500/30 border border-cyan-400/30"
              : "bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600/50"
          }`}
        >
          {selectedProfile ? "⚡ START Y2K MISSION" : "SELECT A FREQUENCY HERO"}
        </button>
      </div>
    </div>
  )
}
