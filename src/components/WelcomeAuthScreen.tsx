import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaeSerenaLogo } from './MaeSerenaLogo';
import {
  Sparkles,
  ArrowRight,
  LogIn,
  ShieldCheck,
  Heart,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Pill,
  BookOpen,
  X,
  Send,
  HelpCircle
} from 'lucide-react';

interface WelcomeAuthScreenProps {
  onStartOnboarding: () => void;
  onOpenLogin: () => void;
  onLoginSuccess?: () => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onStartOnboarding,
  onOpenLogin,
  onLoginSuccess
}) => {
  const { login } = useApp();

  const [activeModal, setActiveModal] = useState<'login' | 'forgot_password' | 'privacy' | 'terms' | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleQuickDevLogin = () => {
    setLoginEmail('chillplaces9@gmail.com');
    setLoginPassword('kenyseixas9');
    setLoginError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const ok = await login(loginEmail.trim(), loginPassword.trim());
      if (!ok) {
        setLoginError('Email ou palavra-passe incorretos.');
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setActiveModal(null);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Erro ao autenticar. Tenta novamente.');
      setIsSubmitting(false);
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail || !recoveryEmail.includes('@')) return;
    setRecoverySent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFCFD] via-[#F8E7ED]/50 to-[#F6F2F4] dark:from-[#171317] dark:via-[#241C23] dark:to-[#171317] text-[#30232A] dark:text-[#FFF5F8] flex flex-col justify-between selection:bg-[#A83260] selection:text-white relative overflow-hidden transition-colors">
      {/* Decorative Atmospheric Radiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F8E7ED] dark:bg-[#70213F]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-100/60 dark:bg-[#A83260]/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <MaeSerenaLogo size="md" showTagline={true} />

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setLoginError('');
              setActiveModal('login');
            }}
            className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-rose-200 dark:border-[#493642] text-[#70213F] dark:text-[#E878A0] hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar sessão</span>
          </button>

          <button
            onClick={onStartOnboarding}
            className="text-xs sm:text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r from-[#70213F] to-[#A83260] text-white shadow-md hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Começar 3 dias grátis</span>
          </button>
        </div>
      </header>

      {/* Main Hero Card Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-8">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Reassuring Welcoming Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] text-xs font-semibold text-[#A83260] dark:text-[#E878A0] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Saúde Materna & Pré-Natal em Angola 🇦🇴</span>
            </div>

            <h1 className="font-serif-accent font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.2] text-[#70213F] dark:text-[#FFF5F8]">
              A tua gravidez, acompanhada com carinho.
            </h1>

            <p className="text-sm sm:text-base text-[#796A72] dark:text-[#C8B8C1] max-w-xl leading-relaxed">
              Organiza a tua gravidez, acompanha cada fase do teu bebé e mantém as consultas do MINSA e os lembretes importantes sempre por perto.
            </p>

            {/* Feature Highlights Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#241C23]/80 border border-rose-100 dark:border-[#493642] shadow-xs text-left">
                <Calendar className="w-4 h-4 text-[#A83260] dark:text-[#E878A0] mb-1" />
                <h4 className="text-xs font-bold">Consultas e Exames</h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Horários de Luanda</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#241C23]/80 border border-rose-100 dark:border-[#493642] shadow-xs text-left">
                <Pill className="w-4 h-4 text-[#A83260] dark:text-[#E878A0] mb-1" />
                <h4 className="text-xs font-bold">Lembretes de Tomas</h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Ácido fólico e ferro</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#241C23]/80 border border-rose-100 dark:border-[#493642] shadow-xs text-left col-span-2 sm:col-span-1">
                <BookOpen className="w-4 h-4 text-[#A83260] dark:text-[#E878A0] mb-1" />
                <h4 className="text-xs font-bold">Guias Médicos</h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Revisão Obstétrica</p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start">
              <button
                onClick={onStartOnboarding}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#70213F] via-[#A83260] to-[#70213F] text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-900/25 hover:shadow-rose-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Começar 3 dias grátis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setLoginError('');
                  setActiveModal('login');
                }}
                className="px-7 py-4 rounded-2xl border border-rose-200 dark:border-[#493642] bg-white/90 dark:bg-[#241C23]/90 font-bold text-sm text-[#70213F] dark:text-[#FFF5F8] hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#A83260] dark:text-[#E878A0]" />
                <span>Iniciar sessão</span>
              </button>
            </div>

            {/* Security Guarantee Notice */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] text-[#796A72] dark:text-[#C8B8C1] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#367C60]" />
                Privacidade médica e sigilo
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#367C60]" />
                Pagamentos Multicaixa Express em Kz
              </span>
            </div>
          </div>

          {/* Right Column: Premium Stylized Maternal Illustration Art */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white dark:bg-[#241C23] p-8 rounded-3xl border border-rose-100 dark:border-[#493642] shadow-2xl shadow-rose-950/10 text-center space-y-6">
              {/* Artistic Maternal Graphic */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                {/* Concentric Aura Rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F8E7ED] to-[#FFF5F8] dark:from-[#30232D] dark:to-[#171317] animate-pulse" />
                <div className="absolute inset-4 rounded-full border border-rose-200 dark:border-[#493642]/60" />

                {/* Pregnant Mother Silhouette SVG with Glowing Heart & Baby */}
                <svg viewBox="0 0 160 160" className="w-40 h-40 relative z-10" fill="none">
                  {/* Mother Figure */}
                  <circle cx="80" cy="46" r="16" fill="#A83260" />
                  <path
                    d="M 66 66 C 56 80 56 112 72 128 C 88 140 110 136 116 120 C 122 104 118 88 106 78 C 96 72 88 72 80 66"
                    stroke="#70213F"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Glowing Baby in the Womb */}
                  <circle cx="88" cy="102" r="11" fill="#C44376" />
                  <circle cx="88" cy="102" r="6" fill="#FFFCFD" />
                  {/* Protective Hands */}
                  <path
                    d="M 68 104 Q 80 118 96 112"
                    stroke="#A83260"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Floating Micro Capsule Mascot Badge */}
                <div className="absolute top-2 right-2 bg-white dark:bg-[#171317] p-2 rounded-2xl shadow-md border border-rose-100 dark:border-[#493642] animate-bounce-subtle">
                  <div className="w-4 h-8 flex flex-col rounded-full overflow-hidden border border-[#A83260]/30 shadow-xs">
                    <div className="h-1/2 bg-[#A83260]" />
                    <div className="h-1/2 bg-white" />
                  </div>
                </div>
              </div>

              {/* Emotional Quote */}
              <div className="space-y-1">
                <h3 className="font-serif-accent font-bold text-lg text-[#70213F] dark:text-[#E878A0]">
                  Cuidar de ti é cuidar do teu bebé
                </h3>
                <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                  Responde a 4 perguntas simples para personalizares o teu espaço de saúde materna.
                </p>
              </div>

              {/* Instant Start Button */}
              <button
                onClick={onStartOnboarding}
                className="w-full py-3 rounded-xl bg-[#F8E7ED] dark:bg-[#30232D] hover:bg-[#F3DDE5] dark:hover:bg-[#3D2C39] text-[#70213F] dark:text-[#FFF5F8] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A83260]" />
                <span>Começar questionário de 4 passos</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Legal & Recovery Links */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-rose-100 dark:border-[#30232D] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#796A72] dark:text-[#C8B8C1]">
        <div>
          <span>© 2026 Mãe Serena Angola. Todos os direitos reservados.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveModal('forgot_password')}
            className="hover:text-[#A83260] dark:hover:text-[#E878A0] transition-colors underline-offset-2 hover:underline"
          >
            Esqueci-me da palavra-passe
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('privacy')}
            className="hover:text-[#A83260] dark:hover:text-[#E878A0] transition-colors underline-offset-2 hover:underline"
          >
            Política de Privacidade
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-[#A83260] dark:hover:text-[#E878A0] transition-colors underline-offset-2 hover:underline"
          >
            Termos de Uso
          </button>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8]">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-[#30232D] text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <MaeSerenaLogo size="md" className="justify-center mb-2" />
              <h2 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Iniciar Sessão no GraviFlow
              </h2>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-1">
                Introduz os teus dados de acesso para entrar.
              </p>
            </div>

            {/* Developer Fast-Access Banner */}
            <div className="mb-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span className="font-semibold text-amber-900 dark:text-amber-200">
                  Conta do Desenvolvedor
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickDevLogin}
                className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px] hover:bg-amber-700 transition-colors shadow-xs"
              >
                Preencher Auto
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Endereço de e-mail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="teu.email@exemplo.ao"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260] focus:ring-1 focus:ring-[#A83260]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="A tua palavra-passe"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260] focus:ring-1 focus:ring-[#A83260]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setActiveModal('forgot_password')}
                  className="text-[#A83260] dark:text-[#E878A0] hover:underline"
                >
                  Esqueci-me da palavra-passe
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? <span>A verificar dados...</span> : <span>Entrar na Aplicação</span>}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-[#796A72] dark:text-[#C8B8C1] pt-3 border-t border-rose-100 dark:border-[#493642]">
              Ainda não tens conta?{' '}
              <button
                onClick={() => {
                  setActiveModal(null);
                  onStartOnboarding();
                }}
                className="text-[#A83260] dark:text-[#E878A0] font-bold hover:underline cursor-pointer"
              >
                Começar 3 dias grátis (4 perguntas)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {activeModal === 'forgot_password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8]">
            <button
              onClick={() => {
                setActiveModal(null);
                setRecoverySent(false);
              }}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-accent font-bold text-lg text-[#70213F] dark:text-[#FFF5F8] mb-1">
              Recuperar Palavra-passe
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mb-4">
              Introduz o teu e-mail associado à conta do GraviFlow para receberes as instruções de redefinição.
            </p>

            {recoverySent ? (
              <div className="space-y-4 text-center py-3">
                <div className="w-12 h-12 bg-emerald-100 text-[#367C60] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  Enviámos um link de recuperação para <strong>{recoveryEmail}</strong>. Por favor, verifica a tua caixa de correio.
                </p>
                <button
                  onClick={() => {
                    setActiveModal('login');
                    setRecoverySent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#A83260] text-white font-bold text-xs"
                >
                  Voltar ao Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={e => setRecoveryEmail(e.target.value)}
                    placeholder="teu.email@exemplo.ao"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#A83260] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar link de recuperação</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8] mb-3">
              Política de Privacidade e Sigilo de Saúde
            </h3>
            <div className="text-xs text-[#796A72] dark:text-[#C8B8C1] space-y-3 leading-relaxed">
              <p>
                No Mãe Serena, respeitamos rigorosamente a privacidade das futuras mães e famílias em Angola. Todas as informações de gravidez, sintomas registados, datas de consultas e tomas de vitaminas são mantidas confidenciais e protegidas.
              </p>
              <h4 className="font-bold text-[#30232A] dark:text-[#FFF5F8]">Não partilha de dados de saúde</h4>
              <p>
                Não comercializamos nem cedemos dados pessoais ou de saúde materna a terceiros, seguradoras ou anunciantes.
              </p>
              <h4 className="font-bold text-[#30232A] dark:text-[#FFF5F8]">Armazenamento seguro</h4>
              <p>
                Os comprovativos de pagamento submetidos via Multicaixa Express são utilizados estritamente para conferência manual pela administração do Mãe Serena e eliminados após confirmação da subscrição.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TERMS MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8] mb-3">
              Termos de Uso e Aviso Médico
            </h3>
            <div className="text-xs text-[#796A72] dark:text-[#C8B8C1] space-y-3 leading-relaxed">
              <p>
                O Mãe Serena é uma plataforma digital de organização e educação em saúde materna desenhada para Angola.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-200 text-xs">
                <strong>Aviso de Saúde Importante:</strong> Esta ferramenta destina-se a apoio organizacional e informativo. Nenhuma funcionalidade substitui as consultas médicas pré-natais presenciais ou a orientação individualizada do teu obstetra/médico assistente. Em caso de sintomas graves ou emergência, dirige-te imediatamente à maternidade mais próxima.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
