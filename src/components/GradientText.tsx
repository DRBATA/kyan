import React from 'react';

export interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'water-bar' | 'cosmic' | 'earth' | 'fire';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  align?: 'left' | 'center' | 'right';
  className?: string;
};

/**
 * GradientText component for beautiful translucent gradient text effects
 * Used to provide consistent, stylish text elements across the application
 */
const GradientText: React.FC<GradientTextProps> = ({
  children,
  variant = 'water-bar',
  size = 'md',
  align = 'center',
  className = '',
}) => {
  // Base text size and style classes
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };
  
  // Text alignment
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  // Gradient variants
  const gradientClasses = {
    'water-bar': 'bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-300 bg-clip-text text-transparent',
    'cosmic': 'bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent',
    'earth': 'bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300 bg-clip-text text-transparent',
    'fire': 'bg-gradient-to-r from-rose-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent',
  };
  
  return (
    <div 
      className={`font-light tracking-wider ${sizeClasses[size]} ${alignClasses[align]} ${gradientClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default GradientText;
