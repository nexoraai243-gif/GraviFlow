import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const GraviFlowLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', text: 'text-base' },
    md: { box: 'w-10 h-10', text: 'text-xl' },
    lg: { box: 'w-14 h-14', text: 'text-2xl' },
    xl: { box: 'w-20 h-20', text: 'text-4xl' }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Floating Pregnant Mother Character / Boneco de Grávida */}
      <div
        className={`${sizeMap[size].box} rounded-2xl bg-gradient-to-tr from-[#7D2347] via-[#A83260] to-[#E878A0] p-1.5 flex items-center justify-center text-white shadow-lg shadow-rose-900/30 animate-float-pregnant relative`}
        title="GraviFlow — Mãe Grávida"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-2xl bg-pink-500/20 blur-sm pointer-events-none" />

        {/* Pregnant Mother Silhouette SVG */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white drop-shadow-md"
        >
          {/* Head & elegant hair flow */}
          <circle cx="24" cy="9" r="5" fill="currentColor" />
          <path
            d="M20 10C17 12 15 16 16 20C17 17 19 14 22 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Torso & Pregnant Belly with caring arm */}
          <path
            d="M21 16C19 19 18 24 18 29C18 36 21 42 24 43"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Distinctive, tender Pregnant Belly Contour */}
          <path
            d="M23 18C28 20 33 24 33 30C33 35 29 40 24 42"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Loving Hand cradling the baby bump */}
          <path
            d="M20 22C23 23 27 26 29 30C29.5 31.5 28.5 33 26 33C24 33 21 31 19 28"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Gentle heart glow inside the womb */}
          <path
            d="M26 28.5C26 27.5 27 26.5 28 27.5C29 26.5 30 27.5 30 28.5C30 30 28 31 28 31C28 31 26 30 26 28.5Z"
            fill="#FFF0F5"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif-accent font-bold tracking-tight text-[#2D1B24] dark:text-[#FFF0F5] ${sizeMap[size].text}`}
            >
              GraviFlow
            </span>
            <span className="text-[10px] font-sans font-extrabold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0] bg-[#FCEEF3] dark:bg-[#2C1421] px-1.5 py-0.5 rounded-md">
              AO
            </span>
          </div>
          <span className="text-[10px] text-[#6B5560] dark:text-[#D1B6C4] font-medium leading-none">
            Cuidado em cada fase
          </span>
        </div>
      )}
    </div>
  );
};
