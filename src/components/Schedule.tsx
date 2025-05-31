"use client"

export default function Schedule() {
  return (
    <section id="schedule" className="py-20 px-4 relative z-10 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">Event Schedule</h2>
        <p className="text-xl text-white/80">Your morning energy experience</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-green-500/50"></div>
          
          {/* Event 1 */}
          <div className="relative mb-12">
            <div className="flex flex-col md:flex-row items-start">
              <div className="flex md:w-1/2 md:justify-end mb-4 md:mb-0 md:pr-8">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-400/30 md:text-right">
                  <h3 className="text-xl font-bold text-green-400">11:00 AM</h3>
                  <h4 className="text-lg font-medium text-white">Event Start</h4>
                  <ul className="text-white/80 list-disc list-inside md:list-outside">
                    <li>Guest check-in</li>
                    <li>Distribution of 1 Matcha Drink Token</li>
                  </ul>
                </div>
              </div>
              
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-5 h-5 rounded-full bg-green-500"></div>
              
              <div className="md:w-1/2 md:pl-8"></div>
            </div>
          </div>
          
          {/* Event 2 */}
          <div className="relative mb-12">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/2 md:pr-8"></div>
              
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-5 h-5 rounded-full bg-green-500"></div>
              
              <div className="flex md:w-1/2 md:pl-8">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-400/30">
                  <h3 className="text-xl font-bold text-green-400">11:15 AM</h3>
                  <h4 className="text-lg font-medium text-white">Welcome & Opening</h4>
                  <ul className="text-white/80 list-disc list-inside">
                    <li>Opening speech on matcha benefits</li>
                    <li>Welcome drink distribution from Catcha Matcha</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Event 3 */}
          <div className="relative mb-12">
            <div className="flex flex-col md:flex-row items-start">
              <div className="flex md:w-1/2 md:justify-end mb-4 md:mb-0 md:pr-8">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-400/30 md:text-right">
                  <h3 className="text-xl font-bold text-green-400">ONGOING</h3>
                  <h4 className="text-lg font-medium text-white">Activations</h4>
                  <ul className="text-white/80 list-disc list-inside md:list-outside">
                    <li>DJ set</li>
                    <li>Matcha face masks (By Catcha Matcha)</li>
                    <li>Express massages (By Saante)</li>
                    <li>Electrolyte shots (By Oneshot)</li>
                    <li>Photobooth</li>
                  </ul>
                </div>
              </div>
              
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-5 h-5 rounded-full bg-green-500"></div>
              
              <div className="md:w-1/2 md:pl-8"></div>
            </div>
          </div>
          
          {/* Event 4 */}
          <div className="relative">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/2 md:pr-8"></div>
              
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-5 h-5 rounded-full bg-green-500"></div>
              
              <div className="flex md:w-1/2 md:pl-8">
                <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-green-400/30">
                  <h3 className="text-xl font-bold text-green-400">2:00 PM</h3>
                  <h4 className="text-lg font-medium text-white">Event Ends</h4>
                  <p className="text-white/80">With raffle winner announcement at 1:45 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
