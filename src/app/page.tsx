"use client";

import { useState } from "react";
import FluidEnergyField from "@/components/HalftoneWaves";
import AudioReactiveTitle from "@/components/AudioReactiveTitle";
import HolisticModal from "@/components/HolisticModal";
import WellnessBeverageMenu from "@/components/WellnessBeverageMenu";
import MatchaMadnessTextRPG from "@/components/matcha-madness-text-rpg";
import WellnessProfileSelection from "@/components/wellness-profile-selection";

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

      
      {/* Background fluid energy field animation */}
      <FluidEnergyField />
      
      {/* Audio-reactive title */}
      <AudioReactiveTitle 
        title="PARTY LIKE IT'S 1999" 
        subtitle={
          <div className="flex items-center justify-center space-x-8 text-xl font-bold font-sans tracking-tight">
            <button 
              onClick={handleEventDetailsClick} 
              className="text-white hover:text-blue-100 transition-all px-6 py-3 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 hover:from-blue-500/90 hover:to-indigo-600/90 backdrop-blur-md uppercase tracking-wider rounded-xl relative overflow-hidden shadow-lg shadow-indigo-500/20 border border-white/10"
            >
              <span className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-50"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-300/60 rounded"></span>
              💧 MORNING PARTY x THE ART OF IMPLOSION
            </button>
            <button 
              onClick={handleMocktailMenuClick} 
              className="text-white hover:text-purple-100 transition-all px-6 py-3 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500/90 hover:to-pink-500/90 backdrop-blur-md uppercase tracking-wider rounded-xl relative overflow-hidden shadow-lg shadow-pink-500/20 border border-white/10"
            >
              <span className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-50"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300/60 rounded"></span>
              🧪 THE WATER BAR ELIXERS
            </button>
            <button 
              onClick={handleMatchaGameClick} 
              className="text-white hover:text-teal-100 transition-all px-6 py-3 bg-gradient-to-r from-teal-600/80 to-cyan-700/80 hover:from-teal-500/90 hover:to-cyan-600/90 backdrop-blur-md uppercase tracking-wider rounded-xl relative overflow-hidden shadow-lg shadow-teal-500/20 border border-white/10"
            >
              <span className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-50"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-300/60 rounded"></span>
              ✨ THE JOHNY DAR ADVENTURE
            </button>
          </div>
        }
        audioSrc={audioSrc} 
      />

      {/* Event Details Modal */}
      <HolisticModal isOpen={showEventDetails} onCloseAction={() => setShowEventDetails(false)} title="💧 MORNING PARTY x THE ART OF IMPLOSION">
        <div className="text-slate-200 space-y-6 font-sans">
          <div className="text-center text-amber-300 text-2xl font-light tracking-wide">SUNDAY, JUNE 29 &apos;25</div>
          <div className="flex flex-col items-center space-y-3">
            <p>Join us for a transformative morning of</p>
            <p className="text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SONIC HEALING & WELLNESS</p>
            <p>presented by <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-medium">The Water Bar</span></p>
          </div>
          
          <div className="text-center my-6">
            <button className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-violet-600 transition-all duration-300">
              TICKET FREE - BOOKING LINK COMING SOON
            </button>
          </div>
          
          <div className="text-center italic text-slate-300 bg-slate-800/50 p-4 rounded-lg">
            &quot;Wake up, hydrate, transform – your wellness journey begins @ 11:00 AM.&quot;
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-violet-900/20 rounded-xl p-5 shadow-md backdrop-blur-sm border border-violet-500/20">
              <h3 className="text-xl text-violet-300 font-medium">TUNE</h3>
              <div className="text-violet-200 text-lg">🔮 AOI Dome Frequency Bath</div>
              <div className="text-slate-300 mt-3">
                Light-sound immersion at 528hz<br/>
                Recharge your nervous system & align with your energy field
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-cyan-900/20 rounded-xl p-5 shadow-md backdrop-blur-sm border border-cyan-500/20">
              <h3 className="text-xl text-cyan-300 font-medium">GROUND</h3>
              <div className="text-cyan-200 text-lg">🌎 Solarium Rest Chamber</div>
              <div className="text-slate-300 mt-3">
                Recline, realign, restore. Lay-flat zone for full-body restoration<br/>
                Earth pulse meets ambient tonewaves.
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-orange-900/20 rounded-xl p-5 shadow-md backdrop-blur-sm border border-orange-500/20">
              <h3 className="text-xl text-orange-300 font-medium">HEAT</h3>
              <div className="text-orange-200 text-lg">🔥 Infrared Sauna Lounge</div>
              <div className="text-slate-300 mt-3">
                Cellular renewal through infrared heat - guided session with binaural sound<br/>
                Personalized intensity levels based on your body&apos;s response.
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/20 rounded-xl p-5 shadow-md backdrop-blur-sm border border-blue-500/20">
              <h3 className="text-xl text-blue-300 font-medium">REBOOT</h3>
              <div className="text-blue-200 text-lg">🧊 AOI Ice Ritual Station</div>
              <div className="text-slate-300 mt-3">
                Breath-guided plunge to recalibrate your nervous system<br/>
                Optional guided visualization, cold therapy, and biometric tracking.
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/20 rounded-xl p-5 mt-6 shadow-md backdrop-blur-sm border border-emerald-500/20">
            <h3 className="text-xl text-emerald-300 font-medium">WELLNESS TOOLS</h3>
            <div className="text-slate-200 mt-2">
              PranaPulse-Code:<br/>
              <span className="text-slate-300">
                A proprietary 528hz light and sound protocol developed through two decades of research integrating ancient healing wisdom with cutting-edge quantum science.
              </span>
            </div>
          </div>
        </div>
      </HolisticModal>

      {/* Welcome Modal with rotation notice */}
      <HolisticModal isOpen={showWelcomeModal} onCloseAction={() => setShowWelcomeModal(false)} title="✨ WELCOME TO THE FUTURE OF WELLNESS">
        <div className="space-y-8 text-center p-6">
          <p className="text-xl text-slate-200">For the optimal experience on mobile devices, please rotate to landscape orientation.</p>
          <div className="flex justify-center py-4">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20H20" stroke="#76E4FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 4H20" stroke="#76E4FF" strokeWidth="2" strokeLinecap="round" />
              <rect x="7" y="8" width="10" height="8" rx="1" stroke="#76E4FF" strokeWidth="2" />
            </svg>
          </div>
          <button 
            onClick={() => setShowWelcomeModal(false)} 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-full hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30">
            BEGIN JOURNEY
          </button>
        </div>
      </HolisticModal>

      {/* Mocktail Menu Modal */}
      <HolisticModal 
        isOpen={showMocktailMenu} 
        onCloseAction={() => setShowMocktailMenu(false)} 
        title="🧪 THE WATER BAR ELIXERS"
      >
        <div className="relative overflow-hidden">
          {/* Subtle water edge animation */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 rounded-t opacity-70"></div>
          <WellnessBeverageMenu />
        </div>
      </HolisticModal>

      {/* Matcha Madness Game Modal */}
      <HolisticModal 
        isOpen={showMatchaGame} 
        onCloseAction={handleCloseMatchaGame} 
        title={selectedCharacter ? `✨ THE JOHNY DAR ADVENTURE: ${selectedCharacter.name}` : "✨ THE JOHNY DAR ADVENTURE"}
      >
        {!selectedCharacter ? (
          <WellnessProfileSelection onCharacterSelectAction={setSelectedCharacter} />
        ) : (
          <MatchaMadnessTextRPG selectedCharacter={selectedCharacter} />
        )}
      </HolisticModal>
    </main>
  );
}
