import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Calendar, Pill, Clock, Activity, Sparkles, Heart, UtensilsCrossed } from 'lucide-react';

export const FloatingActionButton: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    setActiveQuickModal,
    showLandingPage,
    calculatedWeek,
    user,
    setActiveTab
  } = useApp();

  const menuRef = useRef<HTMLDivElement>(null);
  const [showTooltipBubble, setShowTooltipBubble] = useState(false);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsQuickActionOpen(false);
        setShowTooltipBubble(false);
      }
    };
    if (isQuickActionOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isQuickActionOpen, setIsQuickActionOpen]);

  // Show a gentle greeting bubble briefly on first interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltipBubble(true);
      const closeTimer = setTimeout(() => setShowTooltipBubble(false), 6000);
      return () => clearTimeout(closeTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showLandingPage) return null;

  const quickActions = [
    {
      id: 'appointment',
      label: 'Marcar consulta pré-natal',
      icon: Calendar,
      color: 'bg-rose-600 text-white hover:bg-rose-700',
      action: () => setActiveQuickModal('appointment')
    },
    {
      id: 'medication',
      label: 'Registar medicamento prescrito',
      icon: Pill,
      color: 'bg-amber-600 text-white hover:bg-amber-700',
      action: () => setActiveQuickModal('medication')
    },
    {
      id: 'reminder',
      label: 'Adicionar lembrete pessoal',
      icon: Clock,
      color: 'bg-emerald-600 text-white hover:bg-emerald-700',
      action: () => setActiveQuickModal('reminder')
    },
    {
      id: 'symptom',
      label: 'Registar sintoma / humor diário',
      icon: Activity,
      color: 'bg-indigo-600 text-white hover:bg-indigo-700',
      action: () => setActiveQuickModal('symptom')
    },
    {
      id: 'recipes',
      label: 'Receitas de comidas para grávidas',
      icon: UtensilsCrossed,
      color: 'bg-gradient-to-r from-orange-500 to-rose-600 text-white hover:opacity-90',
      action: () => setActiveTab('receitas')
    }
  ];

  const displayName = user.name ? user.name.split(' ')[0] : 'Mamã';

  return (
    <div
      ref={menuRef}
      className="fixed z-40 right-4 sm:right-8 bottom-20 md:bottom-8 flex flex-col items-end select-none"
    >
      {/* Speech Bubble Greeting */}
      {showTooltipBubble && !isQuickActionOpen && (
        <div className="mb-2 bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] px-3.5 py-2 rounded-2xl shadow-xl text-xs text-[#70213F] dark:text-[#E878A0] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <Heart className="w-3.5 h-3.5 fill-current text-[#A83260] shrink-0 animate-pulse" />
          <span>Olá, {displayName}! Clica em mim para ações rápidas da gravidez.</span>
          <button
            onClick={() => setShowTooltipBubble(false)}
            className="text-neutral-400 hover:text-neutral-600 p-0.5 ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Quick Actions List Popover */}
      {isQuickActionOpen && (
        <div className="mb-3 space-y-2.5 flex flex-col items-end animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0] bg-white/90 dark:bg-[#241C23]/90 px-3 py-1 rounded-full border border-rose-200 dark:border-[#493642] shadow-xs">
            Ações Rápidas • Semana {calculatedWeek}
          </div>

          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  setIsQuickActionOpen(false);
                  action.action();
                }}
                className="flex items-center gap-3 bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] px-4 py-2.5 rounded-2xl shadow-xl hover:scale-102 transition-all text-xs font-semibold text-[#30232A] dark:text-[#FFF5F8] group cursor-pointer"
              >
                <span className="group-hover:text-[#A83260] dark:group-hover:text-[#E878A0] transition-colors">
                  {action.label}
                </span>
                <div className={`p-2 rounded-xl ${action.color} shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Trigger Button: Animated Floating Interactive Logo Button */}
      <button
        onClick={() => {
          setIsQuickActionOpen(!isQuickActionOpen);
          setShowTooltipBubble(false);
        }}
        aria-label="Ações rápidas e Mascote da Logo"
        title="Botão flutuante interativo da Logo Mãe Serena — Clica para abrir"
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group cursor-pointer ${
          isQuickActionOpen
            ? 'bg-[#30232A] dark:bg-[#FFF5F8] text-white dark:text-[#30232A] scale-95 ring-4 ring-rose-300 dark:ring-rose-900/60'
            : 'animate-float-pregnant hover:scale-110 active:scale-95 shadow-[#A83260]/40 hover:shadow-[0_0_25px_#FF2E93]'
        }`}
      >
        {isQuickActionOpen ? (
          <X className="w-7 h-7 transition-transform rotate-90" />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-2 rounded-full bg-gradient-to-tr from-[#70213F] via-[#A83260] to-[#C44376]">
            {/* Ambient Animated Glowing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping opacity-30 pointer-events-none" />

            {/* Mother Figure SVG Illustration */}
            <svg viewBox="0 0 100 100" className="w-11 h-11" fill="none">
              {/* Mother Head */}
              <circle cx="48" cy="28" r="9" fill="#FFFFFF" />

              {/* Pregnant Body Curve */}
              <path
                d="M 40 38 C 34 46 33 66 44 77 C 54 86 68 84 73 74 C 77 64 75 53 66 46 C 60 42 54 42 48 38"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Glowing Heart / Womb */}
              <g className="animate-pulse">
                <circle cx="53" cy="61" r="7.5" fill="#FFE2ED" />
                <path
                  d="M 50 60 C 50 58 52 56 54 56 C 56 56 57 58 57 60 C 57 63 53.5 65 53.5 65 C 53.5 65 50 63 50 60 Z"
                  fill="#A83260"
                />
              </g>

              {/* Mascot Sparkle */}
              <circle cx="70" cy="26" r="2.5" fill="#FFD700" className="animate-ping" />
            </svg>

            {/* Micro Badge */}
            <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-sm border border-white">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>
        )}
      </button>
    </div>
  );
};
