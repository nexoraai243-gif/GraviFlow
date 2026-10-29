/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { AuthModal } from './components/AuthModal';
import { FloatingPillCursor } from './components/FloatingPillCursor';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { OnboardingWizardModal } from './components/OnboardingWizardModal';

// Modals
import { AddAppointmentModal } from './components/modals/AddAppointmentModal';
import { AddMedicationModal } from './components/modals/AddMedicationModal';
import { AddReminderModal } from './components/modals/AddReminderModal';
import { LogSymptomModal } from './components/modals/LogSymptomModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { GuideDetailModal } from './components/modals/GuideDetailModal';
import { OnboardingModal } from './components/modals/OnboardingModal';

// Views
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { PregnancyTrackerView } from './views/PregnancyTrackerView';
import { CalendarView } from './views/CalendarView';
import { RemindersView } from './views/RemindersView';
import { GuidesView } from './views/GuidesView';
import { ReceitasMaternasView } from './views/ReceitasMaternasView';
import { SubscriptionView } from './views/SubscriptionView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { Lock, ShieldAlert, Sparkles, CreditCard, ArrowRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    showLandingPage,
    setShowLandingPage,
    activeTab,
    setActiveTab,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isTrialExpired,
    trialDaysRemaining,
    user,
    isPillMascotEnabled,
    payments,
    setIsCheckoutOpen,
    setCheckoutSelectedPlan,
    plans
  } = useApp();

  // Automatically take user to checkout and prompt payment when 3-day trial expires
  React.useEffect(() => {
    if (isTrialExpired && !user.isSubscribed && user.role !== 'admin') {
      setActiveTab('planos');
      const popularPlan = plans.find(p => p.isPopular) || plans[1] || plans[0];
      setCheckoutSelectedPlan(popularPlan);
      setIsCheckoutOpen(true);
    }
  }, [isTrialExpired, user.isSubscribed, user.role, plans, setActiveTab, setCheckoutSelectedPlan, setIsCheckoutOpen]);

  // Track if user has entered the app experience or prefers the welcome screen
  const [hasEnteredApp, setHasEnteredApp] = useState<boolean>(() => {
    // Strictly require a real authenticated user (not the visitor placeholder) or completed registration
    const isRealUser = Boolean(user.email && user.email !== 'ana.domingos@exemplo.ao');
    const isRegisteredActive = localStorage.getItem('maeserena_registered_user_active') === 'true';
    return isRealUser || isRegisteredActive;
  });

  const handleEnterApp = () => {
    setHasEnteredApp(true);
    localStorage.setItem('maeserena_entered_app', 'true');
    localStorage.setItem('maeserena_registered_user_active', 'true');
  };

  // Sync state whenever user registers or logs in
  React.useEffect(() => {
    const isRealUser = Boolean(user.email && user.email !== 'ana.domingos@exemplo.ao');
    const isRegisteredActive = localStorage.getItem('maeserena_registered_user_active') === 'true';
    if (isRealUser || isRegisteredActive) {
      setHasEnteredApp(true);
    }
  }, [user]);

  // If user has not yet entered and is on initial load, show Welcome & Auth screen directly
  if (!hasEnteredApp && !showLandingPage) {
    return (
      <>
        <FloatingPillCursor enabled={isPillMascotEnabled} />
        <WelcomeAuthScreen
          onStartOnboarding={() => setIsOnboardingOpen(true)}
          onOpenLogin={() => setIsAuthModalOpen(true)}
          onLoginSuccess={() => {
            handleEnterApp();
            setActiveTab('inicio');
          }}
        />
        <OnboardingWizardModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={() => {
            setIsOnboardingOpen(false);
            handleEnterApp();
            setActiveTab('inicio');
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={() => {
            setIsAuthModalOpen(false);
            handleEnterApp();
            setActiveTab('inicio');
          }}
          onOpenOnboarding={() => {
            setIsAuthModalOpen(false);
            setIsOnboardingOpen(true);
          }}
        />
      </>
    );
  }

  // Optional Public Landing Page
  if (showLandingPage) {
    return (
      <>
        <FloatingPillCursor enabled={isPillMascotEnabled} />
        <LandingPage />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        <OnboardingWizardModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
        />
      </>
    );
  }

  // If user inscription is blocked/reprovada by admin
  if (user.approvalStatus === 'reprovado' && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFCFD] dark:bg-[#171317] text-[#30232A] dark:text-[#FFF5F8]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#241C23] p-8 rounded-3xl border border-rose-200 dark:border-[#493642] shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="font-serif-accent font-bold text-2xl text-rose-700 dark:text-rose-400">
              Inscrição Não Aprovada
            </h2>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              A tua conta está atualmente com estado reprovado pela administração do GraviFlow. Se consideras que se trata de um engano, por favor contacta o suporte pelo WhatsApp ou telefone em Angola (+244 928 230 620).
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has an order pending manual admin verification
  const pendingVerificationOrder = payments.find(p => p.status === 'pending_verification');

  // If 3-day trial has expired and user is not subscribed (and has no pending verification)
  if (isTrialExpired && !user.isSubscribed && user.role !== 'admin' && activeTab !== 'planos') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFCFD] dark:bg-[#171317] text-[#30232A] dark:text-[#FFF5F8]">
        <FloatingPillCursor enabled={isPillMascotEnabled} />
        <Header />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-[#241C23] dark:to-[#30232D] border-2 border-rose-300 dark:border-[#493642] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Subscrição Necessária
                </span>
                <h3 className="font-serif-accent font-bold text-lg text-[#30232A] dark:text-[#FFF5F8]">
                  O teu período de 3 dias de teste do GraviFlow terminou ou a tua subscrição foi desativada.
                </h3>
              </div>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Para continuar a acompanhar as semanas do teu bebé, receber lembretes de consultas e medicamentos, receitas e consultar os guias médicos, escolhe o teu pacote de subscrição em Kwanzas (Kz).
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('planos');
                const popularPlan = plans.find(p => p.isPopular) || plans[1] || plans[0];
                setCheckoutSelectedPlan(popularPlan);
                setIsCheckoutOpen(true);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white text-xs font-bold shadow-lg shadow-rose-900/30 hover:opacity-95 transition-all flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer animate-pulse"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pagar Pacotes em Kwanzas (Kz)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SubscriptionView />
        </div>
        <CheckoutModal />
      </div>
    );
  }

  const renderActiveView = () => {
    // If not subscribed and trial is expired, strictly lock access and display SubscriptionView
    if (isTrialExpired && !user.isSubscribed && user.role !== 'admin') {
      return <SubscriptionView />;
    }
    switch (activeTab) {
      case 'inicio':
        return <DashboardView />;
      case 'gravidez':
        return <PregnancyTrackerView />;
      case 'receitas':
        return <ReceitasMaternasView />;
      case 'calendario':
        return <CalendarView />;
      case 'lembretes':
        return <RemindersView />;
      case 'guias':
        return <GuidesView />;
      case 'planos':
        return <SubscriptionView />;
      case 'perfil':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCFD] dark:bg-[#171317] text-[#30232A] dark:text-[#FFF5F8] transition-colors selection:bg-[#A83260] selection:text-white">
      {/* 3D Floating Pill Mascot */}
      <FloatingPillCursor enabled={isPillMascotEnabled} />

      <Header />
      <BottomNav />

      {/* Pending verification alert banner if user uploaded receipt and is waiting for admin */}
      {pendingVerificationOrder && !user.isSubscribed && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 py-2.5 px-4 text-center text-xs text-amber-900 dark:text-amber-200">
          <span className="font-bold">Comprovativo Submetido:</span> A tua encomenda #{pendingVerificationOrder.id} ({pendingVerificationOrder.planName}) está em verificação manual pela nossa equipa em Luanda. O teu acesso premium será ativado assim que for validado.
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      <FloatingActionButton />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <AddAppointmentModal />
      <AddMedicationModal />
      <AddReminderModal />
      <LogSymptomModal />
      <CheckoutModal />
      <GuideDetailModal />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
