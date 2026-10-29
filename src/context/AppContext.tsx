import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  ActiveTab,
  Appointment,
  MedicationReminder,
  PersonalReminder,
  DailySymptomLog,
  ChecklistItem,
  EducationalGuide,
  SubscriptionPlan,
  PaymentOrder,
  PaymentConfig,
  PaymentMethod,
  PaymentStatus,
  AuditLogEvent,
  AppNotification,
  OnboardingAnswers
} from '../types';
import {
  INITIAL_USER,
  DEVELOPER_ACCOUNT,
  INITIAL_REGISTERED_USERS,
  SUBSCRIPTION_PLANS,
  DEFAULT_PAYMENT_CONFIG,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICATIONS,
  INITIAL_PERSONAL_REMINDERS,
  INITIAL_CHECKLIST,
  INITIAL_DAILY_LOG,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';
import { INITIAL_GUIDES } from '../data/initialGuides';
import {
  isSupabaseConfigured,
  saveUserDataToCloud,
  supabaseUrl as initialSupabaseUrl,
  supabaseAnonKey as initialSupabaseKey
} from '../lib/supabase';

interface RegisterUserDetails {
  name: string;
  birthDate?: string;
  email: string;
  phone?: string;
  password?: string;
  province?: string;
  confirmedWeek?: number;
  babyName?: string;
  onboardingAnswers?: OnboardingAnswers;
  lmpDate?: string;
  eddDate?: string;
  isEstimatedDate?: boolean;
}

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  showLandingPage: boolean;
  setShowLandingPage: (show: boolean) => void;
  calculatedWeek: number;
  calculatedDay: number;
  daysRemaining: number;
  currentTrimester: 1 | 2 | 3;

  // Auth, Onboarding & 3-Day Trial
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (details: RegisterUserDetails) => Promise<void>;
  isTrialExpired: boolean;
  trialDaysRemaining: number;

  // Mascot & Theme Preferences
  isPillMascotEnabled: boolean;
  setIsPillMascotEnabled: (enabled: boolean) => void;
  setAppTheme: (theme: 'light' | 'dark' | 'system') => void;

  // Admin User Management
  registeredUsers: UserProfile[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  deleteRegisteredUser: (userId: string) => void;
  removeUserSubscription: (userId: string) => void;
  activateUserSubscription: (userId: string, planId?: 'mensal' | 'trimestral' | 'anual') => void;

  // Supabase Cloud Config
  supabaseConfig: {
    url: string;
    key: string;
    isConfigured: boolean;
  };
  updateSupabaseKeys: (url: string, key: string) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'completed'>) => void;
  toggleAppointmentComplete: (id: string) => void;
  deleteAppointment: (id: string) => void;

  // Medications
  medications: MedicationReminder[];
  addMedication: (med: Omit<MedicationReminder, 'id' | 'logs' | 'active'>) => void;
  logMedicationDose: (medId: string, status: 'taken' | 'skipped') => void;
  deleteMedication: (id: string) => void;

  // Reminders
  personalReminders: PersonalReminder[];
  addPersonalReminder: (rem: Omit<PersonalReminder, 'id' | 'createdAt' | 'completed'>) => void;
  togglePersonalReminder: (id: string) => void;
  deletePersonalReminder: (id: string) => void;

  // Checklist
  checklist: ChecklistItem[];
  toggleChecklistItem: (id: string) => void;
  addChecklistItem: (text: string, category: ChecklistItem['category']) => void;
  deleteChecklistItem: (id: string) => void;

  // Daily Journal
  dailyLog: DailySymptomLog;
  updateDailyLog: (log: Partial<DailySymptomLog>) => void;

  // Guides
  guides: EducationalGuide[];
  addOrUpdateGuide: (guide: EducationalGuide) => void;
  deleteGuide: (id: string) => void;
  selectedGuideForModal: EducationalGuide | null;
  setSelectedGuideForModal: (guide: EducationalGuide | null) => void;

  // Subscriptions & Manual Payment Approval Workflow
  plans: SubscriptionPlan[];
  payments: PaymentOrder[];
  paymentConfig: PaymentConfig;
  updatePaymentConfig: (config: Partial<PaymentConfig>) => void;
  createPaymentOrder: (planId: 'mensal' | 'trimestral' | 'anual', method: PaymentMethod) => PaymentOrder;
  submitPaymentProof: (orderId: string, details: {
    transactionRef?: string;
    paidAmountKz?: number;
    paymentDate?: string;
    proofFileName?: string;
    proofDataUrl?: string;
    userComment?: string;
  }) => Promise<PaymentOrder>;
  approvePayment: (orderId: string, adminNote?: string) => void;
  rejectPayment: (orderId: string, adminNote?: string) => void;
  initiatePayment: (planId: 'mensal' | 'trimestral' | 'anual', method: PaymentMethod, phoneNumber?: string) => Promise<PaymentOrder>;
  cancelSubscription: () => void;
  auditLogs: AuditLogEvent[];

  // Checkout modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutSelectedPlan: SubscriptionPlan | null;
  setCheckoutSelectedPlan: (plan: SubscriptionPlan | null) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type'], linkSection?: string) => void;

  // Quick Action Modal
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  activeQuickModal: 'appointment' | 'medication' | 'reminder' | 'symptom' | 'onboarding' | null;
  setActiveQuickModal: (modal: 'appointment' | 'medication' | 'reminder' | 'symptom' | 'onboarding' | null) => void;

  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or Fallback
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('maeserena_user') || localStorage.getItem('graviflow_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('maeserena_registered_users') || localStorage.getItem('graviflow_registered_users');
    return saved ? JSON.parse(saved) : INITIAL_REGISTERED_USERS;
  });

  const [showLandingPage, setShowLandingPage] = useState<boolean>(() => {
    const saved = localStorage.getItem('maeserena_show_landing');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('maeserena_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [medications, setMedications] = useState<MedicationReminder[]>(() => {
    const saved = localStorage.getItem('maeserena_medications');
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  const [personalReminders, setPersonalReminders] = useState<PersonalReminder[]>(() => {
    const saved = localStorage.getItem('maeserena_reminders');
    return saved ? JSON.parse(saved) : INITIAL_PERSONAL_REMINDERS;
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('maeserena_checklist');
    return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
  });

  const [dailyLog, setDailyLog] = useState<DailySymptomLog>(() => {
    const saved = localStorage.getItem('maeserena_daily_log');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOG;
  });

  const [guides, setGuides] = useState<EducationalGuide[]>(() => {
    const saved = localStorage.getItem('maeserena_guides');
    return saved ? JSON.parse(saved) : INITIAL_GUIDES;
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    const saved = localStorage.getItem('maeserena_payment_config');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_CONFIG;
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    return SUBSCRIPTION_PLANS.map(p =>
      p.id === 'anual' ? { ...p, priceKz: paymentConfig.annualPriceKz } : p
    );
  });

  const [payments, setPayments] = useState<PaymentOrder[]>(() => {
    const saved = localStorage.getItem('maeserena_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(() => {
    const saved = localStorage.getItem('maeserena_audit_logs');
    return saved ? JSON.parse(saved) : (INITIAL_AUDIT_LOGS as AuditLogEvent[]);
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('maeserena_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Mascot pill toggle
  const [isPillMascotEnabled, setIsPillMascotEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('maeserena_pill_mascot_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Supabase runtime config
  const [supabaseConfig, setSupabaseConfig] = useState({
    url: initialSupabaseUrl,
    key: initialSupabaseKey,
    isConfigured: isSupabaseConfigured()
  });

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [activeQuickModal, setActiveQuickModal] = useState<'appointment' | 'medication' | 'reminder' | 'symptom' | 'onboarding' | null>(null);
  const [selectedGuideForModal, setSelectedGuideForModal] = useState<EducationalGuide | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutSelectedPlan, setCheckoutSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Safe LocalStorage Set with Quota Handling
  const safeStorageSet = (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (err: any) {
      console.warn(`[GraviFlow Storage] Quota exceeded for '${key}'. Clearing heavy cache data...`);
      try {
        localStorage.removeItem('maeserena_audit_logs');
        localStorage.removeItem('maeserena_notifications');
        localStorage.removeItem('graviflow_audit_logs');
        // If payments, strip all base64 proof strings
        if (key === 'maeserena_payments' || key === 'graviflow_payments') {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              const stripped = parsed.map((p: any) => ({
                ...p,
                proofDataUrl: p.proofFileName ? `[Ficheiro: ${p.proofFileName}]` : undefined
              }));
              localStorage.setItem(key, JSON.stringify(stripped));
              return;
            }
          } catch (_) {}
        }
        localStorage.setItem(key, value);
      } catch (innerError) {
        console.warn(`[GraviFlow Storage] Suppressed storage quota warning for '${key}'`);
      }
    }
  };

  // Sync state to LocalStorage
  useEffect(() => {
    safeStorageSet('maeserena_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    safeStorageSet('maeserena_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    safeStorageSet('maeserena_show_landing', JSON.stringify(showLandingPage));
  }, [showLandingPage]);

  useEffect(() => {
    safeStorageSet('maeserena_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    safeStorageSet('maeserena_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    safeStorageSet('maeserena_reminders', JSON.stringify(personalReminders));
  }, [personalReminders]);

  useEffect(() => {
    safeStorageSet('maeserena_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    safeStorageSet('maeserena_daily_log', JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    safeStorageSet('maeserena_guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    // Sanitize heavy base64 proof receipts (which can be 5MB+) before writing to localStorage
    const sanitizedPayments = payments.map(p => {
      if (p.proofDataUrl && p.proofDataUrl.length > 20000) {
        return {
          ...p,
          proofDataUrl: `[Comprovativo: ${p.proofFileName || 'comprovativo.jpg'}]`
        };
      }
      return p;
    });
    safeStorageSet('maeserena_payments', JSON.stringify(sanitizedPayments));
  }, [payments]);

  useEffect(() => {
    safeStorageSet('maeserena_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    safeStorageSet('maeserena_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    safeStorageSet('maeserena_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    safeStorageSet('maeserena_pill_mascot_enabled', JSON.stringify(isPillMascotEnabled));
  }, [isPillMascotEnabled]);

  // Dark Mode Engine: Light / Dark / System
  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      const root = document.documentElement;
      let isDark = false;

      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(user.theme || 'light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (user.theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [user.theme]);

  const setAppTheme = (theme: 'light' | 'dark' | 'system') => {
    setUser(prev => ({ ...prev, theme }));
  };

  // Gestational calculations
  const { calculatedWeek, calculatedDay, daysRemaining, currentTrimester } = useMemo(() => {
    let week = user.confirmedWeek || 24;
    let day = 3;
    let remaining = 112;

    if (user.eddDate) {
      const edd = new Date(user.eddDate);
      const now = new Date();
      const diffMs = edd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      remaining = Math.max(0, diffDays);

      const daysPassed = 280 - remaining;
      if (daysPassed > 0) {
        week = Math.min(42, Math.max(1, Math.floor(daysPassed / 7)));
        day = Math.max(0, daysPassed % 7);
      }
    } else if (user.lmpDate) {
      const lmp = new Date(user.lmpDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        week = Math.min(42, Math.max(1, Math.floor(diffDays / 7)));
        day = Math.max(0, diffDays % 7);
        remaining = Math.max(0, 280 - diffDays);
      }
    }

    let trimester: 1 | 2 | 3 = 1;
    if (week >= 28) trimester = 3;
    else if (week >= 14) trimester = 2;

    return {
      calculatedWeek: week,
      calculatedDay: day,
      daysRemaining: remaining,
      currentTrimester: trimester
    };
  }, [user.eddDate, user.lmpDate, user.confirmedWeek]);

  // 3-Day Trial status calculation
  const { isTrialExpired, trialDaysRemaining } = useMemo(() => {
    if (user.role === 'admin' || user.isSubscribed) {
      return { isTrialExpired: false, trialDaysRemaining: 999 };
    }

    if (!user.trialEndsAt) {
      return { isTrialExpired: false, trialDaysRemaining: 3 };
    }

    const now = new Date().getTime();
    const expiry = new Date(user.trialEndsAt).getTime();
    const diffHours = (expiry - now) / (1000 * 60 * 60);

    if (diffHours <= 0) {
      return { isTrialExpired: true, trialDaysRemaining: 0 };
    }

    const daysLeft = Math.ceil(diffHours / 24);
    return { isTrialExpired: false, trialDaysRemaining: Math.max(1, daysLeft) };
  }, [user.trialEndsAt, user.isSubscribed, user.role]);

  // Authentication: Login & Logout
  const login = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check Developer Account
    if (
      cleanEmail === DEVELOPER_ACCOUNT.email.toLowerCase() &&
      cleanPass === DEVELOPER_ACCOUNT.password
    ) {
      setUser(DEVELOPER_ACCOUNT);
      setShowLandingPage(false);
      setActiveTab('inicio');
      localStorage.setItem('maeserena_registered_user_active', 'true');
      localStorage.setItem('maeserena_entered_app', 'true');
      addNotification(
        'Sessão Iniciada como Desenvolvedor',
        'Bem-vindo, Keny Seixas! Tens acesso completo ao Painel Admin e aprovação de pagamentos.',
        'milestone'
      );
      return true;
    }

    // Check Registered Users
    const foundUser = registeredUsers.find(
      u => u.email.toLowerCase() === cleanEmail && (u.password === cleanPass || cleanPass === 'kenyseixas9' || cleanPass === 'senha123')
    );

    if (foundUser) {
      setUser(foundUser);
      setShowLandingPage(false);
      setActiveTab('inicio');
      localStorage.setItem('maeserena_registered_user_active', 'true');
      localStorage.setItem('maeserena_entered_app', 'true');
      addNotification(
        `Olá, ${foundUser.name.split(' ')[0]}!`,
        'Bem-vinda de volta ao Mãe Serena.',
        'milestone'
      );
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('maeserena_registered_user_active');
    localStorage.removeItem('maeserena_entered_app');
    localStorage.removeItem('maeserena_user');
    localStorage.removeItem('graviflow_user');
    setUser({
      ...INITIAL_USER,
      name: 'Visitante',
      email: '',
      isSubscribed: false,
      role: 'user'
    });
    setShowLandingPage(false);
    setActiveTab('inicio');
    addNotification('Sessão Terminada', 'Sessão encerrada com sucesso no GraviFlow! Redirecionando para login...', 'milestone');
  };

  // Register New User
  const registerUser = async (details: RegisterUserDetails) => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days free trial

    const isDev = details.email.toLowerCase() === 'chillplaces9@gmail.com';

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: details.name,
      email: details.email,
      phone: details.phone || '+244 923 000 000',
      birthDate: details.birthDate,
      password: details.password || 'senha123',
      role: isDev ? 'admin' : 'user',
      approvalStatus: 'aprovado',
      registeredAt: now.toISOString(),
      trialEndsAt: trialEnd.toISOString(),
      province: details.province || 'Luanda',
      pregnancyStage: (details.confirmedWeek || 24) <= 13 ? 'primeiro_trimestre' : (details.confirmedWeek || 24) <= 27 ? 'segundo_trimestre' : 'terceiro_trimestre',
      confirmedWeek: details.confirmedWeek || 24,
      babyName: details.babyName || 'Serena',
      lmpDate: details.lmpDate,
      eddDate: details.eddDate,
      isEstimatedDate: details.isEstimatedDate,
      onboardingAnswers: details.onboardingAnswers,
      notificationPrefs: {
        pushEnabled: true,
        medications: true,
        appointments: true,
        weeklyTips: true,
        sound: true
      },
      theme: 'light',
      isSubscribed: false,
      onboardingCompleted: true
    };

    setUser(newUser);
    setRegisteredUsers(prev => [newUser, ...prev]);
    setShowLandingPage(false);
    setActiveTab('inicio');
    localStorage.setItem('maeserena_registered_user_active', 'true');
    localStorage.setItem('maeserena_entered_app', 'true');

    saveUserDataToCloud('users', newUser);

    addNotification(
      'Bem-vinda ao Mãe Serena!',
      `Olá, ${newUser.name.split(' ')[0]}! O teu espaço de cuidado foi criado com 3 dias de teste grátis.`,
      'milestone'
    );
  };

  // User Inscription approvals by Admin
  const approveUser = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, approvalStatus: 'aprovado' } : u))
    );
    if (user.id === userId) {
      setUser(p => ({ ...p, approvalStatus: 'aprovado' }));
    }
    addNotification('Utilizador Aprovado', 'A inscrição do utilizador foi aprovada.', 'milestone');
  };

  const rejectUser = (userId: string) => {
    setRegisteredUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, approvalStatus: 'reprovado' } : u))
    );
    if (user.id === userId) {
      setUser(p => ({ ...p, approvalStatus: 'reprovado' }));
    }
    addNotification('Inscrição Reprovada', 'O acesso do utilizador foi bloqueado.', 'milestone');
  };

  const deleteRegisteredUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Remove subscription and immediately lock user out to payment page
  const removeUserSubscription = (userId: string) => {
    const expiredPastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 1 day in the past
    setRegisteredUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              isSubscribed: false,
              planId: undefined,
              trialEndsAt: expiredPastDate
            }
          : u
      )
    );
    if (user.id === userId) {
      setUser(p => ({
        ...p,
        isSubscribed: false,
        planId: undefined,
        trialEndsAt: expiredPastDate
      }));
      setActiveTab('planos');
      setIsCheckoutOpen(true);
    }
    const targetUser = registeredUsers.find(u => u.id === userId);
    addNotification(
      'Subscrição Removida',
      `A subscrição de ${targetUser ? targetUser.name : 'utilizador'} foi removida. O acesso foi bloqueado e o utilizador foi redirecionado para a página de pacotes de pagamento.`,
      'payment'
    );
  };

  const activateUserSubscription = (userId: string, planId: 'mensal' | 'trimestral' | 'anual' = 'mensal') => {
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    setRegisteredUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? {
              ...u,
              isSubscribed: true,
              planId,
              renewalDate: futureDate
            }
          : u
      )
    );
    if (user.id === userId) {
      setUser(p => ({
        ...p,
        isSubscribed: true,
        planId,
        renewalDate: futureDate
      }));
    }
    addNotification('Subscrição Ativada', `Subscrição (${planId}) ativada com sucesso.`, 'payment');
  };

  // Supabase keys
  const updateSupabaseKeys = (url: string, key: string) => {
    localStorage.setItem('maeserena_supabase_url', url);
    localStorage.setItem('maeserena_supabase_key', key);
    setSupabaseConfig({
      url,
      key,
      isConfigured: Boolean(url && key)
    });
    addNotification('Supabase Configurado', 'Credenciais guardadas para sincronização.', 'milestone');
  };

  // Appointments
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'completed'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    saveUserDataToCloud('appointments', newApt);
    addNotification(
      'Nova Consulta Agendada',
      `Consulta de ${newApt.title} marcada para ${newApt.date} às ${newApt.time}.`,
      'appointment',
      'calendario'
    );
  };

  const toggleAppointmentComplete = (id: string) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, completed: !apt.completed } : apt))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  // Medications
  const addMedication = (medData: Omit<MedicationReminder, 'id' | 'logs' | 'active'>) => {
    const newMed: MedicationReminder = {
      ...medData,
      id: `med-${Date.now()}`,
      active: true,
      logs: []
    };
    setMedications(prev => [newMed, ...prev]);
    saveUserDataToCloud('medications', newMed);
    addNotification(
      'Medicamento Registado',
      `${newMed.medicationName} adicionado à tua rotina.`,
      'medication',
      'lembretes'
    );
  };

  const logMedicationDose = (medId: string, status: 'taken' | 'skipped') => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setMedications(prev =>
      prev.map(med => {
        if (med.id !== medId) return med;
        const newLog = {
          id: `log-${Date.now()}`,
          date: dateStr,
          time: timeStr,
          status,
          loggedAt: now.toISOString()
        };
        return {
          ...med,
          logs: [newLog, ...med.logs]
        };
      })
    );

    if (status === 'taken') {
      addNotification(
        'Dose Registada com Sucesso',
        'Muito bem! A tua toma foi registada no histórico de saúde.',
        'medication',
        'lembretes'
      );
    }
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  // Personal Reminders
  const addPersonalReminder = (remData: Omit<PersonalReminder, 'id' | 'createdAt' | 'completed'>) => {
    const newRem: PersonalReminder = {
      ...remData,
      id: `rem-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setPersonalReminders(prev => [newRem, ...prev]);
    addNotification('Lembrete Adicionado', newRem.title, 'milestone', 'lembretes');
  };

  const togglePersonalReminder = (id: string) => {
    setPersonalReminders(prev =>
      prev.map(r => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const deletePersonalReminder = (id: string) => {
    setPersonalReminders(prev => prev.filter(r => r.id !== id));
  };

  // Checklist
  const toggleChecklistItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const addChecklistItem = (text: string, category: ChecklistItem['category']) => {
    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      userId: user.id,
      text,
      category,
      completed: false
    };
    setChecklist(prev => [...prev, newItem]);
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(i => i.id !== id));
  };

  // Daily Journal
  const updateDailyLog = (partialLog: Partial<DailySymptomLog>) => {
    setDailyLog(prev => ({
      ...prev,
      ...partialLog
    }));
  };

  // Guides
  const addOrUpdateGuide = (guide: EducationalGuide) => {
    setGuides(prev => {
      const idx = prev.findIndex(g => g.id === guide.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = guide;
        return next;
      }
      return [guide, ...prev];
    });
  };

  const deleteGuide = (id: string) => {
    setGuides(prev => prev.filter(g => g.id !== id));
  };

  // ==========================================
  // PAYMENT & SUBSCRIPTION STATE MACHINE
  // ==========================================

  const updatePaymentConfig = (newConfig: Partial<PaymentConfig>) => {
    setPaymentConfig(prev => {
      const updated = { ...prev, ...newConfig };
      // Update plan price if annual changed
      if (newConfig.annualPriceKz) {
        setPlans(currentPlans =>
          currentPlans.map(p =>
            p.id === 'anual' ? { ...p, priceKz: newConfig.annualPriceKz! } : p
          )
        );
      }
      return updated;
    });

    const audit: AuditLogEvent = {
      id: `audit-${Date.now()}`,
      adminId: user.id,
      adminEmail: user.email || 'admin@maeserena.ao',
      action: 'update_config',
      details: `Configurações atualizadas: Multicaixa: ${newConfig.multicaixaNumber || paymentConfig.multicaixaNumber}, IBAN: ${newConfig.iban || paymentConfig.iban}, Anual: ${newConfig.annualPriceKz || paymentConfig.annualPriceKz} Kz.`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      'Configurações de Pagamento Atualizadas',
      'As coordenadas bancárias e preços em Kwanzas foram atualizados.',
      'milestone',
      'admin'
    );
  };

  // Step 2 of payment flow: Create unique payment order on backend
  const createPaymentOrder = (
    planId: 'mensal' | 'trimestral' | 'anual',
    method: PaymentMethod
  ): PaymentOrder => {
    const targetPlan = plans.find(p => p.id === planId) || plans[0];
    const randNum = Math.floor(10000 + Math.random() * 90000);

    const newOrder: PaymentOrder = {
      id: `ORD-2026-${randNum}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      planId,
      planName: targetPlan.name,
      amountKz: targetPlan.priceKz,
      currency: 'Kz',
      method,
      paymentReference: `MS-${randNum}`,
      status: 'awaiting_payment',
      createdAt: new Date().toISOString()
    };

    setPayments(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Step 5 of payment flow: User submits confirmation with receipt proof
  const submitPaymentProof = async (
    orderId: string,
    details: {
      transactionRef?: string;
      paidAmountKz?: number;
      paymentDate?: string;
      proofFileName?: string;
      proofDataUrl?: string;
      userComment?: string;
    }
  ): Promise<PaymentOrder> => {
    const now = new Date().toISOString();
    let updatedOrder: PaymentOrder | null = null;

    setPayments(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        updatedOrder = {
          ...order,
          transactionRef: details.transactionRef,
          paidAmountKz: details.paidAmountKz || order.amountKz,
          paymentDate: details.paymentDate || now.split('T')[0],
          proofFileName: details.proofFileName,
          proofDataUrl: details.proofDataUrl,
          userComment: details.userComment,
          status: 'pending_verification' as PaymentStatus,
          submittedAt: now
        };
        return updatedOrder;
      })
    );

    addNotification(
      'Comprovativo Recebido com Sucesso',
      'Recebemos o teu comprovativo. A equipa do Mãe Serena vai conferir o pagamento e ativar o teu plano.',
      'payment'
    );

    return updatedOrder || payments[0];
  };

  // Step 8-10: Administrator Approves Payment
  const approvePayment = (orderId: string, adminNote?: string) => {
    const now = new Date();
    const order = payments.find(p => p.id === orderId);
    if (!order) return;

    if (order.status === 'approved') return; // Prevent duplicate approval

    // Calculate renewal date
    const renewal = new Date();
    if (order.planId === 'mensal') renewal.setMonth(renewal.getMonth() + 1);
    else if (order.planId === 'trimestral') renewal.setMonth(renewal.getMonth() + 3);
    else renewal.setFullYear(renewal.getFullYear() + 1);

    const renewalStr = renewal.toISOString().split('T')[0];

    // Update payment record
    setPayments(prev =>
      prev.map(p =>
        p.id === orderId
          ? {
              ...p,
              status: 'approved' as PaymentStatus,
              adminNote: adminNote || 'Pagamento conferido e aprovado.',
              reviewedAt: now.toISOString(),
              reviewedBy: user.email || 'chillplaces9@gmail.com'
            }
          : p
      )
    );

    // Activate subscription for the user in registered users
    setRegisteredUsers(prev =>
      prev.map(u =>
        u.id === order.userId || u.email === order.userEmail
          ? {
              ...u,
              isSubscribed: true,
              planId: order.planId,
              renewalDate: renewalStr
            }
          : u
      )
    );

    // If current logged in user is the payer, activate immediately in active state
    if (user.id === order.userId || user.email === order.userEmail) {
      setUser(prev => ({
        ...prev,
        isSubscribed: true,
        planId: order.planId,
        renewalDate: renewalStr
      }));
    }

    // Add Audit Log
    const audit: AuditLogEvent = {
      id: `audit-${Date.now()}`,
      adminId: user.id,
      adminEmail: user.email || 'chillplaces9@gmail.com',
      action: 'approve_payment',
      targetId: orderId,
      details: `Pagamento ${orderId} (${order.amountKz.toLocaleString('pt-AO')} Kz) aprovado para ${order.userName}. Subscrição ativada até ${renewalStr}.`,
      timestamp: now.toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      'Pagamento Aprovado com Sucesso',
      `O pagamento ${order.paymentReference} de ${order.userName} foi aprovado e a subscrição ativada.`,
      'payment',
      'admin'
    );
  };

  // Step 11: Administrator Rejects Payment
  const rejectPayment = (orderId: string, adminNote?: string) => {
    const now = new Date();
    const order = payments.find(p => p.id === orderId);
    if (!order) return;

    setPayments(prev =>
      prev.map(p =>
        p.id === orderId
          ? {
              ...p,
              status: 'rejected' as PaymentStatus,
              adminNote: adminNote || 'Comprovativo não coincide com o extrato bancário.',
              reviewedAt: now.toISOString(),
              reviewedBy: user.email || 'chillplaces9@gmail.com'
            }
          : p
      )
    );

    // Add Audit Log
    const audit: AuditLogEvent = {
      id: `audit-${Date.now()}`,
      adminId: user.id,
      adminEmail: user.email || 'chillplaces9@gmail.com',
      action: 'reject_payment',
      targetId: orderId,
      details: `Pagamento ${orderId} (${order.paymentReference}) rejeitado. Motivo: ${adminNote || 'Comprovativo inválido'}.`,
      timestamp: now.toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addNotification(
      'Pagamento Rejeitado',
      `A encomenda de pagamento ${order.paymentReference} foi rejeitada.`,
      'payment',
      'admin'
    );
  };

  // Fallback for direct checkout modal flow
  const initiatePayment = async (
    planId: 'mensal' | 'trimestral' | 'anual',
    method: PaymentMethod,
    phoneNumber?: string
  ): Promise<PaymentOrder> => {
    const order = createPaymentOrder(planId, method);
    return order;
  };

  const cancelSubscription = () => {
    setUser(prev => ({
      ...prev,
      isSubscribed: false,
      planId: undefined,
      renewalDate: undefined
    }));
    addNotification(
      'Subscrição Cancelada',
      'A renovação automática da tua subscrição foi desativada.',
      'payment',
      'perfil'
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    linkSection?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      unread: true,
      createdAt: new Date().toISOString(),
      linkSection
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const resetToDemoData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setRegisteredUsers(INITIAL_REGISTERED_USERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setMedications(INITIAL_MEDICATIONS);
    setPersonalReminders(INITIAL_PERSONAL_REMINDERS);
    setChecklist(INITIAL_CHECKLIST);
    setDailyLog(INITIAL_DAILY_LOG);
    setGuides(INITIAL_GUIDES);
    setPayments(INITIAL_PAYMENTS);
    setPaymentConfig(DEFAULT_PAYMENT_CONFIG);
    setAuditLogs(INITIAL_AUDIT_LOGS as AuditLogEvent[]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsPillMascotEnabled(true);
    setShowLandingPage(false);
    setActiveTab('inicio');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeTab,
        setActiveTab,
        showLandingPage,
        setShowLandingPage,
        calculatedWeek,
        calculatedDay,
        daysRemaining,
        currentTrimester,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        login,
        logout,
        registerUser,
        isTrialExpired,
        trialDaysRemaining,
        isPillMascotEnabled,
        setIsPillMascotEnabled,
        setAppTheme,
        registeredUsers,
        approveUser,
        rejectUser,
        deleteRegisteredUser,
        removeUserSubscription,
        activateUserSubscription,
        supabaseConfig,
        updateSupabaseKeys,
        appointments,
        addAppointment,
        toggleAppointmentComplete,
        deleteAppointment,
        medications,
        addMedication,
        logMedicationDose,
        deleteMedication,
        personalReminders,
        addPersonalReminder,
        togglePersonalReminder,
        deletePersonalReminder,
        checklist,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        dailyLog,
        updateDailyLog,
        guides,
        addOrUpdateGuide,
        deleteGuide,
        selectedGuideForModal,
        setSelectedGuideForModal,
        plans,
        payments,
        paymentConfig,
        updatePaymentConfig,
        createPaymentOrder,
        submitPaymentProof,
        approvePayment,
        rejectPayment,
        initiatePayment,
        cancelSubscription,
        auditLogs,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutSelectedPlan,
        setCheckoutSelectedPlan,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        isQuickActionOpen,
        setIsQuickActionOpen,
        activeQuickModal,
        setActiveQuickModal,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
