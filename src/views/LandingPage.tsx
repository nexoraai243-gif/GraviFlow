import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionPlan } from '../types';
import { GraviFlowLogo } from '../components/GraviFlowLogo';
import {
  Heart,
  Calendar,
  Clock,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Smartphone,
  PhoneCall,
  Lock,
  ChevronDown,
  ChevronUp,
  Award,
  LogIn
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setShowLandingPage,
    setActiveTab,
    plans,
    setCheckoutSelectedPlan,
    setIsCheckoutOpen,
    setIsAuthModalOpen
  } = useApp();

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStartApp = () => {
    setShowLandingPage(false);
    setActiveTab('inicio');
  };

  const handleChoosePlan = (plan: any) => {
    setCheckoutSelectedPlan(plan);
    setShowLandingPage(false);
    setIsCheckoutOpen(true);
  };

  const faqs = [
    {
      q: 'O que é o GraviFlow?',
      a: 'O GraviFlow é a primeira plataforma digital de saúde materna e acompanhamento pré-natal desenhada especificamente para a realidade de Angola. Oferece rastreio do desenvolvimento do bebé semana a semana, organização de consultas no calendário com horários de Luanda, lembretes de medicação prescrita, biblioteca de guias médicos e pagamentos facilitados em Kwanzas (Kz).'
    },
    {
      q: 'Como funcionam os pagamentos em Angola?',
      a: 'Aceitamos pagamentos em Kwanzas (Kz) através do Multicaixa Express (diretamente no seu telemóvel) e por transferência bancária (IBAN para os principais bancos: BFA, BAI, BPC). O processo é seguro e a ativação é imediata.'
    },
    {
      q: 'As informações médicas foram validadas?',
      a: 'Sim. Todo o conteúdo educativo do GraviFlow baseia-se nas diretrizes do Ministério da Saúde de Angola (MINSA) e da OMS, com revisão periódica por ginecologistas, obstetras e parteiras com prática clínica em Angola.'
    },
    {
      q: 'Posso usar o aplicativo sem internet contínua?',
      a: 'Sim! Os seus dados, consultas agendadas e histórico de medicamentos ficam guardados localmente no seu dispositivo móvel, permitindo a consulta diária mesmo em períodos de ligação instável.'
    },
    {
      q: 'O aplicativo substitui as minhas consultas médicas no hospital?',
      a: 'Não. O GraviFlow é uma ferramenta de organização pessoal e educação. Nenhuma funcionalidade substitui a realização de consultas pré-natais presenciais ou a orientação individualizada do seu médico obstetra.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F4F5] dark:bg-[#171317] text-[#30232A] dark:text-[#FFF5F8] transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 border-b border-[#F0E4E9] dark:border-[#493642]">
        <div className="absolute inset-0 bg-radial from-[#F8E7ED]/70 via-transparent to-transparent dark:from-[#3D2C39]/40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8E7ED] dark:bg-[#30232D] border border-rose-200 dark:border-[#493642] text-xs font-semibold text-[#A83260] dark:text-[#E878A0]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feito com carinho para as mães de Angola 🇦🇴</span>
              </div>

              <h1 className="font-serif-accent font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-[#30232A] dark:text-[#FFF5F8]">
                A tua gravidez merece cuidado em cada momento.
              </h1>

              <p className="text-base sm:text-lg text-[#796A72] dark:text-[#C8B8C1] max-w-2xl leading-relaxed">
                Acompanha o desenvolvimento do teu bebé, organiza as consultas, recebe lembretes importantes e descobre orientações para viver a gravidez com mais tranquilidade.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleStartApp}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white font-bold text-sm shadow-xl shadow-rose-900/20 hover:scale-102 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Começar 3 Dias Grátis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-7 py-3.5 rounded-2xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-white/80 dark:bg-[#140C12]/80 font-bold text-sm text-[#2D1B24] dark:text-[#FFF0F5] hover:bg-rose-50 dark:hover:bg-[#200E19] transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-[#A83260] dark:text-[#E878A0]" />
                  <span>Já tenho conta (Entrar)</span>
                </button>
                <a
                  href="#planos"
                  className="px-5 py-3.5 rounded-2xl border border-[#F3DDE5] dark:border-[#3B1B2B] font-bold text-xs text-neutral-500 hover:text-[#A83260] transition-colors flex items-center justify-center"
                >
                  Planos Kz
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#796A72] dark:text-[#C8B8C1]">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#A83260] dark:text-[#E878A0]" />
                  Revisão Médica Obstétrica
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Smartphone className="w-4 h-4 text-[#A83260] dark:text-[#E878A0]" />
                  Multicaixa Express Disponível
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-[#A83260] dark:text-[#E878A0]" />
                  3 Dias de Teste Gratuito
                </span>
              </div>
            </div>

            {/* Right Hero Interactive Visual Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#A83260] to-[#E878A0] rounded-3xl blur-md opacity-30 animate-pulse-subtle" />

                {/* Simulated App Card */}
                <div className="relative bg-white dark:bg-[#140C12] border border-[#F3DDE5] dark:border-[#3B1B2B] rounded-3xl p-6 shadow-2xl space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3DDE5] dark:border-[#3B1B2B]">
                    <GraviFlowLogo size="sm" showText={true} />
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FCEEF3] text-[#A83260] dark:bg-[#2C1421] dark:text-[#E878A0]">
                      Semana 24
                    </span>
                  </div>

                  {/* Baby illustration spotlight */}
                  <div className="bg-gradient-to-b from-[#FDF9FA] to-[#F8E7ED]/70 dark:from-[#30232D] dark:to-[#241C23] p-5 rounded-2xl text-center border border-rose-100 dark:border-[#493642]">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white dark:bg-[#241C23] shadow-md flex items-center justify-center text-4xl mb-3 border-2 border-rose-200 dark:border-[#493642]">
                      🌽
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                      Tamanho do Bebé
                    </p>
                    <h3 className="font-serif-accent font-bold text-lg">Espiga de Milho Amarelo</h3>
                    <div className="flex justify-center gap-4 mt-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      <span>📏 ~30.0 cm</span>
                      <span>⚖️ ~600 g</span>
                    </div>
                  </div>

                  {/* Mini Appointments / Next task */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-[#30232D] text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#A83260]" />
                        <span className="font-semibold">Consulta Pré-Natal</span>
                      </div>
                      <span className="text-[11px] text-neutral-500">29 Out • 09:30</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-[#30232D] text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">Sulfato Ferroso</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600">Às 13:00</span>
                    </div>
                  </div>

                  <button
                    onClick={handleStartApp}
                    className="w-full py-2.5 rounded-xl bg-[#30232A] dark:bg-[#FFF5F8] text-white dark:text-[#30232A] font-bold text-xs hover:opacity-90 transition-opacity"
                  >
                    Testar Aplicação Completa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
            Vantagens Exclusivas
          </span>
          <h2 className="font-serif-accent font-bold text-3xl sm:text-4xl text-[#30232A] dark:text-[#FFF5F8] mt-2 mb-4">
            Construído a pensar nas mulheres de Angola
          </h2>
          <p className="text-sm text-[#796A72] dark:text-[#C8B8C1]">
            Não usamos modelos genéricos estrangeiros. Do acompanhamento da malária às maternidades locais e alimentação típica, tudo reflete a nossa terra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#241C23] p-7 rounded-3xl border border-[#F0E4E9] dark:border-[#493642] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] flex items-center justify-center mb-5">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif-accent font-bold text-xl mb-2">
              Calendário e Consultas MINSA
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              Organiza as tuas 8 consultas recomendadas pelo Ministério da Saúde de Angola, datas de vacinação antitetânica e ecografias nos postos e clínicas da tua província.
            </p>
          </div>

          <div className="bg-white dark:bg-[#241C23] p-7 rounded-3xl border border-[#F0E4E9] dark:border-[#493642] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif-accent font-bold text-xl mb-2">
              Lembretes Precisos de Toma
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              Nunca te esqueças do ácido fólico, sulfato ferroso ou vitaminas prescritas. Notificações diretas com posologia exata e registo histórico diário.
            </p>
          </div>

          <div className="bg-white dark:bg-[#241C23] p-7 rounded-3xl border border-[#F0E4E9] dark:border-[#493642] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif-accent font-bold text-xl mb-2">
              Guias com Contexto Local
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
              Artigos sobre a nutrição angolana (quizaca, banana-pão, peixe fresco, água tratada), prevenção da malária com TPI e lista da mala para as maternidades de Luanda e províncias.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Kwanza) */}
      <section id="planos" className="py-16 md:py-24 bg-white dark:bg-[#241C23] border-t border-b border-[#F0E4E9] dark:border-[#493642]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
              Planos Transparentes em Kwanza (Kz)
            </span>
            <h2 className="font-serif-accent font-bold text-3xl sm:text-4xl text-[#30232A] dark:text-[#FFF5F8] mt-2 mb-4">
              Investe no teu bem-estar e no do teu bebé
            </h2>
            <p className="text-sm text-[#796A72] dark:text-[#C8B8C1]">
              Sem taxas escondidas. Paga facilmente através do Multicaixa Express ou transferência bancária local.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan: SubscriptionPlan) => {
              const isPopular = plan.isPopular;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#FFFCFD] to-[#F8E7ED] dark:from-[#30232D] dark:to-[#241C23] border-2 border-[#A83260] dark:border-[#E878A0] shadow-xl scale-102'
                      : 'bg-[#FFFCFD] dark:bg-[#30232D] border border-[#E0CBD3] dark:border-[#493642] shadow-sm'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#A83260] dark:bg-[#E878A0] text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                      Mais Escolhido pelas Mães
                    </div>
                  )}

                  <div>
                    <h3 className="font-serif-accent font-bold text-xl mb-1">{plan.name}</h3>
                    <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif-accent font-bold text-4xl text-[#30232A] dark:text-[#FFF5F8]">
                          {plan.priceKz.toLocaleString('pt-AO')}
                        </span>
                        <span className="text-sm font-bold text-[#A83260] dark:text-[#E878A0]">Kz</span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">{plan.billingPeriod}</span>

                      {plan.savingsKz && (
                        <div className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg inline-block">
                          Poupa {plan.savingsKz.toLocaleString('pt-AO')} Kz comparado ao plano mensal
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#F0E4E9] dark:border-[#493642] pt-6 space-y-3 mb-8">
                      {plan.features.map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#30232A] dark:text-[#FFF5F8]">
                          <CheckCircle2 className="w-4 h-4 text-[#A83260] dark:text-[#E878A0] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleChoosePlan(plan)}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                      isPopular
                        ? 'bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white hover:opacity-95 shadow-rose-900/20'
                        : 'bg-[#30232A] dark:bg-[#FFF5F8] text-white dark:text-[#30232A] hover:opacity-90'
                    }`}
                  >
                    Subscrever com Multicaixa
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
            * O plano anual reflete uma poupança estratégica para o acompanhamento completo. Poderá cancelar a renovação automática a qualquer momento no seu perfil.
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
            Dúvidas Comuns
          </span>
          <h2 className="font-serif-accent font-bold text-3xl text-[#30232A] dark:text-[#FFF5F8] mt-2">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#A83260]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-xs sm:text-sm text-[#796A72] dark:text-[#C8B8C1] leading-relaxed border-t border-neutral-100 dark:border-[#30232D]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#241C23] border-t border-[#F0E4E9] dark:border-[#493642] py-12 text-xs text-[#796A72] dark:text-[#C8B8C1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <GraviFlowLogo size="sm" showText={true} />
            <p className="text-[11px] leading-relaxed">
              Cuidamos de ti, em cada fase da gravidez. Desenvolvido para as mães e famílias de Angola.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#2D1B24] dark:text-[#FFF0F5] mb-3 uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={handleStartApp} className="hover:underline">Início da Aplicação</button></li>
              <li><button onClick={() => { handleStartApp(); setActiveTab('gravidez'); }} className="hover:underline">Minha Gravidez</button></li>
              <li><button onClick={() => { handleStartApp(); setActiveTab('guias'); }} className="hover:underline">Guias Médicos</button></li>
              <li><a href="#planos" className="hover:underline">Planos e Preços Kz</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#2D1B24] dark:text-[#FFF0F5] mb-3 uppercase tracking-wider">
              Apoio & Emergências
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>Emergências Nacionais: <strong>111</strong></li>
              <li>Maternidade Lucrécia Paim (Luanda)</li>
              <li>Maternidade Augusto Ngangula (Luanda)</li>
              <li>Apoio: apoio@graviflow.ao</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#2D1B24] dark:text-[#FFF0F5] mb-3 uppercase tracking-wider">
              Aviso Legal & Médico
            </h4>
            <p className="text-[11px] leading-relaxed">
              Os conteúdos desta aplicação têm caráter estritamente educativo e informativo e não constituem consulta, diagnóstico ou plano de tratamento médico. Consulte sempre um médico obstetra.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-neutral-100 dark:border-[#30232D] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px]">
          <p>© {new Date().getFullYear()} GraviFlow — Angola. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="hover:underline cursor-pointer">Privacidade dos Dados</span>
            <span className="hover:underline cursor-pointer">Termos de Utilização</span>
            <span className="hover:underline cursor-pointer">Segurança do Paciente</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
