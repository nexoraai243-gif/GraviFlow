import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Building2,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  FileText,
  Hourglass
} from 'lucide-react';
import { SubscriptionPlan, PaymentOrder } from '../types';

export const SubscriptionView: React.FC = () => {
  const {
    plans,
    user,
    payments,
    cancelSubscription,
    setCheckoutSelectedPlan,
    setIsCheckoutOpen,
    trialDaysRemaining,
    isTrialExpired,
    paymentConfig
  } = useApp();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setCheckoutSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const userPlan = plans.find(p => p.id === user.planId);
  const pendingOrders = payments.filter(p => p.status === 'pending_verification');

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F8E7ED] dark:border-[#493642] p-6 sm:p-8 rounded-3xl shadow-xs">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
          Planos e Subscrições em Moeda Nacional (Kz)
        </span>
        <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8] mt-1">
          Acompanhamento Completo da tua Gravidez
        </h1>
        <p className="text-xs sm:text-sm text-[#796A72] dark:text-[#C8B8C1] mt-1 max-w-2xl leading-relaxed">
          Sem taxas ocultas ou cobranças em moeda estrangeira. Paga de forma simples e segura através do Multicaixa Express ou transferência bancária para contas em Angola.
        </p>

        {/* Pending Verification Notice */}
        {pendingOrders.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
              <Hourglass className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Tens {pendingOrders.length} encomenda(s) a aguardar aprovação</span>
            </div>
            {pendingOrders.map(order => (
              <div key={order.id} className="text-xs text-amber-800 dark:text-amber-300 bg-white/70 dark:bg-[#171317]/50 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-amber-200/50">
                <div>
                  <span className="font-bold">Encomenda #{order.id}</span> ({order.planName} • {order.amountKz.toLocaleString('pt-AO')} Kz)
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Comprovativo submetido em {new Date(order.createdAt).toLocaleDateString('pt-AO')}. A equipa do Mãe Serena está a validar a transação. O teu acesso será libertado imediatamente após aprovação.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/70 text-amber-900 dark:text-amber-200 shrink-0 self-start sm:self-center">
                  Pendente de Aprovação
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Current Active Plan Status Banner */}
        {user.isSubscribed && userPlan ? (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                  Plano Ativo
                </span>
                <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  {userPlan.name}
                </h3>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Renovação prevista para: <strong>{user.renewalDate || '2027-01-20'}</strong> • Valor: <strong>{userPlan.priceKz.toLocaleString('pt-AO')} Kz</strong>
              </p>
            </div>

            <button
              onClick={cancelSubscription}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 self-start sm:self-center"
            >
              Cancelar Renovação
            </button>
          </div>
        ) : (
          <div className={`mt-6 p-4 rounded-2xl border flex items-center justify-between ${
            isTrialExpired
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50'
          }`}>
            <div className={`flex items-center gap-2.5 text-xs ${
              isTrialExpired ? 'text-rose-900 dark:text-rose-200' : 'text-amber-900 dark:text-amber-200'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {isTrialExpired
                  ? 'O teu período de teste gratuito de 3 dias terminou. Para continuar a utilizar o Mãe Serena, escolhe um dos planos abaixo.'
                  : `Tens ${trialDaysRemaining} dia(s) restante(s) do teu período de teste gratuito de 3 dias.`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map(plan => {
          const isPopular = plan.isPopular;
          const isCurrent = user.isSubscribed && user.planId === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isPopular
                  ? 'bg-gradient-to-b from-[#FFFCFD] to-[#F8E7ED] dark:from-[#30232D] dark:to-[#241C23] border-2 border-[#A83260] dark:border-[#E878A0] shadow-xl scale-102'
                  : 'bg-[#FFFCFD] dark:bg-[#30232D] border border-[#F8E7ED] dark:border-[#493642] shadow-xs'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#A83260] dark:bg-[#E878A0] text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                  Mais Popular em Angola
                </div>
              )}

              <div>
                <h3 className="font-serif-accent font-bold text-xl mb-1 text-[#30232A] dark:text-[#FFF5F8]">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif-accent font-bold text-4xl text-[#30232A] dark:text-[#FFF5F8]">
                      {plan.priceKz.toLocaleString('pt-AO')}
                    </span>
                    <span className="text-sm font-bold text-[#A83260] dark:text-[#E878A0]">Kz</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {plan.billingPeriod}
                  </span>

                  {plan.savingsKz && (
                    <div className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg inline-block">
                      Poupança de {plan.savingsKz.toLocaleString('pt-AO')} Kz (Promoção Especial)
                    </div>
                  )}
                </div>

                <div className="border-t border-[#F8E7ED] dark:border-[#493642] pt-6 space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#30232A] dark:text-[#FFF5F8]">
                      <CheckCircle2 className="w-4 h-4 text-[#A83260] dark:text-[#E878A0] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isCurrent ? (
                <div className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center shadow-xs">
                  Plano Ativo ✓
                </div>
              ) : (
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    isPopular
                      ? 'bg-gradient-to-r from-[#70213F] to-[#A83260] text-white hover:opacity-95 shadow-rose-900/20'
                      : 'bg-[#30232A] dark:bg-[#FFF5F8] text-white dark:text-[#30232A] hover:opacity-90'
                  }`}
                >
                  <span>Subscrever com Multicaixa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Security & Angolan Channels */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F8E7ED] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <h3 className="font-serif-accent font-bold text-lg text-[#30232A] dark:text-[#FFF5F8]">
          Coordenadas de Pagamento em Angola
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-[#F8E7ED] dark:border-[#493642] space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>Multicaixa Express (MCX)</span>
            </div>
            <p className="text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              Número de receção: <strong className="font-mono text-[#30232A] dark:text-[#FFF5F8]">{paymentConfig.multicaixaNumber}</strong>. Envia o montante correspondente e anexa o comprovativo da operação na app para validação.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-[#F8E7ED] dark:border-[#493642] space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <Building2 className="w-4 h-4" />
              <span>Transferência Bancária / IBAN</span>
            </div>
            <p className="text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              IBAN: <strong className="font-mono text-[#30232A] dark:text-[#FFF5F8]">{paymentConfig.iban || paymentConfig.bankIban || '0006.0000.9641.0541.3010.7'}</strong> ({paymentConfig.bankName || 'Banco Angolano de Investimentos (BAI)'} - {paymentConfig.accountHolder || 'Mãe Serena'}).
            </p>
          </div>
        </div>
      </div>

      {/* Payment Orders History */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F8E7ED] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-accent font-bold text-lg text-[#30232A] dark:text-[#FFF5F8]">
            Histórico de Pagamentos da Conta
          </h3>
          <span className="text-xs text-neutral-400">{payments.length} transações</span>
        </div>

        <div className="divide-y divide-[#F8E7ED] dark:divide-[#493642] overflow-x-auto">
          {payments.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4 text-center">Ainda não tens registos de pagamento.</p>
          ) : (
            payments.map(order => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-[#30232A] dark:text-[#FFF5F8]">
                    {order.planName}
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Ref: {order.id} • {new Date(order.createdAt).toLocaleDateString('pt-AO')} via {order.method.replace('_', ' ')}
                    {order.proofFileName && <span> • Comprovativo anexado</span>}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#A83260] dark:text-[#E878A0] text-sm">
                    {order.amountKz.toLocaleString('pt-AO')} Kz
                  </span>
                  <span className={`block text-[10px] font-semibold uppercase ${
                    order.status === 'approved'
                      ? 'text-emerald-600'
                      : order.status === 'pending_verification'
                      ? 'text-amber-600'
                      : order.status === 'rejected'
                      ? 'text-rose-600'
                      : 'text-neutral-500'
                  }`}>
                    {order.status === 'approved'
                      ? 'Aprovado'
                      : order.status === 'pending_verification'
                      ? 'Pendente de Verificação'
                      : order.status === 'rejected'
                      ? 'Não Aprovado'
                      : order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
