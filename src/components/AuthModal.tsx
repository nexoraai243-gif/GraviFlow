import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaeSerenaLogo } from './MaeSerenaLogo';
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  HelpCircle,
  Heart,
  Baby,
  Smile,
  Check
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  onOpenOnboarding?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenOnboarding,
  initialMode = 'register'
}) => {
  const { login, registerUser, setIsOnboardingOpen } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [registerStep, setRegisterStep] = useState<number>(1);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('+244 9');
  const [province, setProvince] = useState('Luanda');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Quiz states
  const [firstPregnancy, setFirstPregnancy] = useState<'sim' | 'nao'>('sim');
  const [confirmedWeek, setConfirmedWeek] = useState(24);
  const [currentFeeling, setCurrentFeeling] = useState<string>('Disposta e animada');
  const [primaryGoal, setPrimaryGoal] = useState<string>('Acompanhar o tamanho e evolução do bebé');
  const [babyName, setBabyName] = useState('');

  if (!isOpen) return null;

  const handleDeveloperQuickFill = () => {
    setMode('login');
    setEmail('chillplaces9@gmail.com');
    setPassword('kenyseixas9');
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email.trim(), password.trim());
      if (!success) {
        setError('Email ou palavra-passe incorretos.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao iniciar sessão.');
      setLoading(false);
    }
  };

  const handleNextFromQuizToAccount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setRegisterStep(2); // Advance from Quiz to Account credentials
  };

  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, introduz o teu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, introduz um email válido.');
      return;
    }
    if (!password || password.length < 4) {
      setError('A palavra-passe deve ter pelo menos 4 caracteres.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await registerUser({
        name: name.trim(),
        birthDate: birthDate || undefined,
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        province,
        confirmedWeek,
        babyName: babyName.trim()
      });
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao registar a conta.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#171317] border border-[#F8E7ED] dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-[#30232D] text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo and App Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <MaeSerenaLogo size="lg" className="mb-2" />
          <h2 className="font-serif-accent font-bold text-2xl text-[#30232A] dark:text-[#FFF5F8] mt-1">
            {mode === 'login'
              ? 'Entrar no GraviFlow'
              : registerStep === 1
              ? 'Questionário Inicial GraviFlow'
              : 'Ativar 3 Dias de Teste Grátis'}
          </h2>
          <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
            {mode === 'login'
              ? 'Inicia sessão com a tua conta existente ou de desenvolvedor'
              : registerStep === 1
              ? 'Responde a este questionário rápido antes de colocar os teus dados'
              : 'Último passo: preenche os teus dados para começar o teste'}
          </p>
        </div>

        {/* Developer Account Badge & Instant Fill */}
        <div className="mb-5 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-[#26101D] dark:to-[#1A0A14] border border-rose-200 dark:border-[#4A1F35] p-3 rounded-2xl">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#A83260] dark:text-[#E878A0] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Conta do Desenvolvedor
            </span>
            <button
              type="button"
              onClick={handleDeveloperQuickFill}
              className="text-[11px] font-bold bg-[#A83260] text-white px-2.5 py-1 rounded-lg hover:bg-[#7D2347] transition-colors shadow-xs"
            >
              Preencher Auto
            </button>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            chillplaces9@gmail.com (Acesso total de administrador)
          </p>
        </div>

        {/* Top Switcher: Criar Conta vs Entrar */}
        <div className="flex rounded-2xl bg-neutral-100 dark:bg-[#1E101A] p-1 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              if (onOpenOnboarding) {
                onOpenOnboarding();
              } else {
                onClose();
                setIsOnboardingOpen(true);
              }
            }}
            className="flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#70213F] to-[#A83260] text-white shadow-sm hover:opacity-95 cursor-pointer font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Começar 3 Dias Grátis (4 Perguntas)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <span>Entrar com Conta Existente</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="teu.email@exemplo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="A tua palavra-passe"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>A entrar...</span>
              ) : (
                <>
                  <span>Entrar na Aplicação</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER MODE — STEP 1: INTERACTIVE GESTATIONAL QUIZ FIRST */}
        {mode === 'register' && registerStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-[#A83260] dark:text-[#E878A0] pb-2 border-b border-neutral-100 dark:border-[#3B1B2B]">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#A83260]" />
                Quiz Gestacional de Boas-Vindas
              </span>
              <span className="text-[11px] font-semibold text-neutral-400">Passo 1 de 2</span>
            </div>

            {/* Question 1 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2D1B24] dark:text-[#FFF0F5]">
                1. É a tua primeira gravidez?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFirstPregnancy('sim')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    firstPregnancy === 'sim'
                      ? 'border-[#A83260] bg-[#FCEEF3] text-[#A83260] dark:bg-[#2C1421] dark:text-[#E878A0] shadow-xs'
                      : 'border-neutral-200 dark:border-[#3B1B2B] text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  🌸 Sim, primeira vez
                </button>
                <button
                  type="button"
                  onClick={() => setFirstPregnancy('nao')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    firstPregnancy === 'nao'
                      ? 'border-[#A83260] bg-[#FCEEF3] text-[#A83260] dark:bg-[#2C1421] dark:text-[#E878A0] shadow-xs'
                      : 'border-neutral-200 dark:border-[#3B1B2B] text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  🤱 Já tenho filhos
                </button>
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2D1B24] dark:text-[#FFF0F5] flex items-center justify-between">
                <span>2. Em que semana de gestação estás atualmente?</span>
                <span className="text-[#A83260] dark:text-[#E878A0] font-extrabold bg-[#FCEEF3] dark:bg-[#2C1421] px-2.5 py-0.5 rounded-full">
                  Semana {confirmedWeek}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={40}
                value={confirmedWeek}
                onChange={e => setConfirmedWeek(Number(e.target.value))}
                className="w-full accent-[#A83260]"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>Semana 1 (Início)</span>
                <span>Semana 20 (Metade)</span>
                <span>Semana 40 (Termo)</span>
              </div>
            </div>

            {/* Question 3 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2D1B24] dark:text-[#FFF0F5]">
                3. Como te tens sentido no teu dia-a-dia?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Disposta e com energia',
                  'Com enjoos matinais',
                  'Com sono e cansaço',
                  'Sensível e ansiosa'
                ].map(feeling => (
                  <button
                    key={feeling}
                    type="button"
                    onClick={() => setCurrentFeeling(feeling)}
                    className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-all ${
                      currentFeeling === feeling
                        ? 'border-[#A83260] bg-[#FCEEF3] text-[#A83260] dark:bg-[#2C1421] dark:text-[#E878A0] font-bold'
                        : 'border-neutral-200 dark:border-[#3B1B2B] text-neutral-600'
                    }`}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4 */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2D1B24] dark:text-[#FFF0F5]">
                4. Qual o teu principal objetivo no GraviFlow?
              </label>
              <div className="space-y-1.5 text-xs">
                {[
                  'Acompanhar a evolução do bebé semana a semana',
                  'Lembrar das consultas pré-natais do MINSA e exames em Angola',
                  'Organizar as tomas de vitaminas (ácido fólico e sulfato ferroso)',
                  'Aprender sobre nutrição angolana e mala de maternidade'
                ].map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setPrimaryGoal(goal)}
                    className={`w-full p-2 rounded-xl border text-left text-[11px] flex items-center gap-2 transition-all ${
                      primaryGoal === goal
                        ? 'border-[#A83260] bg-[#FCEEF3] text-[#A83260] dark:bg-[#2C1421] dark:text-[#E878A0] font-bold'
                        : 'border-neutral-200 dark:border-[#3B1B2B] text-neutral-600'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 shrink-0 ${primaryGoal === goal ? 'opacity-100' : 'opacity-0'}`} />
                    <span>{goal}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: Baby Name (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2D1B24] dark:text-[#FFF0F5]">
                5. Já escolheste o nome do bebé? (Opcional)
              </label>
              <div className="relative">
                <Baby className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={babyName}
                  onChange={e => setBabyName(e.target.value)}
                  placeholder="Ex: Serena, Kamba, Luena..."
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            {/* Advance button */}
            <button
              type="button"
              onClick={handleNextFromQuizToAccount}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
            >
              <span>Avançar para Preencher Dados e Ativar 3 Dias Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* REGISTER MODE — STEP 2: ACCOUNT CREDENTIALS */}
        {mode === 'register' && registerStep === 2 && (
          <form onSubmit={handleFinishRegistration} className="space-y-4 animate-in fade-in duration-200">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs font-bold text-[#A83260] dark:text-[#E878A0] pb-2 border-b border-neutral-100 dark:border-[#3B1B2B]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#A83260]" />
                Ativação dos 3 Dias de Teste Grátis
              </span>
              <span className="text-[11px] font-semibold text-neutral-400">Passo 2 de 2</span>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">O teu Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Beatriz Silva"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="teu.email@exemplo.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Criar Palavra-passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
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

            <div>
              <label className="block text-xs font-semibold mb-1">Província em Angola</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#F3DDE5] dark:border-[#3B1B2B] bg-[#FFFCFD] dark:bg-[#1E101A] text-xs focus:border-[#A83260]"
              >
                <option value="Luanda">Luanda</option>
                <option value="Benguela">Benguela</option>
                <option value="Huambo">Huambo</option>
                <option value="Huíla">Huíla</option>
                <option value="Cabinda">Cabinda</option>
                <option value="Cuanza Sul">Cuanza Sul</option>
                <option value="Uíge">Uíge</option>
                <option value="Malanje">Malanje</option>
              </select>
            </div>

            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                <strong>Sem cobranças hoje:</strong> 3 dias de acesso total grátis ao GraviFlow. Pacotes após o teste: Mensal 3.000 Kz, Trimestral 9.000 Kz, Anual 36.000 Kz.
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRegisterStep(1)}
                className="py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-[#3B1B2B] text-xs font-semibold text-neutral-600 flex items-center gap-1 hover:bg-neutral-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar ao Quiz
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <span>A criar conta...</span>
                ) : (
                  <>
                    <span>Concluir e Iniciar 3 Dias Grátis</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
