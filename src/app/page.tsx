"use client";

import { useState } from "react";
import HalftoneWaves from "@/components/HalftoneWaves";
import AudioReactiveTitle from "@/components/AudioReactiveTitle";
import RetroModal from "@/components/RetroModal";
import MatchaMadnessTextRPG from "@/components/matcha-madness-text-rpg";
import CharacterSelection from "@/components/character-selection";
import FancyMocktailMenu from "@/components/FancyMocktailMenu";
import EventPanel from "@/components/EventPanel";
import SponsorStrip from "@/components/SponsorStrip";
import TicketButton from "@/components/TicketButton";

import type { Character } from "@/lib/character-data";

export default function Home() {
  // Use the soundtrack from the audio folder
  const audioSrc = "/audio/soundtrack.mp3";

  // Modal state
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showMocktailMenu, setShowMocktailMenu] = useState(false);
  const [showMatchaGame, setShowMatchaGame] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

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
        title="MatchaLikeIt's1999™" 
        subtitle={
          <div className="flex items-center justify-center space-x-6 text-xl font-bold font-mono tracking-tight">
            <button 
              onClick={handleEventDetailsClick} 
              className="text-green-800 hover:text-green-900 transition-colors px-4 py-2 border-2 border-green-600 bg-white/90 backdrop-blur-sm hover:bg-white/100 uppercase tracking-wider rounded relative overflow-hidden"
            >
              <span className="absolute top-0 left-0 right-0 h-1 bg-green-300/60 rounded-t"></span>
              🎉 Event: Kayan Festival × The Morning Party
            </button>
            <button 
              onClick={handleMocktailMenuClick} 
              className="text-green-800 hover:text-green-900 transition-colors px-4 py-2 border-2 border-green-600 bg-white/90 backdrop-blur-sm hover:bg-white/100 uppercase tracking-wider rounded relative overflow-hidden"
            >
              <span className="absolute top-0 left-0 right-0 h-1 bg-green-300/60 rounded-t"></span>
              🍸 Mocktail_Menu by TheWaterBar™
            </button>
            <button 
              onClick={handleMatchaGameClick} 
              className="text-green-800 hover:text-green-900 transition-colors px-4 py-2 border-2 border-green-600 bg-white/90 backdrop-blur-sm hover:bg-white/100 uppercase tracking-wider rounded relative overflow-hidden"
            >
              <span className="absolute top-0 left-0 right-0 h-1 bg-green-300/60 rounded-t"></span>
              🏎️ Matcha_Game: MatchaMadness
            </button>
          </div>
        }
        audioSrc={audioSrc} 
      />

      {/* Event Details Modal */}
      <RetroModal isOpen={showEventDetails} onClose={() => setShowEventDetails(false)} title="🎉 KAYAN FESTIVAL × THE MORNING PARTY">
        <div className="space-y-4">
          <EventPanel />
          <SponsorStrip />
          <TicketButton />
        </div>
      </RetroModal>

      {/* Welcome Modal with rotation notice */}
      <RetroModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} title="🎉 WELCOME TO KAYAN MATCHA MORNING PARTY">
        <div className="space-y-6 text-center p-4">
          <p className="text-xl font-mono text-green-300">For the best experience on mobile devices, please rotate to landscape mode.</p>
          <div className="flex justify-center py-4">
            <div className="animate-pulse text-green-400 text-4xl">📱 ↔️</div>
          </div>
          <button 
            onClick={() => setShowWelcomeModal(false)}
            className="px-6 py-2 bg-green-700 text-white font-mono rounded-lg hover:bg-green-600 transition-colors"
          >
            CONTINUE
          </button>
        </div>
      </RetroModal>

      {/* Mocktail Menu Modal */}
      <RetroModal 
        isOpen={showMocktailMenu} 
        onClose={() => setShowMocktailMenu(false)} 
        title="🍸 Matcha Mocktail Menu"
      >
        <div className="relative overflow-hidden">
          {/* Froothy top edge */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-200/70 rounded-t"></div>
          <FancyMocktailMenu />
        </div>
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
