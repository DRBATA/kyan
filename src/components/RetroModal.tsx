"use client"

import { useEffect, ReactNode } from 'react'

interface RetroModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function RetroModal({ isOpen, onClose, children, title }: RetroModalProps) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-black border-2 border-green-500">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between bg-green-900 p-2 border-b border-green-500 sticky top-0 z-10">
          {title && (
            <h2 className="text-green-300 text-xl uppercase tracking-wider px-2">{">"}  {title}</h2>
          )}
          <button 
            onClick={onClose}
            className="px-3 py-1 bg-black text-green-400 border border-green-500 hover:bg-green-950 hover:text-green-300"
          >
            [X]
          </button>
        </div>
        
        {/* Modal content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
