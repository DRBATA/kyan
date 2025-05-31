"use client"
import Image from "next/image"

// Using the actual logo files from the /logos directory
const sponsors = [
  { id: "powder", src: "/logos/powder.png", alt: "Powder Beauty" },
  { id: "sante", src: "/logos/sante.png", alt: "Sante Self-Care" },
  { id: "valeo",  src: "/logos/valeo.png",  alt: "Valeo Supplements" },
]

const SponsorStrip = () => (
  <div className="border-2 border-[#00FF6A] bg-[#FAFAFA] rounded-md p-8 mb-4 flex flex-wrap justify-center gap-6">
    <div className="w-full text-center mb-4 text-[#00C54F] font-mono text-sm">
      OUR AMAZING PARTNERS
    </div>
    {sponsors.map((sp) => (
      <div key={sp.id} className="relative w-80 h-32 transition-all duration-300 hover:scale-105">
        <Image src={sp.src} alt={sp.alt} fill style={{ objectFit: "contain" }} />
      </div>
    ))}
  </div>
)

export default SponsorStrip
