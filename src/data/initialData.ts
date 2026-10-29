import {
  UserProfile,
  SubscriptionPlan,
  Appointment,
  MedicationReminder,
  PersonalReminder,
  DailySymptomLog,
  ChecklistItem,
  PaymentOrder,
  PaymentConfig,
  AuditLogEvent,
  AppNotification
} from '../types';

export const DEVELOPER_ACCOUNT: UserProfile = {
  id: 'dev-keny-seixas',
  name: 'Keny Seixas (Desenvolvedor)',
  email: 'chillplaces9@gmail.com',
  password: 'kenyseixas9',
  role: 'admin',
  approvalStatus: 'aprovado',
  registeredAt: '2026-10-01T08:00:00Z',
  trialEndsAt: '2030-12-31T23:59:59Z',
  phone: '+244 923 000 999',
  province: 'Luanda',
  pregnancyStage: 'segundo_trimestre',
  confirmedWeek: 24,
  babyName: 'GraviFlow',
  notificationPrefs: {
    pushEnabled: true,
    medications: true,
    appointments: true,
    weeklyTips: true,
    sound: true
  },
  theme: 'light',
  isSubscribed: true,
  planId: 'anual',
  renewalDate: '2028-10-01',
  onboardingCompleted: true
};

export const INITIAL_USER: UserProfile = {
  id: 'user-ana-domingos',
  name: 'Ana Domingos',
  email: 'ana.domingos@exemplo.ao',
  password: 'senha123',
  role: 'user',
  approvalStatus: 'aprovado',
  registeredAt: '2026-10-26T08:00:00Z',
  trialEndsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days remaining of 3
  phone: '+244 923 456 789',
  province: 'Luanda',
  pregnancyStage: 'segundo_trimestre',
  lmpDate: '2026-05-12', // Cerca de 24 semanas
  eddDate: '2027-02-16', // DPA prevista
  confirmedWeek: 24,
  babyName: 'Serena',
  notificationPrefs: {
    pushEnabled: true,
    medications: true,
    appointments: true,
    weeklyTips: true,
    sound: true
  },
  theme: 'light',
  isSubscribed: false, // In 3-day trial period
  planId: undefined,
  renewalDate: undefined,
  onboardingCompleted: true
};

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  DEVELOPER_ACCOUNT,
  INITIAL_USER,
  {
    id: 'user-maria-fernanda',
    name: 'Maria Fernanda',
    email: 'maria.fernanda@exemplo.ao',
    password: 'senha123',
    role: 'user',
    approvalStatus: 'aprovado',
    registeredAt: '2026-10-25T10:00:00Z',
    trialEndsAt: '2026-10-28T10:00:00Z',
    phone: '+244 912 345 678',
    province: 'Benguela',
    pregnancyStage: 'terceiro_trimestre',
    confirmedWeek: 31,
    babyName: 'Mateus',
    notificationPrefs: {
      pushEnabled: true,
      medications: true,
      appointments: true,
      weeklyTips: true,
      sound: true
    },
    theme: 'light',
    isSubscribed: true,
    planId: 'trimestral',
    renewalDate: '2027-01-25',
    onboardingCompleted: true
  },
  {
    id: 'user-claudia-benguela',
    name: 'Cláudia Manuel',
    email: 'claudia.m@exemplo.ao',
    password: 'senha123',
    role: 'user',
    approvalStatus: 'pendente',
    registeredAt: '2026-10-27T06:30:00Z',
    trialEndsAt: '2026-10-30T06:30:00Z',
    phone: '+244 934 112 334',
    province: 'Huambo',
    pregnancyStage: 'primeiro_trimestre',
    confirmedWeek: 9,
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
  },
  {
    id: 'user-esperanca-luanda',
    name: 'Esperança João',
    email: 'esperanca.j@exemplo.ao',
    password: 'senha123',
    role: 'user',
    approvalStatus: 'reprovado',
    registeredAt: '2026-10-20T14:00:00Z',
    trialEndsAt: '2026-10-23T14:00:00Z',
    phone: '+244 945 889 001',
    province: 'Luanda',
    pregnancyStage: 'segundo_trimestre',
    confirmedWeek: 18,
    notificationPrefs: {
      pushEnabled: false,
      medications: true,
      appointments: true,
      weeklyTips: false,
      sound: true
    },
    theme: 'light',
    isSubscribed: false,
    onboardingCompleted: false
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'mensal',
    name: 'Plano Mensal',
    priceKz: 3000,
    billingPeriod: 'Cobrado mensalmente',
    description: 'Flexibilidade para cuidares de ti mês a mês, sem compromisso longo.',
    features: [
      'Acompanhamento semanal detalhado do bebé',
      'Calendário de consultas e exames pré-natais',
      'Lembretes ilimitados de medicação e tomas',
      'Acesso à biblioteca de guias educativos do MINSA',
      'Diário de sintomas e checklist de bem-estar',
      'Suporte atencioso por WhatsApp'
    ]
  },
  {
    id: 'trimestral',
    name: 'Plano Trimestral',
    priceKz: 9000,
    billingPeriod: 'Cobrado a cada 3 meses',
    description: 'Três meses de acompanhamento contínuo e organização médica completa.',
    isPopular: true,
    features: [
      'Tudo o que está incluído no Plano Mensal',
      'Biblioteca completa de guias adaptados a Angola',
      'Exportação de relatório médico para consultas',
      'Lista interativa completa da mala de maternidade',
      'Acesso prioritário a atualizações clínicas',
      'Lembretes dentro da aplicação'
    ]
  },
  {
    id: 'anual',
    name: 'Plano Anual',
    priceKz: 30000, // Preço promocional sugerido
    standardPriceKz: 36000,
    savingsKz: 6000,
    billingPeriod: 'Cobrado anualmente (12 meses)',
    description: 'Um ano inteiro de cuidado: da gestação aos primeiros meses de vida do bebé. Poupança direta de 6.000 Kz.',
    features: [
      'Tudo incluído no Trimestral por 12 meses',
      'Poupança de 6.000 Kz em relação a 12 mensalidades',
      'Acompanhamento estendido do pós-parto e resguardo',
      'Módulo exclusivo de amamentação e cuidados do recém-nascido',
      'Acesso total à biblioteca médica completa',
      'Contacto prioritário com equipa de enfermagem obstétrica'
    ]
  }
];

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  multicaixaNumber: '928 230 620',
  iban: '0006.0000.9641.0541.3010.7',
  bankIban: '0006.0000.9641.0541.3010.7',
  bankName: 'Banco Angolano de Investimentos (BAI)',
  accountHolder: 'Mãe Serena Cuidados Maternos',
  annualPriceKz: 30000,
  standardAnnualPriceKz: 36000
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    userId: 'user-ana-domingos',
    title: 'Consulta Pré-Natal de Rotina (24 Semanas)',
    category: 'prenatal',
    date: '2026-10-29',
    time: '09:30',
    clinicOrDoctor: 'Dra. Esperança Manuel',
    address: 'Maternidade Lucrécia Paim, Rua Amílcar Cabral',
    province: 'Luanda',
    notes: 'Levar a Caderneta da Grávida do MINSA e os últimos resultados de análises de urina e hemograma.',
    reminderMinutesBefore: 60,
    completed: false,
    createdAt: '2026-10-20T10:00:00Z'
  },
  {
    id: 'apt-2',
    userId: 'user-ana-domingos',
    title: 'Ecografia Morfológica do 2º Trimestre',
    category: 'ultrassom',
    date: '2026-11-06',
    time: '14:00',
    clinicOrDoctor: 'Dr. Afonso Quitumba',
    address: 'Clínica Sagrada Esperança, Ilha de Luanda',
    province: 'Luanda',
    notes: 'Avaliação detalhada dos órgãos, crescimento do feto e medição do colo do útero.',
    reminderMinutesBefore: 120,
    completed: false,
    createdAt: '2026-10-22T11:30:00Z'
  },
  {
    id: 'apt-3',
    userId: 'user-ana-domingos',
    title: 'Análise de Glicemia e Prova de Tolerância (PTGO)',
    category: 'analises',
    date: '2026-11-12',
    time: '07:30',
    clinicOrDoctor: 'Laboratório Central de Luanda',
    address: 'Mutamba, Luanda',
    province: 'Luanda',
    notes: 'Comparecer rigorosamente em jejum de 8 a 12 horas. Levar água mineral fechada.',
    reminderMinutesBefore: 60,
    completed: false,
    createdAt: '2026-10-24T14:15:00Z'
  }
];

export const INITIAL_MEDICATIONS: MedicationReminder[] = [
  {
    id: 'med-1',
    userId: 'user-ana-domingos',
    medicationName: 'Sulfato Ferroso + Ácido Fólico',
    dosage: '1 comprimido (60mg Fe + 400mcg AF)',
    instructions: 'Tomar após o almoço acompanhado de sumo de fruta natural com vitamina C (laranja ou maracujá). Evitar leite na mesma hora.',
    scheduleTimes: ['13:00'],
    frequency: 'daily',
    startDate: '2026-06-01',
    active: true,
    logs: [
      {
        id: 'log-1',
        date: '2026-10-26',
        time: '13:05',
        status: 'taken',
        loggedAt: '2026-10-26T12:05:00Z'
      },
      {
        id: 'log-2',
        date: '2026-10-25',
        time: '13:10',
        status: 'taken',
        loggedAt: '2026-10-25T12:10:00Z'
      }
    ]
  },
  {
    id: 'med-2',
    userId: 'user-ana-domingos',
    medicationName: 'Cálcio + Vitamina D3',
    dosage: '1 comprimido mastigável (500mg)',
    instructions: 'Mastigar à noite antes de deitar com um pequeno copo de água.',
    scheduleTimes: ['21:00'],
    frequency: 'daily',
    startDate: '2026-07-15',
    active: true,
    logs: [
      {
        id: 'log-3',
        date: '2026-10-26',
        time: '21:00',
        status: 'taken',
        loggedAt: '2026-10-26T20:00:00Z'
      }
    ]
  }
];

export const INITIAL_PERSONAL_REMINDERS: PersonalReminder[] = [
  {
    id: 'rem-1',
    userId: 'user-ana-domingos',
    title: 'Beber 2,5 litros de água tratada/filtrada ao longo do dia',
    date: '2026-10-27',
    time: '11:00',
    notes: 'Manter a garrafa de água fresca por perto para combater o calor de Luanda.',
    completed: false,
    createdAt: '2026-10-26T08:00:00Z'
  },
  {
    id: 'rem-2',
    userId: 'user-ana-domingos',
    title: 'Verificar se o mosquiteiro do quarto está bem fixado e sem furos',
    date: '2026-10-27',
    time: '18:30',
    notes: 'Prevenção ativa da malária é prioridade máxima em qualquer trimestre.',
    completed: true,
    createdAt: '2026-10-26T09:00:00Z'
  },
  {
    id: 'rem-3',
    userId: 'user-ana-domingos',
    title: 'Caminhada suave de 20 minutos no final da tarde',
    date: '2026-10-28',
    time: '17:30',
    notes: 'Estimular a circulação nas pernas e aliviar o cansaço lombar.',
    completed: false,
    createdAt: '2026-10-26T10:00:00Z'
  }
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    userId: 'user-ana-domingos',
    text: 'Tomar o comprimido de Sulfato Ferroso após o almoço',
    category: 'saude',
    completed: false
  },
  {
    id: 'chk-2',
    userId: 'user-ana-domingos',
    text: 'Anotar perguntas e dúvidas para a consulta na Maternidade Lucrécia Paim',
    category: 'exames',
    completed: true
  },
  {
    id: 'chk-3',
    userId: 'user-ana-domingos',
    text: 'Beber água mineral ou fervida (meta: 8 a 10 copos)',
    category: 'bem_estar',
    completed: false
  },
  {
    id: 'chk-4',
    userId: 'user-ana-domingos',
    text: 'Ler o guia sobre alimentação e culinária angolana',
    category: 'preparacao',
    completed: false
  },
  {
    id: 'chk-5',
    userId: 'user-ana-domingos',
    text: 'Descansar 20 minutos com as pernas ligeiramente elevadas',
    category: 'bem_estar',
    completed: false
  }
];

export const INITIAL_DAILY_LOG: DailySymptomLog = {
  id: 'log-today',
  userId: 'user-ana-domingos',
  date: '2026-10-27',
  mood: 'tranquila',
  energyLevel: 4,
  symptoms: ['Pequena dor nas costas', 'Bebé a mexer ativamente'],
  waterGlasses: 6,
  notes: 'Senti a Serena mexer bastante após o almoço! Uma sensação maravilhosa e reconfortante.',
  questionsForDoctor: 'A azia ligeira à noite requer algum antiácido prescrito?',
  createdAt: '2026-10-27T08:30:00Z'
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Consulta Pré-Natal em Breve',
    message: 'Tem consulta com a Dra. Esperança Manuel na Maternidade Lucrécia Paim no dia 29 de Outubro às 09:30.',
    type: 'appointment',
    unread: true,
    createdAt: '2026-10-27T06:00:00Z',
    linkSection: 'calendario'
  },
  {
    id: 'notif-2',
    title: 'Hora da Medicação',
    message: 'Lembre-se de tomar o Sulfato Ferroso após o almoço com sumo cítrico.',
    type: 'medication',
    unread: true,
    createdAt: '2026-10-27T05:30:00Z',
    linkSection: 'lembretes'
  },
  {
    id: 'notif-3',
    title: 'Semana 24 da Serena',
    message: 'O bebé atingiu o marco de viabilidade e agora tem o tamanho aproximado de uma espiga de milho doce!',
    type: 'milestone',
    unread: false,
    createdAt: '2026-10-26T09:00:00Z',
    linkSection: 'gravidez'
  }
];

export const INITIAL_PAYMENTS: PaymentOrder[] = [
  {
    id: 'ORD-2026-98214',
    userId: 'user-claudia-benguela',
    userName: 'Cláudia Manuel',
    userEmail: 'claudia.m@exemplo.ao',
    userPhone: '+244 934 112 334',
    planId: 'mensal',
    planName: 'Plano Mensal',
    amountKz: 3000,
    currency: 'Kz',
    method: 'multicaixa_express',
    paymentReference: 'MS-98214',
    transactionRef: 'MCX-20261027-8910',
    paidAmountKz: 3000,
    paymentDate: '2026-10-27',
    proofFileName: 'talao_mcx_express_3000kz.jpg',
    userComment: 'Pagamento efetuado às 14:30 via Multicaixa Express para o 928 230 620.',
    status: 'pending_verification', // For Admin to approve / reject!
    createdAt: '2026-10-27T14:32:00Z',
    submittedAt: '2026-10-27T14:35:00Z'
  },
  {
    id: 'ORD-2026-98205',
    userId: 'user-maria-fernanda',
    userName: 'Maria Fernanda',
    userEmail: 'maria.fernanda@exemplo.ao',
    userPhone: '+244 912 345 678',
    planId: 'trimestral',
    planName: 'Plano Trimestral',
    amountKz: 9000,
    currency: 'Kz',
    method: 'multicaixa_express',
    paymentReference: 'MS-98205',
    transactionRef: 'MCX-20261025-1102',
    paidAmountKz: 9000,
    paymentDate: '2026-10-25',
    proofFileName: 'comprovativo_bfa_9000.pdf',
    status: 'approved',
    adminNote: 'Comprovativo conferido no extrato BFA. Aprovado.',
    createdAt: '2026-10-25T10:00:00Z',
    submittedAt: '2026-10-25T10:15:00Z',
    reviewedAt: '2026-10-25T10:20:00Z',
    reviewedBy: 'chillplaces9@gmail.com'
  },
  {
    id: 'ORD-2026-98199',
    userId: 'user-ana-domingos',
    userName: 'Ana Domingos',
    userEmail: 'ana.domingos@exemplo.ao',
    userPhone: '+244 923 456 789',
    planId: 'anual',
    planName: 'Plano Anual Especial',
    amountKz: 30000,
    currency: 'Kz',
    method: 'transferencia',
    paymentReference: 'MS-98199',
    status: 'awaiting_payment',
    createdAt: '2026-10-28T04:10:00Z'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'audit-1',
    adminId: 'dev-keny-seixas',
    adminEmail: 'chillplaces9@gmail.com',
    action: 'approve_payment',
    targetId: 'ORD-2026-98205',
    details: 'Pagamento de 9.000 Kz aprovado para Maria Fernanda (Plano Trimestral). Subscrição ativada.',
    timestamp: '2026-10-25T10:20:00Z'
  },
  {
    id: 'audit-2',
    adminId: 'dev-keny-seixas',
    adminEmail: 'chillplaces9@gmail.com',
    action: 'update_config',
    details: 'Configuração de pagamento atualizada: Multicaixa 928 230 620, IBAN 0006.0000.9641.0541.3010.7.',
    timestamp: '2026-10-26T08:00:00Z'
  }
];
