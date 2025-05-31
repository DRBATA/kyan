"use client";

import { useState } from "react";
import HalftoneWaves from "@/components/HalftoneWaves";
import AudioReactiveTitle from "@/components/AudioReactiveTitle";
import RetroModal from "@/components/RetroModal";
import MatchaMadnessTextRPG from "@/components/matcha-madness-text-rpg";
import CharacterSelection from "@/components/character-selection";
import FancyMocktailMenu from "@/components/FancyMocktailMenu";
import type { Character } from "@/lib/character-data";

export default function Home() {
  // Use the soundtrack from the audio folder
  const audioSrc = "/audio/soundtrack.mp3";

  // Modal state
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showMocktailMenu, setShowMocktailMenu] = useState(false);
  const [showMatchaGame, setShowMatchaGame] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  // Click handlers for menu buttons
  const handleEventDetailsClick = () => setShowEventDetails(true);
  const handleMocktailMenuClick = () => setShowMocktailMenu(true);
  const handleMatchaGameClick = () => {
    setShowMatchaGame(true);
    setSelectedCharacter(null); // Reset character selection when opening game
  };

  // Reset character selection
  const handleCloseMatchaGame = () => {
    setShowMatchaGame(false);
    setSelectedCharacter(null);
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden flex flex-col items-center justify-center relative font-mono">
      {/* Background animation */}
      <HalftoneWaves />
      
      {/* Audio-reactive title */}
      <AudioReactiveTitle 
        title="Matcha Like It's 1999™" 
        subtitle={
          <div className="flex items-center justify-center space-x-6 text-xl font-bold font-mono tracking-tight">
            <button onClick={handleEventDetailsClick} className="text-green-400 hover:text-green-300 transition-colors px-3 py-1 border-2 border-green-500/60 bg-black/60 backdrop-blur-sm hover:bg-black/40 uppercase tracking-wider">> Event @Kyan X TheMorningPartyDXB™</button>
            <button onClick={handleMocktailMenuClick} className="text-green-400 hover:text-green-300 transition-colors px-3 py-1 border-2 border-green-500/60 bg-black/60 backdrop-blur-sm hover:bg-black/40 uppercase tracking-wider">> Mocktail_Menu by TheWaterBar™</button>
            <button onClick={handleMatchaGameClick} className="text-green-400 hover:text-green-300 transition-colors px-3 py-1 border-2 border-green-500/60 bg-black/60 backdrop-blur-sm hover:bg-black/40 uppercase tracking-wider">> Matcha_Game: MatchaMadness</button>
          </div>
        }
        audioSrc={audioSrc} 
      />

      {/* Event Details Modal */}
      <RetroModal isOpen={showEventDetails} onClose={() => setShowEventDetails(false)} title="Event Details">
        <div className="text-green-400 space-y-4">
          <p className="text-2xl mb-4">Matcha Like It's 1999</p>
          <p>Date: June 15, 2025</p>
          <p>Time: 7:00 AM - 11:00 AM</p>
          <p>Location: The Water Bar, Sheikh Zayed Road</p>
          <p className="mt-8">Join us for a morning of matcha-inspired festivities before the workday begins!</p>
        </div>
      </RetroModal>

      {/* Mocktail Menu Modal */}
      <RetroModal isOpen={showMocktailMenu} onClose={() => setShowMocktailMenu(false)} title="Matcha Mocktail Menu">
        <FancyMocktailMenu />
      </RetroModal>

      {/* Matcha Madness Game Modal */}
      <RetroModal 
        isOpen={showMatchaGame} 
        onClose={handleCloseMatchaGame} 
        title={selectedCharacter ? `MATCHA MADNESS: ${selectedCharacter.name}` : "MATCHA MADNESS"}
      >
        {!selectedCharacter ? (
          <CharacterSelection onCharacterSelect={setSelectedCharacter} />
        ) : (
          <MatchaMadnessTextRPG selectedCharacter={selectedCharacter} />
        )}
      </RetroModal>
    </main>
  );
}
