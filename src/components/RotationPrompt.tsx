import React, { useEffect, useState } from 'react';

interface RotationPromptProps {
  onDismiss?: () => void;
}

export default function RotationPrompt({ onDismiss }: RotationPromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    };

    // Check if orientation is portrait
    const checkOrientation = () => {
      return window.innerHeight > window.innerWidth;
    };

    const updateState = () => {
      const mobile = checkMobile();
      const portrait = checkOrientation();
      
      setIsMobile(mobile);
      setIsPortrait(portrait);
      setIsVisible(mobile && portrait);
    };

    // Initial check
    updateState();

    // Listen for orientation changes
    window.addEventListener('resize', updateState);
    window.addEventListener('orientationchange', updateState);

    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-bounce mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 rotate-90">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12" y2="18.01"></line>
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold text-green-400 mb-4 font-mono">ROTATE YOUR DEVICE</h2>
      
      <p className="text-green-300 mb-6 text-lg font-mono">
        For the best matcha time-travel experience, please:
      </p>
      
      <div className="flex flex-col gap-4 mb-8 text-xl font-mono">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">📱</span>
          <span className="text-green-300">Rotate to landscape mode</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🔊</span>
          <span className="text-green-300">Turn on your sound</span>
        </div>
      </div>
      
      <button 
        onClick={() => {
          setIsVisible(false);
          if (onDismiss) onDismiss();
        }}
        className="px-6 py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg font-mono transition-colors"
      >
        CONTINUE ANYWAY
      </button>
    </div>
  );
}
