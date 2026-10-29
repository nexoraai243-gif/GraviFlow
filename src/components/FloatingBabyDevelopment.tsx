import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Activity,
  Maximize2,
  RotateCcw,
  Info
} from 'lucide-react';
import { PREGNANCY_WEEKS } from '../data/pregnancyWeeks';

interface FloatingBabyDevelopmentProps {
  week: number;
  size?: 'compact' | 'standard' | 'large' | 'hero';
  showDetailsBadge?: boolean;
  showHeartbeatSound?: boolean;
  className?: string;
}

export const FloatingBabyDevelopment: React.FC<FloatingBabyDevelopmentProps> = ({
  week,
  size = 'standard',
  showDetailsBadge = true,
  showHeartbeatSound = true,
  className = ''
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [viewMode, setViewMode] = useState<'natural' | 'ultrasound'>('natural');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);

  // Clamp week between 1 and 40
  const clampedWeek = Math.max(1, Math.min(40, week));
  const weekInfo = PREGNANCY_WEEKS.find(w => w.week === clampedWeek) || PREGNANCY_WEEKS[23];

  // Calculate estimated fetal heart rate (BPM) based on gestational week
  const getFetalBpm = (w: number) => {
    if (w < 5) return 0; // heart not beating yet
    if (w <= 6) return 110;
    if (w <= 9) return 170; // peak rate
    if (w <= 14) return 155;
    if (w <= 24) return 142; // around week 24
    return 135; // late pregnancy average
  };

  const fetalBpm = getFetalBpm(clampedWeek);
  const pulseIntervalSec = fetalBpm > 0 ? (60 / fetalBpm) : 1;

  // Audio synthesis for realistic fetal intrauterine heartbeat ("lub-dub")
  const stopHeartbeatAudio = () => {
    if (heartbeatTimerRef.current) {
      window.clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const startHeartbeatAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const playThud = (freq: number, duration: number, gainVal: number) => {
        if (!ctx || ctx.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      };

      const beatDurationMs = (60 / Math.max(80, fetalBpm)) * 1000;

      const triggerDoubleBeat = () => {
        if (!ctx || ctx.state === 'closed') return;
        // First tone (Lub)
        playThud(75, 0.12, 0.35);
        // Second tone (Dub) closely after
        window.setTimeout(() => {
          playThud(65, 0.10, 0.22);
        }, 130);
      };

      // Trigger first beat immediately
      triggerDoubleBeat();
      heartbeatTimerRef.current = window.setInterval(triggerDoubleBeat, beatDurationMs);
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn('AudioContext not permitted or supported', e);
      setIsPlayingAudio(false);
    }
  };

  const toggleHeartbeat = () => {
    if (isPlayingAudio) {
      stopHeartbeatAudio();
    } else {
      startHeartbeatAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopHeartbeatAudio();
    };
  }, []);

  // Determine size classes
  const containerSizeClasses = {
    compact: 'w-28 h-28',
    standard: 'w-44 h-44 sm:w-52 sm:h-52',
    large: 'w-60 h-60 sm:w-72 sm:h-72',
    hero: 'w-72 h-72 sm:w-84 sm:h-84'
  }[size];

  // Developmental Stage Logic (1 to 6)
  const getStage = (w: number) => {
    if (w <= 4) return 1; // Blastocyst / Early cells
    if (w <= 7) return 2; // C-curved embryo with heartbeat tube & limb buds
    if (w <= 11) return 3; // Formed fingers, head, spine, developing limbs
    if (w <= 18) return 4; // Active fetus with defined face, elbows, knees
    if (w <= 27) return 5; // Defined baby with eyelashes, chubby cheeks (week 24 corn stage)
    return 6; // Fully mature, plump baby ready for birth
  };

  const stage = getStage(clampedWeek);

  // Growth scale multiplier (grows naturally from 0.35 up to 1.05)
  const growthScale = 0.38 + (clampedWeek / 40) * 0.65;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Amniotic Fluid Chamber / Womb Outer Halo */}
      <div
        className={`relative ${containerSizeClasses} rounded-full flex items-center justify-center p-3 transition-all duration-700 shadow-xl overflow-hidden ${
          viewMode === 'natural'
            ? 'bg-gradient-to-br from-[#FFEAF1] via-[#FCE4EC] to-[#F8BBD0] dark:from-[#2A111E] dark:via-[#1F0B15] dark:to-[#12050C] border-4 border-[#F3A4C0]/50 dark:border-[#7A284C]/60 shadow-rose-900/15'
            : 'bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#1E293B] border-4 border-cyan-500/40 shadow-cyan-950/40'
        }`}
      >
        {/* Bioluminescent Womb Fluid Caustic Shimmer */}
        <div
          className={`absolute inset-0 pointer-events-none rounded-full opacity-60 mix-blend-overlay ${
            viewMode === 'natural' ? 'animate-pulse' : ''
          }`}
          style={{
            background:
              viewMode === 'natural'
                ? 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 182, 193, 0.4) 40%, rgba(168, 50, 96, 0.15) 80%)'
                : 'radial-gradient(circle at 35% 30%, rgba(56, 189, 248, 0.4) 0%, rgba(15, 23, 42, 0.8) 70%)',
            animationDuration: '4s'
          }}
        />

        {/* Ambient floating fluid micro-bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
          <span
            className="absolute w-2 h-2 rounded-full bg-white/40 dark:bg-rose-200/20 blur-[0.5px] animate-float-pregnant"
            style={{ top: '25%', left: '20%', animationDuration: '4.8s' }}
          />
          <span
            className="absolute w-1.5 h-1.5 rounded-full bg-white/50 dark:bg-rose-100/30 blur-[0.5px] animate-float-pregnant"
            style={{ top: '65%', right: '22%', animationDuration: '3.6s', animationDelay: '1.2s' }}
          />
          <span
            className="absolute w-3 h-3 rounded-full bg-white/30 dark:bg-amber-100/20 blur-[0.8px] animate-float-pregnant"
            style={{ bottom: '20%', left: '38%', animationDuration: '5.4s', animationDelay: '0.6s' }}
          />
        </div>

        {/* Floating Baby Center Container with Natural Buoyancy Physics */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            animation: 'baby-womb-float 5.2s ease-in-out infinite',
            transformOrigin: '50% 50%'
          }}
        >
          {/* Dynamically Rendered SVG Embryo/Fetus Model based on Stage */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-lg transition-all duration-700"
            style={{
              transform: `scale(${growthScale})`,
              filter:
                viewMode === 'ultrasound'
                  ? 'grayscale(100%) contrast(180%) brightness(110%) drop-shadow(0 0 10px rgba(56, 189, 248, 0.7))'
                  : 'drop-shadow(0 10px 18px rgba(168, 50, 96, 0.28))'
            }}
          >
            <defs>
              {/* Natural Skin Gradients */}
              <radialGradient id="fetalSkinWarm" cx="40%" cy="35%" r="70%">
                <stop offset="0%" stopColor="#FFF0ED" />
                <stop offset="45%" stopColor="#F9C6B8" />
                <stop offset="80%" stopColor="#EB9F8C" />
                <stop offset="100%" stopColor="#CF7B6A" />
              </radialGradient>

              <radialGradient id="embryoTranslucent" cx="45%" cy="40%" r="65%">
                <stop offset="0%" stopColor="#FFF7F5" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#FBBDAF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#E28978" stopOpacity="0.9" />
              </radialGradient>

              <linearGradient id="umbilicalCordGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E878A0" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#4A7BB0" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#A83260" stopOpacity="0.9" />
              </linearGradient>

              {/* Heart Glow Filter */}
              <filter id="cardiacGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FF2E7E" floodOpacity="0.85" />
              </filter>
            </defs>

            {/* STAGE 1: WEEKS 1 - 4 (Blastocyst / Pre-embryo Cellular Division) */}
            {stage === 1 && (
              <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                {/* Zona Pellucida / Outer Membrane */}
                <circle
                  cx="100"
                  cy="100"
                  r="45"
                  fill="url(#embryoTranslucent)"
                  stroke="#E878A0"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                  opacity="0.9"
                />
                {/* Inner Cell Mass (Embryoblast) */}
                <circle cx="92" cy="92" r="18" fill="#EB9F8C" />
                <circle cx="108" cy="96" r="14" fill="#F9C6B8" />
                <circle cx="98" cy="110" r="16" fill="#CF7B6A" />
                <circle cx="85" cy="106" r="11" fill="#FFF0ED" />
                {/* Cellular Division Nuclei */}
                <circle cx="92" cy="92" r="4" fill="#7D2347" opacity="0.6" />
                <circle cx="108" cy="96" r="3.5" fill="#7D2347" opacity="0.6" />
                <circle cx="98" cy="110" r="4" fill="#7D2347" opacity="0.6" />
                {/* Implantation Trophoblast Sprout Filaments */}
                <path
                  d="M 140 100 Q 155 95 165 105 M 60 100 Q 45 105 35 95 M 100 55 Q 105 40 95 30 M 100 145 Q 95 160 105 170"
                  stroke="#E878A0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </g>
            )}

            {/* STAGE 2: WEEKS 5 - 7 (C-Curved Embryo with Beating Heart Tube & Limb Buds) */}
            {stage === 2 && (
              <g>
                {/* Yolk Sac & Primitive Umbilical Stalk */}
                <circle cx="135" cy="115" r="22" fill="#FFEFEA" stroke="#E878A0" strokeWidth="1.5" opacity="0.6" />
                <path
                  d="M 105 110 Q 120 115 135 115"
                  stroke="url(#umbilicalCordGrad)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* C-Curved Embryonic Body (Cephalic & Caudal Flexure) */}
                <path
                  d="M 90 60 C 130 55 135 110 105 135 C 80 155 60 135 70 110 C 75 90 70 70 90 60 Z"
                  fill="url(#embryoTranslucent)"
                  stroke="#CF7B6A"
                  strokeWidth="2.5"
                />

                {/* Primitive Eye Disc */}
                <circle cx="85" cy="72" r="4" fill="#5A233A" />
                <circle cx="86" cy="71" r="1.5" fill="#FFFFFF" />

                {/* Nascent Upper & Lower Limb Buds */}
                <path d="M 104 98 Q 116 102 112 110" stroke="#CF7B6A" strokeWidth="6" strokeLinecap="round" />
                <path d="M 96 128 Q 106 136 100 142" stroke="#CF7B6A" strokeWidth="5.5" strokeLinecap="round" />

                {/* Pulsing Primitive Heart Tube */}
                <g filter="url(#cardiacGlow)">
                  <circle
                    cx="95"
                    cy="98"
                    r="8"
                    fill="#FF2E7E"
                    style={{
                      animation: `baby-heart-thump ${pulseIntervalSec}s ease-in-out infinite`
                    }}
                  />
                  <circle cx="95" cy="98" r="4" fill="#FFFFFF" opacity="0.8" />
                </g>
              </g>
            )}

            {/* STAGE 3: WEEKS 8 - 11 (Late Embryo / Early Fetus • Formed Fingers, Eyes & Spine) */}
            {stage === 3 && (
              <g>
                {/* Umbilical Cord */}
                <path
                  d="M 95 115 C 120 130 130 100 155 120"
                  stroke="url(#umbilicalCordGrad)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Head with Distinct Cranial Vault */}
                <ellipse cx="88" cy="72" rx="26" ry="24" fill="url(#fetalSkinWarm)" stroke="#CF7B6A" strokeWidth="2" />

                {/* Eyelid / Developing Eye */}
                <ellipse cx="80" cy="72" rx="4.5" ry="3.5" fill="#5A233A" />
                <circle cx="81" cy="71" r="1.5" fill="#FFFFFF" />

                {/* Cute Nose Bud & Chin Contour */}
                <path d="M 68 76 Q 64 80 70 83 Q 72 87 78 88" stroke="#CF7B6A" strokeWidth="2" fill="none" />

                {/* Curved Torso & Visible Delicate Spine */}
                <path
                  d="M 92 90 C 125 105 120 145 92 148 C 76 150 72 135 78 118 C 82 108 85 96 92 90 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2"
                />

                {/* Spinal Column Somites Highlights */}
                <path
                  d="M 108 98 Q 112 118 98 140"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeDasharray="2 3"
                  opacity="0.6"
                  fill="none"
                />

                {/* Formed Arms with Elbow & Miniature Hand */}
                <path
                  d="M 88 100 Q 75 110 82 118 Q 86 120 89 116"
                  stroke="#EB9F8C"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Tiny fingers */}
                <circle cx="89" cy="116" r="3.5" fill="#F9C6B8" />

                {/* Legs with Knee & Tiny Foot */}
                <path
                  d="M 94 138 Q 106 152 98 160 Q 90 162 86 155"
                  stroke="#EB9F8C"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="86" cy="155" rx="4" ry="2.5" fill="#F9C6B8" />

                {/* Heart Beat in Chest */}
                <circle
                  cx="88"
                  cy="104"
                  r="6"
                  fill="#FF2E7E"
                  filter="url(#cardiacGlow)"
                  style={{ animation: `baby-heart-thump ${pulseIntervalSec}s ease-in-out infinite` }}
                />
              </g>
            )}

            {/* STAGE 4: WEEKS 12 - 18 (Active Fetus with Facial Profile, Articulated Limbs) */}
            {stage === 4 && (
              <g>
                {/* Umbilical Cord with Spiraling Vessels */}
                <path
                  d="M 98 118 C 130 140 145 105 170 130"
                  stroke="url(#umbilicalCordGrad)"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Proportioned Head */}
                <path
                  d="M 92 50 C 118 52 120 80 102 92 C 86 98 68 92 68 76 C 68 60 76 50 92 50 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2"
                />

                {/* Profile: Forehead, Nose, Lips, Chin */}
                <path
                  d="M 70 70 Q 64 74 69 77 Q 66 82 72 84 Q 74 88 80 89"
                  stroke="#CF7B6A"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Peaceful Closed Eyelid & Brow */}
                <path d="M 74 72 Q 78 70 82 72" stroke="#5A233A" strokeWidth="1.8" fill="none" />
                <path d="M 75 75 Q 79 78 83 75" stroke="#7A284C" strokeWidth="1.5" fill="none" />

                {/* External Ear / Pinna */}
                <path d="M 98 74 C 102 74 103 82 98 84" stroke="#CF7B6A" strokeWidth="1.8" fill="none" />

                {/* Curled Body and Ribs */}
                <path
                  d="M 96 92 C 128 108 126 150 95 155 C 75 156 70 136 78 116 C 82 104 88 94 96 92 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2"
                />

                {/* Delicate Hand folded towards chest/face */}
                <path
                  d="M 90 104 Q 74 112 82 122 Q 86 118 90 114"
                  stroke="#EB9F8C"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="82" cy="120" r="4.5" fill="#F9C6B8" />

                {/* Curled Leg and Foot with Toes */}
                <path
                  d="M 96 142 Q 112 160 100 168 Q 92 168 88 160"
                  stroke="#EB9F8C"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="88" cy="160" rx="5.5" ry="3.5" fill="#F9C6B8" />

                {/* Fetal Heartbeat */}
                <circle
                  cx="90"
                  cy="110"
                  r="6.5"
                  fill="#FF2E7E"
                  filter="url(#cardiacGlow)"
                  style={{ animation: `baby-heart-thump ${pulseIntervalSec}s ease-in-out infinite` }}
                />
              </g>
            )}

            {/* STAGE 5: WEEKS 19 - 27 (DEFINED REALISTIC BABY • WEEK 24 CORN REPLACEMENT!) */}
            {stage === 5 && (
              <g>
                {/* Womb Placenta / Umbilical Cord Floating in Fluid */}
                <path
                  d="M 100 120 C 135 150 150 95 180 125"
                  stroke="url(#umbilicalCordGrad)"
                  strokeWidth="8.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="18 4"
                />

                {/* Baby Head with Natural Newborn Curvature */}
                <path
                  d="M 94 44 C 124 46 128 82 106 95 C 88 102 65 94 65 74 C 65 56 74 44 94 44 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2.5"
                />

                {/* Soft Baby Hair Whisps */}
                <path d="M 86 44 Q 96 40 106 46" stroke="#9A4E3F" strokeWidth="1.5" fill="none" opacity="0.6" />
                <path d="M 92 46 Q 102 42 110 50" stroke="#9A4E3F" strokeWidth="1.5" fill="none" opacity="0.5" />

                {/* Expressive Facial Profile: Button Nose, Cheeks, Sweet Lips */}
                <path
                  d="M 68 68 Q 60 73 66 76 Q 62 81 70 84 Q 72 89 80 91"
                  stroke="#CF7B6A"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Sleeping Eyelash & Rosy Cheeks */}
                <path d="M 72 70 Q 77 67 82 69" stroke="#5A233A" strokeWidth="2" fill="none" />
                <path d="M 73 73 Q 77 77 82 74" stroke="#5A233A" strokeWidth="2.2" fill="none" />
                {/* Tiny eyelashes */}
                <line x1="75" y1="75" x2="74" y2="78" stroke="#5A233A" strokeWidth="1.2" />
                <line x1="78" y1="76" x2="78" y2="79" stroke="#5A233A" strokeWidth="1.2" />
                <line x1="81" y1="75" x2="82" y2="78" stroke="#5A233A" strokeWidth="1.2" />

                {/* Rosy Cheek Blush */}
                <ellipse cx="82" cy="80" rx="6" ry="4" fill="#FF8BA7" opacity="0.4" />

                {/* Formed Baby Ear */}
                <path
                  d="M 102 72 C 108 72 109 84 102 86 C 99 87 99 74 102 72 Z"
                  fill="#F9C6B8"
                  stroke="#CF7B6A"
                  strokeWidth="1.8"
                />

                {/* Curled Fetal Torso in Peaceful Flexion */}
                <path
                  d="M 98 94 C 135 110 134 158 98 164 C 74 165 68 142 76 120 C 82 106 88 96 98 94 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2.5"
                />

                {/* Arms Hugging Chest with Realistic Fingers */}
                <path
                  d="M 92 106 Q 72 116 80 128 Q 86 124 92 118"
                  stroke="#EB9F8C"
                  strokeWidth="8.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Hand and individual fingers resting peacefully */}
                <ellipse cx="80" cy="126" rx="5.5" ry="4.5" fill="#F9C6B8" stroke="#CF7B6A" strokeWidth="1" />
                <line x1="78" y1="124" x2="76" y2="128" stroke="#CF7B6A" strokeWidth="1" />
                <line x1="80" y1="125" x2="79" y2="129" stroke="#CF7B6A" strokeWidth="1" />
                <line x1="82" y1="124" x2="82" y2="128" stroke="#CF7B6A" strokeWidth="1" />

                {/* Plump Leg, Knee & Little Foot with Soles and Toes */}
                <path
                  d="M 98 148 Q 118 168 104 176 Q 94 176 88 166"
                  stroke="#EB9F8C"
                  strokeWidth="9"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Tiny Foot & Toes */}
                <ellipse cx="88" cy="166" rx="7" ry="4.5" fill="#F9C6B8" stroke="#CF7B6A" strokeWidth="1.2" />
                <circle cx="83" cy="164" r="1.3" fill="#EB9F8C" />
                <circle cx="85" cy="163" r="1.2" fill="#EB9F8C" />
                <circle cx="87" cy="163" r="1.2" fill="#EB9F8C" />
                <circle cx="89" cy="164" r="1.2" fill="#EB9F8C" />
                <circle cx="91" cy="166" r="1.5" fill="#EB9F8C" />

                {/* Rhythmic Fetal Heartbeat */}
                <circle
                  cx="92"
                  cy="114"
                  r="7.5"
                  fill="#FF2E7E"
                  filter="url(#cardiacGlow)"
                  style={{ animation: `baby-heart-thump ${pulseIntervalSec}s ease-in-out infinite` }}
                />
              </g>
            )}

            {/* STAGE 6: WEEKS 28 - 40 (PLUMP, FULLY DEVELOPED BABY READY FOR LIFE) */}
            {stage === 6 && (
              <g>
                {/* Mature Umbilical Cord */}
                <path
                  d="M 104 124 C 145 155 160 90 190 120"
                  stroke="url(#umbilicalCordGrad)"
                  strokeWidth="9"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="20 5"
                />

                {/* Full, Rounded Baby Head */}
                <path
                  d="M 96 38 C 132 40 136 84 112 98 C 92 106 64 98 64 72 C 64 52 74 38 96 38 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2.8"
                />

                {/* Baby Hair Tuft */}
                <path
                  d="M 88 38 Q 102 34 114 42 M 94 40 Q 106 36 118 46"
                  stroke="#8B4513"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.7"
                />

                {/* Chubby Cheeks and Calm Sleeping Face */}
                <path
                  d="M 68 66 Q 58 72 64 76 Q 60 82 69 85 Q 71 91 82 93"
                  stroke="#CF7B6A"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Sweet Sleeping Eyes */}
                <path d="M 72 68 Q 78 64 84 67" stroke="#4A1E2B" strokeWidth="2.2" fill="none" />
                <path d="M 73 72 Q 78 77 84 73" stroke="#4A1E2B" strokeWidth="2.4" fill="none" />
                <ellipse cx="84" cy="80" rx="7" ry="5" fill="#FF8BA7" opacity="0.45" />

                {/* Fully Formed Ear */}
                <path
                  d="M 106 72 C 114 72 114 86 106 88 C 102 88 102 74 106 72 Z"
                  fill="#F9C6B8"
                  stroke="#CF7B6A"
                  strokeWidth="2"
                />

                {/* Chubby Torso and Fetal Curves */}
                <path
                  d="M 100 96 C 142 114 142 165 102 172 C 75 174 68 148 76 122 C 82 108 90 98 100 96 Z"
                  fill="url(#fetalSkinWarm)"
                  stroke="#CF7B6A"
                  strokeWidth="2.8"
                />

                {/* Chubby Baby Arms & Dimpled Hands */}
                <path
                  d="M 94 110 Q 70 120 78 134 Q 86 130 94 122"
                  stroke="#EB9F8C"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="78" cy="132" rx="6.5" ry="5.5" fill="#F9C6B8" stroke="#CF7B6A" strokeWidth="1.2" />

                {/* Plump Thighs and Chubby Feet */}
                <path
                  d="M 100 152 Q 124 176 108 184 Q 96 184 88 172"
                  stroke="#EB9F8C"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="88" cy="172" rx="8" ry="5" fill="#F9C6B8" stroke="#CF7B6A" strokeWidth="1.4" />

                {/* Strong Steady Fetal Heartbeat */}
                <circle
                  cx="94"
                  cy="118"
                  r="8"
                  fill="#FF2E7E"
                  filter="url(#cardiacGlow)"
                  style={{ animation: `baby-heart-thump ${pulseIntervalSec}s ease-in-out infinite` }}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Floating Controls Overlay (Visible on Hover or Touch) */}
        <div
          className={`absolute bottom-2 inset-x-2 flex items-center justify-between px-2 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-75'
          }`}
        >
          {/* Heartbeat Sound Toggle */}
          {showHeartbeatSound && fetalBpm > 0 && (
            <button
              onClick={toggleHeartbeat}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-bold transition-transform hover:scale-105 active:scale-95 ${
                isPlayingAudio ? 'bg-[#FF2E7E] text-white animate-pulse' : 'bg-white/20 hover:bg-white/30 text-rose-100'
              }`}
              title={isPlayingAudio ? 'Silenciar batimentos' : 'Ouvir batimentos cardíacos fetais'}
            >
              {isPlayingAudio ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{fetalBpm} bpm</span>
            </button>
          )}

          {/* Ultrasound vs Natural Visual Mode Toggle */}
          <button
            onClick={() => setViewMode(prev => (prev === 'natural' ? 'ultrasound' : 'natural'))}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-rose-100 font-bold transition-colors ml-auto"
            title="Alternar entre visualização natural e ecografia"
          >
            <Eye className="w-3 h-3" />
            <span className="capitalize">{viewMode === 'natural' ? 'Eco' : 'Real'}</span>
          </button>
        </div>
      </div>

      {/* Development Stage Badge & Measurements */}
      {showDetailsBadge && (
        <div className="mt-3 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FCE4EC] to-[#F8E7ED] dark:from-[#3A1426] dark:to-[#280D1A] border border-[#F3A4C0]/50 dark:border-[#7A284C]/50 text-xs font-bold text-[#A83260] dark:text-[#F48FB1] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF2E7E] animate-ping" />
            <span>
              {stage === 1 && 'Fase Celular (Embrioblasto)'}
              {stage === 2 && 'Embrião • Primeiras Pulsações'}
              {stage === 3 && 'Transição Fetal • Dedos e Rosto'}
              {stage === 4 && 'Feto Ativo • Movimentos Sutis'}
              {stage === 5 && 'Bebé Definido • Ouve a tua Voz'}
              {stage === 6 && 'Bebé Maduro • Pronto para Nascer'}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#796A72] dark:text-[#C8B8C1] font-medium">
            <span>~{weekInfo.babyLengthCm} cm</span>
            <span>•</span>
            <span>~{weekInfo.babyWeightGrams} g</span>
            <span>•</span>
            <span className="text-[#A83260] dark:text-[#E878A0] font-bold">
              {weekInfo.babySizeComparison}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
