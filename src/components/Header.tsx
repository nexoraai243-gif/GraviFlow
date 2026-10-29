import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MaeSerenaLogo } from './MaeSerenaLogo';
import {
  Bell,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Calendar,
  Pill,
  RotateCcw,
  LogIn,
  LogOut,
  Clock,
  CreditCard,
  Sun,
  Moon,
  Laptop,
  Smile,
  Bot,
  UtensilsCrossed
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    calculatedWeek,
    currentTrimester,
    showLandingPage,
    setShowLandingPage,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetToDemoData,
    setIsAuthModalOpen,
    logout,
    trialDaysRemaining,
    isTrialExpired,
    setAppTheme,
    isPillMascotEnabled,
    setIsPillMascotEnabled
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTheme = user.theme || 'light';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#171317]/95 backdrop-blur-md border-b border-[#F8E7ED] dark:border-[#493642] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowLandingPage(false);
              setActiveTab('inicio');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <MaeSerenaLogo size="md" showTagline={false} />
          </button>

          {/* Gestational Week & Trial Badge */}
          {!showLandingPage && (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <div
                onClick={() => setActiveTab('gravidez')}
                className="cursor-pointer flex items-center gap-1.5 bg-[#F8E7ED] hover:bg-[#F2D6E0] dark:bg-[#30232D] dark:hover:bg-[#3B2C37] px-3 py-1 rounded-full border border-rose-200 dark:border-[#493642] transition-colors"
                title="Clica para ver os detalhes da semana"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A83260] dark:text-[#E878A0]" />
                <span className="text-xs font-semibold text-[#70213F] dark:text-[#E878A0]">
                  Semana {calculatedWeek} • {currentTrimester}º Trimestre
                </span>
              </div>

              {/* 3-Day Trial Status Badge + Pagar Pacotes Button */}
              {user.role !== 'admin' && !user.isSubscribed && (
                <div className="flex items-center gap-1.5">
                  <div
                    onClick={() => setActiveTab('planos')}
                    className={`cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                      isTrialExpired
                        ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                        : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                    title="Período de teste gratuito"
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {isTrialExpired ? 'Teste Expirado' : `${trialDaysRemaining}d de Teste`}
                    </span>
                  </div>

                  {/* Botão para pagar os pacotes */}
                  <button
                    onClick={() => {
                      setShowLandingPage(false);
                      setActiveTab('planos');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-[#70213F] to-[#A83260] text-white shadow-xs hover:opacity-95 transition-all hover:scale-105 active:scale-95"
                    title="Subscrever plano em Kwanzas (Kz)"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Pagar Pacotes (Kz)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 3D Mascot Pill Toggle */}
          <button
            onClick={() => setIsPillMascotEnabled(!isPillMascotEnabled)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              isPillMascotEnabled
                ? 'bg-[#F8E7ED] dark:bg-[#30232D] border-[#A83260]/40 text-[#70213F] dark:text-[#E878A0] shadow-xs'
                : 'border-[#F8E7ED] dark:border-[#493642] text-[#796A72] dark:text-[#C8B8C1] hover:bg-neutral-50 dark:hover:bg-[#241C23]'
            }`}
            title={isPillMascotEnabled ? 'Mascote 3D ativa (clica para ocultar)' : 'Mascote 3D inativa (clica para ativar)'}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#A83260] to-rose-200 ring-1 ring-[#70213F]/30" />
            <span className="hidden lg:inline text-[11px]">Mascote</span>
          </button>

          {/* Theme Dropdown: Light, Dark, System */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 rounded-xl border border-[#F8E7ED] dark:border-[#493642] text-[#796A72] dark:text-[#C8B8C1] hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] transition-colors"
              title="Modo visual (Claro, Escuro ou Sistema)"
            >
              {currentTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-[#E878A0]" />
              ) : currentTheme === 'system' ? (
                <Laptop className="w-4 h-4 text-[#A83260]" />
              ) : (
                <Sun className="w-4 h-4 text-[#A83260]" />
              )}
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#241C23] border border-[#F8E7ED] dark:border-[#493642] rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in">
                <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Tema da Aplicação
                </div>
                <button
                  onClick={() => {
                    setAppTheme('light');
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    currentTheme === 'light'
                      ? 'bg-[#F8E7ED] text-[#70213F] font-bold'
                      : 'hover:bg-neutral-50 dark:hover:bg-[#30232D] text-[#30232A] dark:text-[#FFF5F8]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-[#A83260]" />
                  <span>Modo claro</span>
                </button>
                <button
                  onClick={() => {
                    setAppTheme('dark');
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    currentTheme === 'dark'
                      ? 'bg-[#30232D] text-[#E878A0] font-bold'
                      : 'hover:bg-neutral-50 dark:hover:bg-[#30232D] text-[#30232A] dark:text-[#FFF5F8]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-[#E878A0]" />
                  <span>Modo escuro</span>
                </button>
                <button
                  onClick={() => {
                    setAppTheme('system');
                    setIsThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    currentTheme === 'system'
                      ? 'bg-[#F8E7ED] dark:bg-[#30232D] text-[#70213F] dark:text-[#E878A0] font-bold'
                      : 'hover:bg-neutral-50 dark:hover:bg-[#30232D] text-[#30232A] dark:text-[#FFF5F8]'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Seguir o dispositivo</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notificações"
              className="relative p-2 rounded-xl text-[#796A72] dark:text-[#C8B8C1] hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A83260] ring-2 ring-white dark:ring-[#171317]" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#241C23] border border-[#F8E7ED] dark:border-[#493642] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#F8E7ED] dark:border-[#493642]">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">Notificações Mãe Serena</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8E7ED] text-[#A83260] dark:bg-[#30232D] dark:text-[#E878A0]">
                        {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-[#A83260] dark:text-[#E878A0] hover:underline"
                    >
                      Marcar lidas
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#F8E7ED] dark:divide-[#493642] max-h-80 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-400">
                      Não tens notificações no momento.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.linkSection) {
                            setShowLandingPage(false);
                            setActiveTab(notif.linkSection as any);
                          }
                          setIsNotifOpen(false);
                        }}
                        className={`py-3 px-1 text-left cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-[#30232D] rounded-lg ${
                          notif.unread ? 'bg-[#FFFCFD] dark:bg-[#2A202A]' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1 rounded-md bg-rose-100 text-[#A83260] dark:bg-[#30232D] dark:text-[#E878A0]">
                            {notif.type === 'appointment' ? (
                              <Calendar className="w-3.5 h-3.5" />
                            ) : notif.type === 'medication' ? (
                              <Pill className="w-3.5 h-3.5" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate text-[#30232A] dark:text-[#FFF5F8]">
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] line-clamp-2 mt-0.5">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Panel Button — Developer Access Only */}
          {user.role === 'admin' && (
            <button
              onClick={() => {
                setShowLandingPage(false);
                setActiveTab('admin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white shadow-sm hover:brightness-110 transition-transform active:scale-95 border border-amber-400/40"
              title="Painel de Administrador (Aprovação de Pagamentos e Utilizadores)"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Painel Admin</span>
            </button>
          )}

          {/* User Profile Menu */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2.5 rounded-full border border-[#F8E7ED] dark:border-[#493642] hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] transition-colors"
            >
              <span className="text-xs font-bold text-[#30232A] dark:text-[#FFF5F8] hidden md:inline">
                {user.name.split(' ')[0]}
              </span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#70213F] to-[#A83260] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#241C23] border border-[#F8E7ED] dark:border-[#493642] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-[#F8E7ED] dark:border-[#493642]">
                  <p className="text-xs font-bold truncate text-[#30232A] dark:text-[#FFF5F8]">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] truncate">
                    {user.email || 'Conta de demonstração'}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {user.role === 'admin'
                      ? 'Administrador Desenvolvedor'
                      : user.isSubscribed
                      ? 'Subscrição Ativa'
                      : `${trialDaysRemaining} dias de teste grátis`}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowLandingPage(false);
                      setActiveTab('receitas');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#30232A] dark:text-[#FFF5F8] hover:bg-rose-50 dark:hover:bg-[#30232D] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#A83260] dark:text-[#E878A0]" />
                    <span>Receitas para Grávidas</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowLandingPage(false);
                      setActiveTab('perfil');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#30232A] dark:text-[#FFF5F8] hover:bg-rose-50 dark:hover:bg-[#30232D] rounded-lg transition-colors"
                  >
                    Meu Perfil
                  </button>

                  <button
                    onClick={() => {
                      setShowLandingPage(false);
                      setActiveTab('planos');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#30232A] dark:text-[#FFF5F8] hover:bg-rose-50 dark:hover:bg-[#30232D] rounded-lg transition-colors"
                  >
                    Planos em Kwanzas (Kz)
                  </button>

                  <button
                    onClick={() => {
                      resetToDemoData();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#796A72] dark:text-[#C8B8C1] hover:bg-rose-50 dark:hover:bg-[#30232D] rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3 text-rose-500" />
                    Restaurar Dados Iniciais
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#30232D] rounded-lg transition-colors flex items-center gap-1.5 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Terminar Sessão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
