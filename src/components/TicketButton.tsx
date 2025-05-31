"use client"
import Link from "next/link"

const TicketButton = () => (
  <div className="text-center mb-6">
    <Link
      href="https://www.eventbrite.com/e/the-morning-party-tickets-123456789"
      target="_blank"
      className="inline-block border-2 border-[#00FF6A] bg-[#00C54F] hover:bg-[#7AAA5D] text-white font-mono font-bold px-8 py-3 rounded-md shadow-lg transition-all duration-300 hover:scale-105"
    >
      🎟️  BUY TICKET — 150 AED
    </Link>
  </div>
)

export default TicketButton
