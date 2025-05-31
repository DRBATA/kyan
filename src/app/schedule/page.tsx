"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HalftoneWaves from "@/components/HalftoneWaves";

export default function SchedulePage() {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState("friday");

  const schedule = {
    friday: [
      { time: "7:00 - 8:00", event: "Morning Yoga & Meditation", location: "Zen Garden" },
      { time: "8:30 - 10:00", event: "Matcha Tasting Experience", location: "Main Pavilion" },
      { time: "10:30 - 12:00", event: "Wellness Workshop", location: "Workshop Studio" },
      { time: "12:30 - 14:00", event: "Organic Lunch", location: "Food Court" },
      { time: "14:30 - 16:00", event: "DJ Set: Ambient Vibes", location: "Garden Stage" },
      { time: "16:30 - 18:00", event: "Mocktail Masterclass", location: "Mixology Lab" },
      { time: "19:00 - 21:00", event: "Sunset Party", location: "Main Stage" },
    ],
    saturday: [
      { time: "7:00 - 8:00", event: "Sunrise Stretch Session", location: "Hilltop" },
      { time: "8:30 - 10:00", event: "Ceremonial Matcha Ritual", location: "Tea House" },
      { time: "10:30 - 12:00", event: "Sound Healing", location: "Acoustic Dome" },
      { time: "12:30 - 14:00", event: "Plant-Based Feast", location: "Food Court" },
      { time: "14:30 - 16:00", event: "Live Band: Green Harmony", location: "Main Stage" },
      { time: "16:30 - 18:00", event: "Art & Tea Workshop", location: "Creative Studio" },
      { time: "19:00 - 22:00", event: "Main Event: The Morning Party", location: "Festival Grounds" },
    ],
    sunday: [
      { time: "8:00 - 9:00", event: "Gentle Morning Flow", location: "Meadow" },
      { time: "9:30 - 11:00", event: "Farmers Market", location: "Market Square" },
      { time: "11:30 - 13:00", event: "Closing Ceremony", location: "Main Pavilion" },
      { time: "13:30 - 15:00", event: "Community Picnic", location: "Picnic Area" },
      { time: "15:30 - 17:00", event: "Farewell Set: Chill Vibes", location: "Garden Stage" },
    ],
  };

  return (
    <main className="min-h-screen bg-black overflow-x-hidden flex flex-col items-center relative pt-8 pb-16">
      {/* Background animation */}
      <HalftoneWaves />
      
      <div className="z-10 w-full max-w-4xl px-4">
        <button 
          onClick={() => router.push('/')}
          className="mb-8 px-4 py-2 bg-black/50 border border-white/30 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          &larr; Back to Home
        </button>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-center">
          Event Schedule
        </h1>
        
        <div className="flex justify-center mb-8 gap-4">
          {['friday', 'saturday', 'sunday'].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-full text-white font-medium transition-all
                ${activeDay === day 
                  ? 'bg-gradient-to-r from-green-500 to-teal-600 shadow-lg' 
                  : 'bg-black/50 border border-white/30'}`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 overflow-hidden">
          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full text-white">
              <thead className="border-b border-white/20">
                <tr>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Event</th>
                  <th className="py-3 px-4 text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {schedule[activeDay].map((item, index) => (
                  <tr 
                    key={index}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-green-300">{item.time}</td>
                    <td className="py-4 px-4 font-medium">{item.event}</td>
                    <td className="py-4 px-4 text-white/70">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
