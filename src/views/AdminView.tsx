import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  CreditCard,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Database,
  Clock,
  Check,
  Search,
  ExternalLink,
  Save,
  FileText,
  FileImage,
  DollarSign,
  Smartphone,
  Building2,
  History,
  Eye,
  X
} from 'lucide-react';
import { EducationalGuide, PaymentOrder, PaymentStatus } from '../types';

export const AdminView: React.FC = () => {
  const {
    user,
    guides,
    addOrUpdateGuide,
    deleteGuide,
    plans,
    payments,
    paymentConfig,
    updatePaymentConfig,
    approvePayment,
    rejectPayment,
    registeredUsers,
    approveUser,
    rejectUser,
    deleteRegisteredUser,
    removeUserSubscription,
    activateUserSubscription,
    auditLogs,
    supabaseConfig,
    updateSupabaseKeys,
    addNotification
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'payments' | 'config' | 'users' | 'audit' | 'guides' | 'supabase'>('payments');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  // Payment approval / rejection modal state
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<PaymentOrder | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view_receipt' | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Payment configuration state
  const [mcxNumber, setMcxNumber] = useState(paymentConfig.multicaixaNumber);
  const [ibanNumber, setIbanNumber] = useState(paymentConfig.iban);
  const [annualKz, setAnnualKz] = useState(paymentConfig.annualPriceKz);
  const [configSaveSuccess, setConfigSaveSuccess] = useState(false);

  // Supabase input states
  const [inputUrl, setInputUrl] = useState(supabaseConfig.url || '');
  const [inputKey, setInputKey] = useState(supabaseConfig.key || '');
  const [saveCloudSuccess, setSaveCloudSuccess] = useState(false);

  // Guide creation form state
  const [isCreatingGuide, setIsCreatingGuide] = useState(false);
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideCategory, setNewGuideCategory] = useState<EducationalGuide['category']>('alimentacao');
  const [newGuideIntro, setNewGuideIntro] = useState('');
  const [newGuideSectionTitle, setNewGuideSectionTitle] = useState('Orientações Práticas');
  const [newGuideSectionBody, setNewGuideSectionBody] = useState('');
  const [newGuideReviewer, setNewGuideReviewer] = useState('Dra. Esperança Manuel');
  const [newGuideTitleReviewer, setNewGuideTitleReviewer] = useState('Ginecologista e Obstetra');
  const [newGuideIsFree, setNewGuideIsFree] = useState(false);

  // Strict Developer / Admin Access Check
  if (user.role !== 'admin' && user.email !== 'chillplaces9@gmail.com') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="font-serif-accent font-bold text-2xl text-[#30232A] dark:text-[#FFF5F8]">
          Acesso Exclusivo do Desenvolvedor
        </h2>
        <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
          Este painel é de uso estritamente restrito à conta de desenvolvedor (<strong>chillplaces9@gmail.com</strong>).
        </p>
      </div>
    );
  }

  // Filter payments
  const filteredPayments = payments.filter(p => {
    if (paymentStatusFilter === 'all') return true;
    return p.status === paymentStatusFilter;
  });

  const pendingPaymentsCount = payments.filter(p => p.status === 'pending_verification').length;

  // Filter users
  const filteredUsers = registeredUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.province.toLowerCase().includes(userSearch.toLowerCase())
  );

  const totalRevenueKz = payments
    .filter(p => p.status === 'approved')
    .reduce((acc, curr) => acc + curr.amountKz, 0);

  const handleSavePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentConfig({
      multicaixaNumber: mcxNumber.trim(),
      iban: ibanNumber.trim(),
      annualPriceKz: Number(annualKz) || 30000
    });
    setConfigSaveSuccess(true);
    setTimeout(() => setConfigSaveSuccess(false), 3000);
  };

  const handleConfirmAction = () => {
    if (!selectedOrderForAction) return;

    if (actionType === 'approve') {
      approvePayment(selectedOrderForAction.id, adminNoteInput);
    } else if (actionType === 'reject') {
      rejectPayment(selectedOrderForAction.id, adminNoteInput);
    }

    setSelectedOrderForAction(null);
    setActionType(null);
    setAdminNoteInput('');
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseKeys(inputUrl.trim(), inputKey.trim());
    setSaveCloudSuccess(true);
    setTimeout(() => setSaveCloudSuccess(false), 3000);
  };

  const handleCreateGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideTitle || !newGuideIntro || !newGuideSectionBody) return;

    const newGuide: EducationalGuide = {
      id: `guia-${Date.now()}`,
      slug: newGuideTitle.toLowerCase().replace(/\s+/g, '-'),
      title: newGuideTitle,
      category: newGuideCategory,
      readTimeMinutes: 5,
      shortIntro: newGuideIntro,
      sections: [
        {
          heading: newGuideSectionTitle,
          body: newGuideSectionBody
        }
      ],
      questionsForDoctor: [
        'Como aplicar estas orientações no meu caso clínico em Angola?',
        'Existe alguma restrição individual?'
      ],
      medicalReviewDate: '28 de Outubro de 2026',
      reviewerName: newGuideReviewer,
      reviewerTitle: newGuideTitleReviewer,
      published: true,
      isFree: newGuideIsFree
    };

    addOrUpdateGuide(newGuide);
    setIsCreatingGuide(false);
    setNewGuideTitle('');
    setNewGuideIntro('');
    setNewGuideSectionBody('');
    addNotification('Guia Publicado', `O guia "${newGuide.title}" foi adicionado à biblioteca.`, 'guide');
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                Painel do Desenvolvedor & Administração
              </span>
              {pendingPaymentsCount > 0 && (
                <span className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                  {pendingPaymentsCount} Pagamento{pendingPaymentsCount > 1 ? 's' : ''} a validar
                </span>
              )}
            </div>
            <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#70213F] dark:text-[#FFF5F8] mt-1">
              GraviFlow • Controlo Global
            </h1>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
              Sessão iniciada como: <strong className="text-[#30232A] dark:text-white">{user.email}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 text-right">
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 block font-medium">Receita Aprovada</span>
              <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                {totalRevenueKz.toLocaleString('pt-AO')} Kz
              </span>
            </div>

            <div className="px-3 py-2 bg-rose-50 dark:bg-[#30232D] rounded-xl border border-rose-200 text-right">
              <span className="text-[10px] text-[#A83260] dark:text-[#E878A0] block font-medium">Utilizadores</span>
              <span className="text-sm font-extrabold text-[#70213F] dark:text-[#FFF5F8]">
                {registeredUsers.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-rose-100 dark:border-[#493642]">
          <button
            onClick={() => setActiveAdminTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'payments'
                ? 'bg-[#70213F] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#1A1218] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Aprovações de Pagamento</span>
            {pendingPaymentsCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {pendingPaymentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'config'
                ? 'bg-[#70213F] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#1A1218] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Coordenadas Multicaixa / IBAN</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'users'
                ? 'bg-[#70213F] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#1A1218] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Utilizadores Inscritos</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'audit'
                ? 'bg-[#70213F] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#1A1218] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Registo de Auditoria</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('guides')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'guides'
                ? 'bg-[#70213F] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#1A1218] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca de Guias</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('supabase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeAdminTab === 'supabase'
                ? 'bg-[#70213F] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#1A1218] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase API</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PAYMENT APPROVALS QUEUE (Section 14 & 15) */}
      {activeAdminTab === 'payments' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                  Fila de Pagamentos & Validação Manual
                </h3>
                <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                  Confere os comprovativos de Multicaixa Express e transferências bancárias em Angola antes de ativar subscrições.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-neutral-500 text-[11px]">Filtrar:</span>
                <select
                  value={paymentStatusFilter}
                  onChange={e => setPaymentStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-white dark:bg-[#1A1218] text-xs font-semibold"
                >
                  <option value="all">Todos os Estados</option>
                  <option value="pending_verification">Pendentes de Aprovação</option>
                  <option value="approved">Aprovados</option>
                  <option value="rejected">Rejeitados</option>
                  <option value="awaiting_payment">Aguardando Pagamento</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-rose-100 dark:border-[#3D2C39] text-[#796A72] dark:text-[#C8B8C1]">
                    <th className="py-3 px-3 font-semibold">Ref / Encomenda</th>
                    <th className="py-3 px-3 font-semibold">Utilizador & Contacto</th>
                    <th className="py-3 px-3 font-semibold">Plano</th>
                    <th className="py-3 px-3 font-semibold">Montante</th>
                    <th className="py-3 px-3 font-semibold">Método</th>
                    <th className="py-3 px-3 font-semibold">Comprovativo</th>
                    <th className="py-3 px-3 font-semibold">Estado</th>
                    <th className="py-3 px-3 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/60 dark:divide-[#3D2C39]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-neutral-400">
                        Nenhum pagamento encontrado com este filtro.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map(order => (
                      <tr key={order.id} className="hover:bg-neutral-50/60 dark:hover:bg-[#1E171F] transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#70213F] dark:text-[#E878A0]">
                          {order.paymentReference}
                          <span className="block text-[10px] text-neutral-400 font-sans">{order.id}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold block text-[#30232A] dark:text-[#FFF5F8]">{order.userName}</span>
                          <span className="text-[11px] text-neutral-500 block">{order.userEmail}</span>
                          {order.userPhone && (
                            <span className="text-[10px] text-neutral-400">{order.userPhone}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-medium">{order.planName}</td>
                        <td className="py-3 px-3 font-bold text-base text-[#70213F] dark:text-[#FFF5F8]">
                          {order.amountKz.toLocaleString('pt-AO')} Kz
                        </td>
                        <td className="py-3 px-3">
                          <span className="capitalize text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
                            {order.method === 'multicaixa_express' ? 'Multicaixa Express' : 'Transferência'}
                          </span>
                          {order.transactionRef && (
                            <span className="block font-mono text-[10px] text-neutral-400 truncate max-w-[120px]">
                              {order.transactionRef}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {order.proofFileName || order.proofDataUrl ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOrderForAction(order);
                                setActionType('view_receipt');
                              }}
                              className="text-[11px] font-bold text-[#A83260] hover:underline flex items-center gap-1"
                            >
                              <FileImage className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[100px]">{order.proofFileName || 'Ver Talão'}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-neutral-400">Sem ficheiro</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              order.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : order.status === 'pending_verification'
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 animate-pulse'
                                : order.status === 'rejected'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                                : 'bg-neutral-100 text-neutral-600 dark:bg-[#30232D]'
                            }`}
                          >
                            {order.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {order.status === 'pending_verification' && <Clock className="w-3 h-3" />}
                            {order.status === 'approved'
                              ? 'Aprovado'
                              : order.status === 'pending_verification'
                              ? 'Pendente'
                              : order.status === 'rejected'
                              ? 'Rejeitado'
                              : 'Aguardando'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForAction(order);
                                  setActionType('approve');
                                  setAdminNoteInput('Comprovativo conferido no extrato bancário. Aprovado.');
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs transition-colors"
                              >
                                Aprovar
                              </button>
                            )}

                            {order.status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderForAction(order);
                                  setActionType('reject');
                                  setAdminNoteInput('Valor não localizado no extrato Multicaixa.');
                                }}
                                className="px-2 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg font-semibold text-[11px] transition-colors"
                              >
                                Rejeitar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIGURAÇÃO DE COORDENADAS (MULTICAIXA & IBAN) */}
      {activeAdminTab === 'config' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4 max-w-2xl">
            <div>
              <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Coordenadas de Pagamento em Angola
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Define o número de telemóvel do Multicaixa Express e o IBAN bancário oficial onde os utilizadores devem efetuar transferências.
              </p>
            </div>

            {configSaveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Coordenadas e preços guardados com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSavePaymentConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Número Recetor do Multicaixa Express
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={mcxNumber}
                    onChange={e => setMcxNumber(e.target.value)}
                    placeholder="928 230 620"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#1A1218] text-xs font-mono font-bold focus:border-[#A83260]"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">Configurado de origem: 928 230 620</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  IBAN Bancário para Transferências
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={ibanNumber}
                    onChange={e => setIbanNumber(e.target.value)}
                    placeholder="0006.0000.9641.0541.3010.7"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#1A1218] text-xs font-mono font-bold focus:border-[#A83260]"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">Configurado de origem: 0006.0000.9641.0541.3010.7</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Preço Promocional do Plano Anual (Kz)
                </label>
                <input
                  type="number"
                  required
                  value={annualKz}
                  onChange={e => setAnnualKz(Number(e.target.value))}
                  placeholder="30000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#1A1218] text-xs font-bold focus:border-[#A83260]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Preço padrão de 12 meses: 36.000 Kz. A 30.000 Kz o cliente poupa 6.000 Kz.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-900/20"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Coordenadas e Preços</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED USERS MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                  Utilizadores Cadastrados ({registeredUsers.length})
                </h3>
                <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                  Aprova ou reprova inscrições e gere os acessos à plataforma.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#1A1218] text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-rose-100 dark:border-[#3D2C39] text-[#796A72]">
                    <th className="py-2.5 px-3">Nome</th>
                    <th className="py-2.5 px-3">Email & Contacto</th>
                    <th className="py-2.5 px-3">Província</th>
                    <th className="py-2.5 px-3">Semana / Fase</th>
                    <th className="py-2.5 px-3">Subscrição</th>
                    <th className="py-2.5 px-3">Inscrição</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/60 dark:divide-[#3D2C39]">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-[#1E171F]">
                      <td className="py-2.5 px-3 font-semibold text-[#30232A] dark:text-[#FFF5F8]">
                        {u.name}
                        {u.role === 'admin' && (
                          <span className="ml-1.5 text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 px-1.5 py-0.5 rounded-full font-bold">
                            Dev Admin
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="block">{u.email}</span>
                        {u.phone && <span className="text-[10px] text-neutral-400">{u.phone}</span>}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{u.province}</td>
                      <td className="py-2.5 px-3">
                        {u.confirmedWeek ? `Semana ${u.confirmedWeek}` : 'Planeamento'}
                      </td>
                      <td className="py-2.5 px-3">
                        {u.isSubscribed ? (
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                            {u.planId || 'Ativa'}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold text-[10px]">Teste Grátis</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.approvalStatus === 'aprovado'
                              ? 'bg-emerald-100 text-emerald-800'
                              : u.approvalStatus === 'reprovado'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.approvalStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {u.role !== 'admin' && (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {u.isSubscribed ? (
                              <button
                                onClick={() => removeUserSubscription(u.id)}
                                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                title="Remover subscrição e enviar utilizador diretamente para a página de pacotes de pagamento"
                              >
                                Remover Subscrição
                              </button>
                            ) : (
                              <button
                                onClick={() => activateUserSubscription(u.id, 'mensal')}
                                className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                title="Ativar subscrição manualmente para este utilizador"
                              >
                                Ativar Subscrição
                              </button>
                            )}

                            {u.approvalStatus !== 'aprovado' && (
                              <button
                                onClick={() => approveUser(u.id)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Aprovar
                              </button>
                            )}
                            {u.approvalStatus !== 'reprovado' && (
                              <button
                                onClick={() => rejectUser(u.id)}
                                className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-[10px] font-bold cursor-pointer"
                              >
                                Reprovar
                              </button>
                            )}
                            <button
                              onClick={() => deleteRegisteredUser(u.id)}
                              className="p-1 text-neutral-400 hover:text-rose-600 cursor-pointer"
                              title="Eliminar utilizador"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL LOG (Section 15) */}
      {activeAdminTab === 'audit' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
            <div>
              <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Registo de Auditoria Administrativa
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Histórico imutável de aprovações, rejeições e alterações de coordenadas financeiras.
              </p>
            </div>

            <div className="divide-y divide-rose-100 dark:divide-[#3D2C39]">
              {auditLogs.map(log => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#70213F] dark:text-[#E878A0] uppercase font-mono">
                        {log.action.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-neutral-400">por {log.adminEmail}</span>
                    </div>
                    <p className="text-xs text-[#30232A] dark:text-[#FFF5F8]">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-AO')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EDUCATIONAL GUIDES */}
      {activeAdminTab === 'guides' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                  Biblioteca Médica ({guides.length} Guias)
                </h3>
                <p className="text-xs text-[#796A72]">Conteúdos clínicos orientados ao protocolo de Angola.</p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingGuide(!isCreatingGuide)}
                className="px-3 py-1.5 rounded-xl bg-[#70213F] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Guia</span>
              </button>
            </div>

            {isCreatingGuide && (
              <form onSubmit={handleCreateGuideSubmit} className="p-4 bg-rose-50/50 dark:bg-[#1A1218] rounded-2xl border border-rose-200 space-y-3">
                <h4 className="font-bold text-xs">Adicionar Guia Clínico</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Título do Guia"
                    value={newGuideTitle}
                    onChange={e => setNewGuideTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
                  />
                  <select
                    value={newGuideCategory}
                    onChange={e => setNewGuideCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
                  >
                    <option value="alimentacao">Alimentação e Hidratação</option>
                    <option value="primeiro_trimestre">Primeiro Trimestre</option>
                    <option value="segundo_trimestre">Segundo Trimestre</option>
                    <option value="terceiro_trimestre">Terceiro Trimestre</option>
                    <option value="consultas">Consultas Pré-natais</option>
                    <option value="mala_maternidade">Mala de Maternidade</option>
                    <option value="sinais_alerta">Sinais de Alerta</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Introdução breve..."
                  value={newGuideIntro}
                  onChange={e => setNewGuideIntro(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
                />
                <textarea
                  rows={4}
                  required
                  placeholder="Conteúdo e orientações médicas completas..."
                  value={newGuideSectionBody}
                  onChange={e => setNewGuideSectionBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingGuide(false)}
                    className="px-3 py-1.5 text-xs text-neutral-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#70213F] text-white rounded-xl text-xs font-bold"
                  >
                    Publicar Guia
                  </button>
                </div>
              </form>
            )}

            <div className="divide-y divide-rose-100 dark:divide-[#3D2C39]">
              {guides.map(g => (
                <div key={g.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-[#30232A] dark:text-[#FFF5F8]">{g.title}</h5>
                    <p className="text-[11px] text-neutral-500 line-clamp-1">{g.shortIntro}</p>
                    <span className="text-[10px] text-[#A83260] capitalize font-medium">{g.category.replace('_', ' ')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteGuide(g.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUPABASE CLOUD SYNC */}
      {activeAdminTab === 'supabase' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4 max-w-2xl">
            <div>
              <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Conexão Supabase Cloud
              </h3>
              <p className="text-xs text-[#796A72]">
                Guarda as credenciais da tua instância do Supabase para sincronização na nuvem.
              </p>
            </div>

            {saveCloudSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Credenciais do Supabase guardadas com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveSupabase} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Project URL</label>
                <input
                  type="text"
                  required
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Anon / Public API Key</label>
                <input
                  type="password"
                  required
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#70213F] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Credenciais</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION / ACTION MODAL FOR PAYMENTS */}
      {selectedOrderForAction && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl max-w-md w-full shadow-2xl space-y-4 text-[#30232A] dark:text-[#FFF5F8]">
            <div className="flex items-center justify-between pb-2 border-b border-rose-100">
              <h4 className="font-serif-accent font-bold text-lg text-[#70213F] dark:text-[#FFF5F8]">
                {actionType === 'approve'
                  ? 'Confirmar Aprovação do Pagamento'
                  : actionType === 'reject'
                  ? 'Rejeitar Encomenda de Pagamento'
                  : 'Comprovativo de Pagamento'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForAction(null);
                  setActionType(null);
                }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* View Receipt Proof Modal View */}
            {actionType === 'view_receipt' ? (
              <div className="space-y-3">
                <div className="p-3 bg-neutral-100 dark:bg-[#1A1218] rounded-xl text-xs space-y-1">
                  <p><strong>Utilizador:</strong> {selectedOrderForAction.userName} ({selectedOrderForAction.userEmail})</p>
                  <p><strong>Referência:</strong> {selectedOrderForAction.paymentReference}</p>
                  <p><strong>Valor:</strong> {selectedOrderForAction.amountKz.toLocaleString('pt-AO')} Kz</p>
                  {selectedOrderForAction.transactionRef && (
                    <p><strong>Talão/ID:</strong> {selectedOrderForAction.transactionRef}</p>
                  )}
                  {selectedOrderForAction.userComment && (
                    <p><strong>Nota da Mamã:</strong> {selectedOrderForAction.userComment}</p>
                  )}
                </div>

                {selectedOrderForAction.proofDataUrl ? (
                  <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-64 flex items-center justify-center bg-black/5">
                    <img
                      src={selectedOrderForAction.proofDataUrl}
                      alt="Comprovativo"
                      className="max-h-64 object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-neutral-400 border border-dashed rounded-xl">
                    <FileText className="w-8 h-8 mx-auto mb-1 text-neutral-300" />
                    <span>Ficheiro de comprovativo anexado: <strong>{selectedOrderForAction.proofFileName}</strong></span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionType('approve');
                      setAdminNoteInput('Comprovativo visual conferido com sucesso.');
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    Aprovar Pagamento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionType('reject');
                      setAdminNoteInput('Talão ilegível ou divergente.');
                    }}
                    className="px-4 py-2.5 bg-rose-100 text-rose-800 rounded-xl text-xs font-bold"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            ) : (
              /* Approve or Reject Confirmation */
              <div className="space-y-3">
                <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                  {actionType === 'approve'
                    ? `Tens a certeza que desejas aprovar o pagamento de ${selectedOrderForAction.amountKz.toLocaleString('pt-AO')} Kz para ${selectedOrderForAction.userName}? A subscrição premium será ativada imediatamente.`
                    : `Tens a certeza que desejas rejeitar o pagamento ${selectedOrderForAction.paymentReference}? O utilizador não terá acesso premium ativado.`}
                </p>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Nota Administrativa Interna (Registo de Auditoria):
                  </label>
                  <input
                    type="text"
                    required
                    value={adminNoteInput}
                    onChange={e => setAdminNoteInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs focus:border-[#A83260]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderForAction(null);
                      setActionType(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs ${
                      actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                  >
                    {actionType === 'approve' ? 'Confirmar & Ativar Subscrição' : 'Confirmar Rejeição'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
