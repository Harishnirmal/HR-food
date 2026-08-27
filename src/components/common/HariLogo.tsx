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
    sm: 'w-8 h-8 text-base',
    md: 'w-11 h-11 text-xl',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl',
  };

  const titleSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  };

  const subtitleSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const iconElement = (
    <div
      className={`relative ${iconSizeClasses[size]} rounded-2xl bg-gradient-to-br from-[#183928] via-[#0F281C] to-[#C85A32] p-0.5 shadow-md flex items-center justify-center border border-[#E6C687]/50 group-hover:scale-105 transition-transform duration-200 shrink-0`}
    >
      {/* Inner background shield */}
      <div className="w-full h-full rounded-[14px] bg-[#143223] flex items-center justify-center relative overflow-hidden">
        {/* Subtle decorative gold rays background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#E6C687] via-transparent to-transparent" />
        
        {/* Golden Royal Crest H Icon */}
        <svg
          viewBox="0 0 100 100"
          className="w-4/5 h-4/5 text-[#E6C687] drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flame / Crown on Top */}
          <path
            d="M50 8 C48 18 40 23 45 30 C47 25 53 25 55 20 C57 26 62 25 61 31 C67 24 55 12 50 8Z"
            fill="#E6C687"
          />
          {/* Left Vertical Pillar */}
          <path
            d="M28 28 H38 V74 H28 Z"
            fill="#F3DFA2"
            rx="2"
          />
          {/* Left Top & Bottom Accents */}
          <path d="M24 28 H42 V32 H24 Z" fill="#E6C687" />
          <path d="M24 70 H42 V74 H24 Z" fill="#E6C687" />

          {/* Right Vertical Pillar */}
          <path
            d="M62 28 H72 V74 H62 Z"
            fill="#F3DFA2"
            rx="2"
          />
          {/* Right Top & Bottom Accents */}
          <path d="M58 28 H76 V32 H58 Z" fill="#E6C687" />
          <path d="M58 70 H76 V74 H58 Z" fill="#E6C687" />

          {/* Golden Center Crossbar with Spiced Diamond */}
          <path
            d="M36 47 H64 V55 H36 Z"
            fill="#E6C687"
          />
          <polygon
            points="50,42 57,51 50,60 43,51"
            fill="#C85A32"
            stroke="#F3DFA2"
            strokeWidth="1.5"
          />

          {/* Traditional Leaf Filigree on bottom */}
          <path
            d="M32 82 C42 80 46 86 50 88 C54 86 58 80 68 82 C59 86 54 92 50 92 C46 92 41 86 32 82 Z"
            fill="#E6C687"
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
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#183928] text-white border border-[#E6C687]/40 shadow-sm ${className}`}
      >
        <div className="w-7 h-7 rounded-lg bg-[#E6C687] text-[#183928] font-serif font-black flex items-center justify-center text-sm shadow-xs">
          H
        </div>
        <div className="text-left">
          <p className="font-serif font-bold text-sm tracking-wide text-[#F3DFA2] leading-none">
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
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {iconElement}
      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif ${titleSizeClasses[size]} font-bold tracking-tight ${
              lightMode ? 'text-white' : 'text-[#1E2420]'
            } transition-colors`}
          >
            HARI
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#C85A32] text-white">
            Kitchen
          </span>
        </div>
        <p
          className={`${subtitleSizeClasses[size]} font-medium tracking-wide uppercase ${
            lightMode ? 'text-[#C5D6CC]' : 'text-[#7D6E5F]'
          }`}
        >
          Authentic Non-Veg & Veg Delicacies
        </p>
      </div>
    </div>
  );
};
