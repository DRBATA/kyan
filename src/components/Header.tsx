"use client"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-20 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          TMP<span className="text-green-400">99</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#schedule" className="text-white hover:text-green-400 transition-colors">Schedule</a>
          <a href="#benefits" className="text-white hover:text-green-400 transition-colors">Benefits</a>
          <a href="#talent" className="text-white hover:text-green-400 transition-colors">Talent</a>
          <a href="#partners" className="text-white hover:text-green-400 transition-colors">Partners</a>
        </nav>
        
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
          Get Tickets
        </button>
      </div>
    </header>
  )
}
