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
            <p>Join us for a transformative experience of</p>
            <p className="text-xl font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FREQUENCY CALIBRATION & HOLISTIC WELLNESS</p>
            <p>presented by <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent font-medium">The Water Bar × The Art of Implosion</span></p>
          </div>
          
          <div className="text-center my-6">
            <a href="https://www.thewater.bar" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-violet-600 transition-all duration-300 inline-block">
              BOOK YOUR FREQUENCY SESSION NOW
            </a>
          </div>
          
          <div className="text-center italic text-slate-300 bg-slate-800/50 p-4 rounded-lg">
            &quot;Wake up, hydrate, transform – your wellness journey begins @ 11:00 AM.&quot;
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-[#f2f3f7]/20 rounded-xl p-5 shadow-md backdrop-blur-sm border border-[#f2f3f7]/30">
              <h3 className="text-xl text-[#f2f3f7] font-medium">AOI ICE</h3>
              <div className="text-[#f2f3f7]/90 text-lg">🧊 The Hydration Well</div>
              <div className="text-slate-300 mt-2">
                Cold immersion to stabilize your field and reset your frequency baseline. Begin your journey with clarity and grounding.
              </div>
              <div className="mt-4 text-right text-[#f2f3f7] font-semibold">150 AED</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-[#d19747]/30 rounded-xl p-5 shadow-md backdrop-blur-sm border border-[#d19747]/30">
              <h3 className="text-xl text-[#d19747] font-medium">AOI EARTH</h3>
              <div className="text-[#d19747]/90 text-lg">🛏️ 🎵 The Sound Altar</div>
              <div className="text-slate-300 mt-2">
                Lie down in harmonic sound and light. This deep resonance clears emotional blocks and restores energetic flow.
              </div>
              <div className="mt-4 text-right text-[#d19747] font-semibold">600 AED</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-[#05abc4]/30 rounded-xl p-5 shadow-md backdrop-blur-sm border border-[#05abc4]/30">
              <h3 className="text-xl text-[#05abc4] font-medium">AOI AIR</h3>
              <div className="text-[#05abc4]/90 text-lg">✨ 🎵 The Light Vault</div>
              <div className="text-slate-300 mt-2">
                Step into a vertical stream of light and frequency. Designed to recalibrate your system and activate cellular harmony.
              </div>
              <div className="mt-4 text-right text-[#05abc4] font-semibold">400 AED</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-[#061bb0]/30 rounded-xl p-5 shadow-md backdrop-blur-sm border border-[#061bb0]/30">
              <h3 className="text-xl text-[#061bb0] font-medium">AOI AIR PRO</h3>
              <div className="text-[#061bb0]/90 text-lg">✨ 🎵 The Frequency Gateway</div>
              <div className="text-slate-300 mt-2">
                A stand‑up experience that energizes and recharges using a targeted blend of light and sound. Fast, effective, elevating.
              </div>
              <div className="mt-4 text-right text-[#061bb0] font-semibold">500 AED</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-[#b1a1ed]/30 rounded-xl p-5 shadow-md backdrop-blur-sm border border-[#b1a1ed]/30">
              <h3 className="text-xl text-[#b1a1ed] font-medium">AOI FLOAT</h3>
              <div className="text-[#b1a1ed]/90 text-lg">🧊 The Resonance Chamber</div>
              <div className="text-slate-300 mt-2">
                Float weightlessly in silence and frequency. Deep theta states open the door to nervous system recovery and expanded awareness.
              </div>
              <div className="mt-4 text-right text-[#b1a1ed] font-semibold">150 AED</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-[#ed5f1e]/30 rounded-xl p-5 shadow-md backdrop-blur-sm border border-[#ed5f1e]/30">
              <h3 className="text-xl text-[#ed5f1e] font-medium">AOI HEAT</h3>
              <div className="text-[#ed5f1e]/90 text-lg">🔥 The Sweat Code</div>
              <div className="text-slate-300 mt-2">
                A dry sauna experience to release toxins and tension. Allow the heat to purify your body and prepare your field for integration.
              </div>
              <div className="mt-4 text-right text-[#ed5f1e] font-semibold">100 AED</div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800/50 to-amber-600/20 rounded-xl p-5 shadow-md backdrop-blur-sm border border-amber-500/20 md:col-span-2 lg:col-span-3">
              <h3 className="text-xl text-amber-400 font-medium">AOI TOUCH</h3>
              <div className="text-amber-300 text-lg">👐 The Meridian Massage</div>
              <div className="text-slate-300 mt-2">
                A tailored massage and reflexology session that releases tension along your body&apos;s energy meridians, restoring flow, balance, and deep-rooted relaxation.
              </div>
              <div className="mt-4 text-right text-amber-400 font-semibold">230 AED</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/20 rounded-xl p-5 mt-6 shadow-md backdrop-blur-sm border border-emerald-500/20">
            <h3 className="text-xl text-emerald-300 font-medium">THE ART OF IMPLOSION</h3>
            <div className="text-slate-200 mt-2 flex flex-col space-y-2">
              <p>
                <span className="text-emerald-200 font-semibold">Frequency Calibration Technology:</span>
                <span className="text-slate-300 ml-2">
                  A proprietary light and sound protocol developed through two decades of research, integrating ancient healing wisdom with cutting-edge quantum science.
                </span>
              </p>
              <p className="text-center text-white/80 mt-4 italic">
                &quot;Experience the future of wellness through the power of frequency, light and sound.&quot;
              </p>
              <div className="text-center mt-4">
                <a href="https://www.thewater.bar" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-medium rounded-full hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
                  BOOK YOUR FREQUENCY EXPERIENCE
                </a>
              </div>
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
