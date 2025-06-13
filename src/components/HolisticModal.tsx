"use client"

import { useEffect, ReactNode } from 'react'

interface HolisticModalProps {
  isOpen: boolean
  onCloseAction: () => void
  children: ReactNode
  title?: string
}

export default function HolisticModal({ isOpen, onCloseAction, children, title }: HolisticModalProps) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseAction()
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
  }, [isOpen, onCloseAction])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md font-sans">
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl"
        style={{
          background: 'linear-gradient(to bottom right, rgba(16, 24, 39, 0.97), rgba(17, 24, 39, 0.93))',
          boxShadow: '0 25px 50px -12px rgba(0, 180, 216, 0.25), 0 0 0 1px rgba(76, 201, 240, 0.1)'
        }}
      >
        {/* Header with title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 sticky top-0 z-10 backdrop-blur-sm bg-slate-900/50">
          {title && (
            <h2 className="text-xl font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          <button 
            onClick={onCloseAction}
            className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Modal content with subtle glass effect */}
        <div className="p-6 bg-gradient-to-b from-transparent to-slate-800/30">
          {children}
        </div>
      </div>
    </div>
  )
}
