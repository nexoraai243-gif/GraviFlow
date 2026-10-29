import React from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Home,
  Heart,
  Calendar,
  Clock,
  BookOpen,
  User,
  ShieldAlert,
  UtensilsCrossed,
  CreditCard,
  Lock
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, showLandingPage, user, isTrialExpired } = useApp();

  if (showLandingPage) return null;

  const isLocked = isTrialExpired && !user.isSubscribed && user.role !== 'admin';

  const handleTabClick = (tab: ActiveTab) => {
    if (isLocked && tab !== 'planos') {
      setActiveTab('planos');
      return;
    }
    setActiveTab(tab);
  };

  const navItems: Array<{ tab: ActiveTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { tab: 'inicio', label: 'Início', icon: Home },
    { tab: 'gravidez', label: 'Gravidez', icon: Heart },
    { tab: 'receitas', label: 'Receitas', icon: UtensilsCrossed },
    { tab: 'calendario', label: 'Calendário', icon: Calendar },
    { tab: 'lembretes', label: 'Lembretes', icon: Clock },
    { tab: 'guias', label: 'Guias', icon: BookOpen },
    { tab: 'perfil', label: 'Perfil', icon: User },
  ];

  if (!user.isSubscribed && user.role !== 'admin') {
    navItems.push({ tab: 'planos', label: 'Pacotes', icon: CreditCard });
  }

  if (user.role === 'admin') {
    navItems.push({ tab: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  return (
    <>
      {/* Desktop sub-navigation bar below header */}
      <nav aria-label="Navegação desktop" className="hidden md:block bg-white dark:bg-[#171317] border-b border-[#F8E7ED] dark:border-[#493642] px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex space-x-1 lg:space-x-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              const itemLocked = isLocked && item.tab !== 'planos';
              return (
                <button
                  key={item.tab}
                  onClick={() => handleTabClick(item.tab)}
                  className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#A83260] text-[#70213F] dark:border-[#E878A0] dark:text-[#E878A0]'
                      : 'border-transparent text-[#796A72] dark:text-[#C8B8C1] hover:text-[#30232A] dark:hover:text-white hover:border-neutral-300'
                  } ${itemLocked ? 'opacity-60' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {itemLocked && <Lock className="w-3 h-3 text-amber-500" />}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-medium text-[#796A72] dark:text-[#C8B8C1]">
            GraviFlow • Angola (Africa/Luanda UTC+1)
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation */}
      <nav aria-label="Navegação móvel" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#171317]/95 backdrop-blur-lg border-t border-[#F8E7ED] dark:border-[#493642] px-2 py-1.5 shadow-lg shadow-black/5">
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            const itemLocked = isLocked && item.tab !== 'planos';
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#70213F] dark:text-[#E878A0] font-bold scale-105'
                    : 'text-[#796A72] dark:text-[#C8B8C1] hover:text-[#30232A]'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors relative ${
                    isActive ? 'bg-[#F8E7ED] dark:bg-[#30232D]' : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {itemLocked && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
