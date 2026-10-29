import React from 'react';

interface MaeSerenaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export const MaeSerenaLogo: React.FC<MaeSerenaLogoProps> = ({
  size = 'md',
  showTagline = false,
  animated = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-18 h-18', text: 'text-3xl', sub: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon: Stylized Maternal Silhouette (Boneco de Grávida) + Glowing Womb & Floating Animation */}
      <div
        className={`relative ${currentSize.icon} shrink-0 transition-transform hover:scale-110 duration-300 ${
          animated ? 'animate-float-pregnant' : ''
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="maeSerenaRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C44376" />
              <stop offset="50%" stopColor="#A83260" />
              <stop offset="100%" stopColor="#70213F" />
            </linearGradient>
            <linearGradient id="maeSerenaBlush" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF5F8" />
              <stop offset="100%" stopColor="#F8E7ED" />
            </linearGradient>
            <filter id="wombGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF2E93" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outer Protective Organic Circle with soft shimmer */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="url(#maeSerenaBlush)"
            stroke="#A83260"
            strokeWidth="2.5"
            strokeOpacity="0.35"
          />

          {/* Mother's Head with caring slight tilt */}
          <circle cx="48" cy="28" r="9" fill="url(#maeSerenaRose)" />

          {/* Loving Maternal Curved Silhouette Embracing Pregnancy Belly */}
          <path
            d="M 40 38 C 34 46 33 66 44 77 C 54 86 68 84 73 74 C 77 64 75 53 66 46 C 60 42 54 42 48 38"
            stroke="url(#maeSerenaRose)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Glowing Womb Center (The Baby / Heart with Heartbeat Pulse) */}
          <g filter="url(#wombGlow)" className="animate-pulse">
            <circle cx="53" cy="61" r="7.5" fill="#A83260" />
            <path
              d="M 50 60 C 50 58 52 56 54 56 C 56 56 57 58 57 60 C 57 63 53.5 65 53.5 65 C 53.5 65 50 63 50 60 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Tiny stylized 2-tone wellness capsule mascot accent */}
          <g transform="translate(63, 22) rotate(35) scale(0.18)">
            <rect x="0" y="0" width="40" height="40" rx="20" fill="#A83260" />
            <rect x="0" y="40" width="40" height="40" rx="20" fill="#FFFFFF" stroke="#A83260" strokeWidth="4" />
          </g>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-serif-accent font-bold tracking-tight text-[#70213F] dark:text-[#FFF5F8] ${currentSize.text}`}>
            GraviFlow
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#A83260] animate-ping" />
        </div>
        {showTagline ? (
          <span className={`text-[#796A72] dark:text-[#C8B8C1] font-medium leading-none mt-0.5 ${currentSize.sub}`}>
            A tua gravidez, acompanhada com carinho
          </span>
        ) : (
          <span className={`text-[#A83260] dark:text-[#E878A0] font-bold uppercase tracking-wider leading-none mt-0.5 ${currentSize.sub}`}>
            Angola
          </span>
        )}
      </div>
    </div>
  );
};
