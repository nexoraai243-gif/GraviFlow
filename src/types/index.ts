export type PregnancyStage = 'tentante' | 'primeiro_trimestre' | 'segundo_trimestre' | 'terceiro_trimestre' | 'pos_parto';

export type UserRole = 'user' | 'admin';
export type ApprovalStatus = 'aprovado' | 'pendente' | 'reprovado';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  registeredAt: string; // ISO date
  trialEndsAt: string; // ISO date (3 days after registration)
  phone?: string;
  birthDate?: string; // Data de nascimento (AAAA-MM-DD)
  province: string; // ex: Luanda, Benguela, Huambo, Huíla, Cabinda
  pregnancyStage: PregnancyStage;
  lmpDate?: string; // Data da Última Menstruação (DUM)
  eddDate?: string; // Data Provável do Parto (DPA)
  confirmedWeek?: number; // Semana confirmada por ecografia
  babyName?: string;
  onboardingAnswers?: OnboardingAnswers;
  isEstimatedDate?: boolean;
  notificationPrefs: {
    pushEnabled: boolean;
    medications: boolean;
    appointments: boolean;
    weeklyTips: boolean;
    sound: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  isSubscribed: boolean;
  planId?: 'mensal' | 'trimestral' | 'anual';
  renewalDate?: string;
  onboardingCompleted: boolean;
}

export interface PregnancyWeekInfo {
  week: number;
  trimester: 1 | 2 | 3;
  babySizeComparison: string; // Ex: "Semente de Romã", "Abacate da Huíla", "Manga Madura"
  sizeCategory: string; // Ex: Fruta, Semente, Vegetal
  babyWeightGrams: number;
  babyLengthCm: number;
  fetalDevelopmentSummary: string;
  maternalChanges: string;
  angolaCareTip: string; // Dica contextualizada para Angola (nutrição, malária, hidratação)
  milestoneTitle: string;
  questionsForDoctor: string[];
}

export type AppointmentCategory = 'prenatal' | 'ultrassom' | 'analises' | 'dentista' | 'urgencia' | 'outra';

export interface Appointment {
  id: string;
  userId: string;
  title: string;
  category: AppointmentCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  clinicOrDoctor: string;
  address?: string;
  province?: string;
  notes?: string;
  reminderMinutesBefore: number;
  completed: boolean;
  createdAt: string;
}

export type MedicationFrequency = 'daily' | 'twice_daily' | 'thrice_daily' | 'weekly' | 'as_needed';

export interface MedicationLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'taken' | 'skipped';
  loggedAt: string;
}

export interface MedicationReminder {
  id: string;
  userId: string;
  medicationName: string; // Ex: Ácido Fólico, Sulfato Ferroso
  dosage: string; // Ex: 400 mcg, 1 comprimido
  instructions: string; // Ex: Tomar após o pequeno-almoço com sumo natural
  scheduleTimes: string[]; // Ex: ["08:00"]
  frequency: MedicationFrequency;
  startDate: string;
  endDate?: string;
  active: boolean;
  logs: MedicationLog[];
}

export interface PersonalReminder {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface DailySymptomLog {
  id: string;
  userId: string;
  date: string;
  mood: 'radiante' | 'tranquila' | 'cansada' | 'sensivel' | 'enjoada' | 'ansiosa';
  energyLevel: number; // 1 a 5
  symptoms: string[];
  waterGlasses: number;
  notes?: string;
  questionsForDoctor?: string;
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  userId: string;
  text: string;
  category: 'saude' | 'exames' | 'bem_estar' | 'preparacao';
  completed: boolean;
  dueDate?: string;
}

export interface GuideSection {
  heading: string;
  body: string;
}

export interface EducationalGuide {
  id: string;
  slug: string;
  title: string;
  category: 'primeiro_trimestre' | 'segundo_trimestre' | 'terceiro_trimestre' | 'alimentacao' | 'sono' | 'consultas' | 'parto' | 'mala_maternidade' | 'pos_parto' | 'amamentacao' | 'saude_emocional' | 'sinais_alerta';
  readTimeMinutes: number;
  shortIntro: string;
  sections: GuideSection[];
  questionsForDoctor: string[];
  medicalReviewDate: string;
  reviewerName: string;
  reviewerTitle: string;
  published: boolean;
  isFree: boolean;
  isUrgentAlert?: boolean;
}

export interface OnboardingAnswers {
  phase: 'gravida' | 'planeando' | 'preparando';
  weekKnowledge?: 'sei_semanas' | 'tenho_dpa' | 'nao_sei';
  planningGoal?: 'preparar_consultas' | 'aprender_saude' | 'organizar_cuidados';
  trackingTopics: string[];
  reminderPreference: 'notificacoes_dispositivo' | 'lembretes_app' | 'configurar_depois';
}

export interface SubscriptionPlan {
  id: 'mensal' | 'trimestral' | 'anual';
  name: string;
  priceKz: number;
  billingPeriod: string;
  description: string;
  savingsKz?: number;
  standardPriceKz?: number;
  features: string[];
  isPopular?: boolean;
}

export type PaymentMethod = 'multicaixa_express' | 'transferencia';

export type PaymentStatus = 
  | 'awaiting_payment'
  | 'pending_verification'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'expired';

export interface PaymentOrder {
  id: string; // ex: "ORD-2026-8941"
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  planId: 'mensal' | 'trimestral' | 'anual';
  planName: string;
  amountKz: number;
  currency: 'Kz';
  method: PaymentMethod;
  paymentReference: string; // Código de referência único gerado
  transactionRef?: string; // ID da transação ou Talão do Multicaixa/Banco
  paidAmountKz?: number;
  paymentDate?: string;
  proofFileName?: string;
  proofDataUrl?: string; // Data URL for uploaded receipt image/pdf preview
  userComment?: string;
  adminNote?: string;
  status: PaymentStatus;
  createdAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PaymentConfig {
  multicaixaNumber: string; // Ex: "928 230 620"
  iban: string; // Ex: "0006.0000.9641.0541.3010.7"
  bankIban?: string; // Alias for backward compatibility
  bankName?: string; // Ex: "Banco Angolano de Investimentos (BAI)"
  accountHolder?: string; // Ex: "Mãe Serena Saúde Digital Lda"
  annualPriceKz: number; // Ex: 30000 (promocional)
  standardAnnualPriceKz: number; // Ex: 36000
}

export interface AuditLogEvent {
  id: string;
  adminId: string;
  adminEmail: string;
  action: 'approve_payment' | 'reject_payment' | 'update_config' | 'approve_user' | 'reject_user' | 'delete_user';
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'medication' | 'guide' | 'payment' | 'milestone';
  unread: boolean;
  createdAt: string;
  linkSection?: string;
}

export type RecipeCategory = 
  | 'anti_enjoo' 
  | 'ferro_anemia' 
  | 'calcio_ossos' 
  | 'energia_fibras' 
  | 'hidratacao' 
  | 'lanches';

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  trimester: '1' | '2' | '3' | 'todos';
  prepTimeMinutes: number;
  servings: string;
  difficulty: 'Fácil' | 'Médio';
  shortDescription: string;
  imageEmoji: string;
  bgGradient: string;
  ingredients: string[];
  instructions: string[];
  maternalBenefit: string;
  fetalBenefit: string;
  doctorTip: string;
  tags: string[];
}

export type ActiveTab = 'inicio' | 'gravidez' | 'calendario' | 'lembretes' | 'receitas' | 'guias' | 'perfil' | 'planos' | 'admin';
