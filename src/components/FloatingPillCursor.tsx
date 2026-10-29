import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, X, Heart, Shield } from 'lucide-react';

interface FloatingPillCursorProps {
  enabled?: boolean;
}

export const FloatingPillCursor: React.FC<FloatingPillCursorProps> = ({ enabled = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasInteractedMobile, setHasInteractedMobile] = useState(false);

  // Position and physics refs for high 60fps performance without React re-renders
  const mousePos = useRef({ x: -200, y: -200 });
  const pillPos = useRef({ x: -200, y: -200 });
  const velocity = useRef({ x: 0, y: 0 });
  const targetAngle = useRef(0);
  const currentAngle = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const idleTime = useRef(0);

  // Check device and accessibility preferences
  useEffect(() => {
    const checkTouch = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
      setIsMobile(isTouch);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleReducedMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleReducedMotion);

    checkTouch();
    window.addEventListener('resize', checkTouch);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion);
      window.removeEventListener('resize', checkTouch);
    };
  }, []);

  // Desktop mouse movement & interactive hovering tracking
  useEffect(() => {
    if (isMobile || reducedMotion || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Detect if user is hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button, a, input, select, textarea, [data-interactive="true"], [role="button"]')
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation physics loop
    const animate = () => {
      idleTime.current += 0.03;

      // Spring lerp towards cursor with slight offset
      const targetX = mousePos.current.x + 24;
      const targetY = mousePos.current.y - 20;

      const dx = targetX - pillPos.current.x;
      const dy = targetY - pillPos.current.y;

      velocity.current.x = dx * 0.14;
      velocity.current.y = dy * 0.14;

      pillPos.current.x += velocity.current.x;
      pillPos.current.y += velocity.current.y;

      // Calculate movement angle & tilt
      const speed = Math.hypot(velocity.current.x, velocity.current.y);
      if (speed > 0.5) {
        targetAngle.current = (Math.atan2(velocity.current.y, velocity.current.x) * 180) / Math.PI - 45;
      } else {
        // Subtle sinusoidal idle float when resting
        targetAngle.current = -35 + Math.sin(idleTime.current * 1.5) * 8;
      }

      // Smooth angle interpolation
      const diff = targetAngle.current - currentAngle.current;
      currentAngle.current += diff * 0.1;

      // Apply transform directly to DOM element for pure 60fps performance
      if (containerRef.current) {
        const idleBob = Math.sin(idleTime.current * 2) * 5;
        const scale = isHoveringInteractive ? 1.18 : 1;

        containerRef.current.style.transform = `translate3d(${pillPos.current.x}px, ${pillPos.current.y + idleBob}px, 0) rotate(${currentAngle.current}deg) scale(${scale})`;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isMobile, reducedMotion, enabled, isHoveringInteractive]);

  if (!enabled || reducedMotion) return null;

  // Render 3D SVG Capsule Pill
  const renderCapsuleSvg = () => (
    <svg
      viewBox="0 0 100 200"
      className="w-10 h-20 drop-shadow-[0_12px_24px_rgba(112,33,63,0.35)] transition-all duration-300"
      aria-hidden="true"
    >
      <defs>
        {/* Deep Rose Gradient (Upper Half) */}
        <linearGradient id="roseCapsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C44376" />
          <stop offset="40%" stopColor="#A83260" />
          <stop offset="100%" stopColor="#70213F" />
        </linearGradient>

        {/* Pure & Warm White Gradient (Lower Half) */}
        <linearGradient id="whiteCapsuleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFF2F6" />
          <stop offset="100%" stopColor="#E5C7D3" />
        </linearGradient>

        {/* Specular Highlight Gloss */}
        <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Middle Band Gold Accent */}
        <linearGradient id="goldBand" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D0A9" />
          <stop offset="50%" stopColor="#ECC499" />
          <stop offset="100%" stopColor="#D9A066" />
        </linearGradient>
      </defs>

      {/* Pill Outer Shadow / Glow */}
      <filter id="pillGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#70213F" floodOpacity="0.25" />
      </filter>

      <g filter="url(#pillGlow)">
        {/* UPPER HALF (Deep Rose Dome) */}
        <path
          d="M 12 100 L 12 50 A 38 38 0 0 1 88 50 L 88 100 Z"
          fill="url(#roseCapsuleGrad)"
        />

        {/* LOWER HALF (Warm White Dome) */}
        <path
          d="M 12 100 L 12 150 A 38 38 0 0 0 88 150 L 88 100 Z"
          fill="url(#whiteCapsuleGrad)"
        />

        {/* CENTER DIVISION RING / SEAM */}
        <line
          x1="12"
          y1="100"
          x2="88"
          y2="100"
          stroke="#70213F"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* MATERNAL EMBLEM / LOGO DETAIL ON CAPSULE */}
        <circle cx="50" cy="70" r="14" fill="rgba(255,255,255,0.15)" />
        <path
          d="M 44 68 C 44 64 47 62 50 62 C 53 62 56 64 56 68 C 56 74 50 78 50 78 C 50 78 44 74 44 68 Z"
          fill="#FFFFFF"
          fillOpacity="0.85"
        />

        {/* BOTTOM HALF WELLNESS MOTIF */}
        <circle cx="50" cy="130" r="10" fill="rgba(168,50,96,0.1)" />
        <path
          d="M 46 130 Q 50 124 54 130 Q 50 136 46 130 Z"
          fill="#A83260"
          fillOpacity="0.75"
        />

        {/* SPECULAR 3D GLOSS HIGHLIGHT (Runs down the left curve) */}
        <path
          d="M 22 45 A 28 28 0 0 1 78 45 L 74 48 A 24 24 0 0 0 26 48 Z"
          fill="#FFFFFF"
          fillOpacity="0.6"
        />
        <rect
          x="20"
          y="48"
          width="8"
          height="104"
          rx="4"
          fill="url(#glossHighlight)"
        />
      </g>
    </svg>
  );

  // DESKTOP CURSOR MODE
  if (!isMobile) {
    return (
      <>
        <div
          ref={containerRef}
          onClick={() => setIsTooltipOpen(prev => !prev)}
          className="fixed top-0 left-0 pointer-events-auto z-50 cursor-pointer select-none transition-filter duration-200"
          style={{ willChange: 'transform' }}
          title="Mascote Mãe Serena — Clica para saber mais"
        >
          <div className="relative group">
            {renderCapsuleSvg()}

            {/* Aura glow when hovering interactive buttons */}
            {isHoveringInteractive && (
              <div className="absolute inset-0 -m-3 rounded-full bg-rose-400/25 blur-md -z-10 animate-pulse" />
            )}

            {/* Micro Badge Sparkle */}
            <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-xs border border-white">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>

        {/* Mascot Info Tooltip Modal */}
        {isTooltipOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsTooltipOpen(false)}
          >
            <div
              className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-3 relative text-[#30232A] dark:text-[#FFF5F8] animate-in fade-in zoom-in-95"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setIsTooltipOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F8E7ED] dark:bg-[#30232D] flex items-center justify-center text-[#A83260] dark:text-[#E878A0]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="font-serif-accent font-bold text-base text-[#70213F] dark:text-[#E878A0]">
                    Mascote Mãe Serena
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Símbolo de cuidado diário em Angola
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
                Esta cápsula estilizada representa a dedicação com que cuidamos da tua gravidez: consultas, vitaminas prescritas e carinho a cada semana.
              </p>

              <div className="p-3 bg-rose-50 dark:bg-[#30232D] rounded-2xl text-[11px] text-[#A83260] dark:text-[#E878A0] flex items-start gap-2">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Nota Importante:</strong> Esta mascote é puramente artística e decorativa, não substituindo qualquer prescrição médica ou farmacêutica.
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // MOBILE AMBIENT FLOATING MASCOT WIDGET
  return (
    <>
      <div
        onClick={() => {
          setHasInteractedMobile(true);
          setIsTooltipOpen(true);
        }}
        className="fixed bottom-20 right-4 z-40 bg-white/95 dark:bg-[#241C23]/95 backdrop-blur-md border border-rose-200 dark:border-[#493642] p-2.5 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 animate-bounce-subtle"
        title="Mascote Mãe Serena"
      >
        <div className="w-6 h-12 flex items-center justify-center">
          <svg viewBox="0 0 100 200" className="w-5 h-10">
            <path d="M 12 100 L 12 50 A 38 38 0 0 1 88 50 L 88 100 Z" fill="#A83260" />
            <path d="M 12 100 L 12 150 A 38 38 0 0 0 88 150 L 88 100 Z" fill="#FFF2F6" stroke="#E5C7D3" />
            <line x1="12" y1="100" x2="88" y2="100" stroke="#70213F" strokeWidth="2" />
          </svg>
        </div>
        <div className="hidden sm:block text-left pr-2">
          <span className="block text-[10px] font-bold text-[#A83260] dark:text-[#E878A0] leading-none">
            Mãe Serena
          </span>
          <span className="text-[9px] text-neutral-400">Cuidado diário</span>
        </div>
      </div>

      {isTooltipOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsTooltipOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl max-w-sm w-full shadow-2xl space-y-3 relative text-[#30232A] dark:text-[#FFF5F8]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTooltipOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="font-serif-accent font-bold text-base text-[#70213F] dark:text-[#E878A0]">
              Mascote Mãe Serena
            </h4>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              O mascote em cápsula é um símbolo decorativo da nossa plataforma que te lembra do autocuidado, hidratação e consultas em Angola.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
