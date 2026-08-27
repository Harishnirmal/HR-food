import React from 'react';

interface HariLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  lightMode?: boolean;
  className?: string;
}

export const HariLogo: React.FC<HariLogoProps> = ({
  size = 'md',
  variant = 'full',
  lightMode = false,
  className = '',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-base',
    md: 'w-9 h-9 sm:w-11 sm:h-11 text-xl',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 text-2xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-4xl',
  };

  const titleSizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const subtitleSizeClasses = {
    sm: 'text-[8px] sm:text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const iconElement = (
    <div
      className={`relative ${iconSizeClasses[size]} rounded-2xl bg-gradient-to-br from-[#941B1B] via-[#781212] to-[#EA580C] p-0.5 shadow-md flex items-center justify-center border border-[#F59E0B]/50 group-hover:scale-105 transition-transform duration-200 shrink-0`}
    >
      {/* Inner background shield */}
      <div className="w-full h-full rounded-[14px] bg-[#8B1818] flex items-center justify-center relative overflow-hidden">
        {/* Subtle decorative gold rays background */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#F59E0B] via-transparent to-transparent" />
        
        {/* Golden Royal Crest H Icon */}
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 text-[#FBBF24] drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flame / Crown on Top */}
          <path
            d="M50 8 C48 18 40 23 45 30 C47 25 53 25 55 20 C57 26 62 25 61 31 C67 24 55 12 50 8Z"
            fill="#F59E0B"
          />
          {/* Left Vertical Pillar */}
          <path
            d="M28 28 H38 V74 H28 Z"
            fill="#FDEEE4"
            rx="2"
          />
          {/* Left Top & Bottom Accents */}
          <path d="M24 28 H42 V32 H24 Z" fill="#F59E0B" />
          <path d="M24 70 H42 V74 H24 Z" fill="#F59E0B" />

          {/* Right Vertical Pillar */}
          <path
            d="M62 28 H72 V74 H62 Z"
            fill="#FDEEE4"
            rx="2"
          />
          {/* Right Top & Bottom Accents */}
          <path d="M58 28 H76 V32 H58 Z" fill="#F59E0B" />
          <path d="M58 70 H76 V74 H58 Z" fill="#F59E0B" />

          {/* Golden Center Crossbar with Spiced Diamond */}
          <path
            d="M36 47 H64 V55 H36 Z"
            fill="#F59E0B"
          />
          <polygon
            points="50,42 57,51 50,60 43,51"
            fill="#EA580C"
            stroke="#FDEEE4"
            strokeWidth="1.5"
          />

          {/* Traditional Leaf Filigree on bottom */}
          <path
            d="M32 82 C42 80 46 86 50 88 C54 86 58 80 68 82 C59 86 54 92 50 92 C46 92 41 86 32 82 Z"
            fill="#F59E0B"
          />
        </svg>
      </div>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-block ${className}`}>{iconElement}</div>;
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#941B1B] text-white border border-[#F59E0B]/40 shadow-sm ${className}`}
      >
        <div className="w-7 h-7 rounded-lg bg-[#EA580C] text-white font-serif font-black flex items-center justify-center text-sm shadow-xs">
          H
        </div>
        <div className="text-left">
          <p className="font-serif font-bold text-sm tracking-wide text-[#FDEEE4] leading-none">
            HARI
          </p>
          <p className="text-[9px] text-stone-300 uppercase tracking-wider leading-none mt-0.5">
            Non-Veg & Veg
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {iconElement}
      <div className="text-left min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span
            className={`font-serif ${titleSizeClasses[size]} font-bold tracking-tight ${
              lightMode ? 'text-white' : 'text-[#231815]'
            } transition-colors`}
          >
            HARI
          </span>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-gradient-to-r from-[#941B1B] to-[#EA580C] text-white shrink-0 shadow-2xs">
            Kitchen
          </span>
        </div>
        <p
          className={`${subtitleSizeClasses[size]} font-semibold tracking-wide uppercase ${
            lightMode ? 'text-[#FDEEE4]' : 'text-[#826A62]'
          } hidden sm:block truncate`}
        >
          Authentic Non-Veg & Veg Delicacies
        </p>
      </div>
    </div>
  );
};
