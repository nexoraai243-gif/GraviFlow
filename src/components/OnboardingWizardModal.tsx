import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MaeSerenaLogo } from './MaeSerenaLogo';
import { OnboardingAnswers } from '../types';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  Heart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { registerUser } = useApp();

  // Step state:
  // 1 to 4: The 4 questions
  // 5: Friendly transition screen ("Perfeito! Vamos preparar o teu espaço de cuidado")
  // 6: Personal details form (Nome, Email, Telefone, Palavra-passe)
  // 7: Optional pregnancy dates setup (DUM / DPA / Semana)
  const [step, setStep] = useState<number>(1);

  // Question 1
  const [phase, setPhase] = useState<'gravida' | 'planeando' | 'preparando'>('gravida');

  // Question 2
  const [weekKnowledge, setWeekKnowledge] = useState<'sei_semanas' | 'tenho_dpa' | 'nao_sei'>('sei_semanas');
  const [planningGoal, setPlanningGoal] = useState<'preparar_consultas' | 'aprender_saude' | 'organizar_cuidados'>('aprender_saude');

  // Question 3 (Multiple selection)
  const [trackingTopics, setTrackingTopics] = useState<string[]>([
    'Desenvolvimento do bebé.',
    'Consultas pré-natais.',
    'Lembretes de medicamentos prescritos.'
  ]);

  // Question 4
  const [reminderPreference, setReminderPreference] = useState<'notificacoes_dispositivo' | 'lembretes_app' | 'configurar_depois'>('lembretes_app');

  // Personal details state
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+244 9');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [province, setProvince] = useState('Luanda');

  // Pregnancy details state (Step 7)
  const [lmpDate, setLmpDate] = useState('');
  const [eddDate, setEddDate] = useState('');
  const [confirmedWeek, setConfirmedWeek] = useState(24);
  const [isEstimatedDate, setIsEstimatedDate] = useState(false);
  const [babyName, setBabyName] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Toggle topics for Question 3
  const toggleTopic = (topic: string) => {
    setTrackingTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Média', color: 'bg-amber-500' };
    return { score: 3, label: 'Forte', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(password);

  const handleNextFromQuestion = () => {
    setError('');
    if (step < 4) {
      setStep(s => s + 1);
    } else if (step === 4) {
      // Go to transition screen
      setStep(5);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(s => s - 1);
    }
  };

  const handlePersonalDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, introduz o teu nome completo.');
      return;
    }
    if (!birthDate) {
      setError('Por favor, seleciona a tua data de nascimento.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, introduz um endereço de e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      return;
    }
    if (!acceptedTerms) {
      setError('É necessário aceitar os termos de uso e política de privacidade.');
      return;
    }

    setError('');

    // Directly create account and enter main app dashboard (espaço de cuidados) with 3 days free trial
    handleFinalAccountCreation();
  };

  const handleFinalAccountCreation = async () => {
    setError('');
    setIsSubmitting(true);

    const onboardingAnswers: OnboardingAnswers = {
      phase,
      weekKnowledge: phase === 'gravida' ? weekKnowledge : undefined,
      planningGoal: phase !== 'gravida' ? planningGoal : undefined,
      trackingTopics,
      reminderPreference
    };

    try {
      await registerUser({
        name: name.trim(),
        birthDate: birthDate || undefined,
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim(),
        province,
        confirmedWeek: phase === 'gravida' ? (confirmedWeek || 24) : 0,
        babyName: babyName.trim() || (phase === 'gravida' ? 'Serena' : undefined),
        onboardingAnswers,
        lmpDate: lmpDate || undefined,
        eddDate: eddDate || undefined,
        isEstimatedDate
      });
      localStorage.setItem('maeserena_entered_app', 'true');
      localStorage.setItem('maeserena_registered_user_active', 'true');
      setIsSubmitting(false);
      if (onComplete) {
        onComplete();
      } else {
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar conta. Tenta novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-[#30232D] text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <MaeSerenaLogo size="md" className="mb-2" />

          {step <= 4 && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                Pergunta {step} de 4
              </span>
              <div className="w-48 h-1.5 bg-rose-100 dark:bg-[#30232D] rounded-full mx-auto overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#70213F] to-[#A83260] rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <h2 className="font-serif-accent font-bold text-2xl text-[#70213F] dark:text-[#FFF5F8] mt-2">
              Perfeito!
            </h2>
          )}

          {step === 6 && (
            <div className="space-y-0.5">
              <h2 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Os Teus Dados de Acesso
              </h2>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Cria a tua conta para guardar as tuas preferências com segurança.
              </p>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-0.5">
              <h2 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Perfil da Tua Gravidez
              </h2>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Podes preencher agora ou completar mais tarde no teu perfil.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* QUESTION 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="font-serif-accent font-bold text-lg text-center text-[#70213F] dark:text-[#FFF5F8]">
              Em que fase estás neste momento?
            </h3>

            <div className="space-y-2.5">
              {[
                { id: 'gravida', label: 'Estou grávida.', desc: 'Acompanhar a gestação semana a semana' },
                { id: 'planeando', label: 'Estou a planear uma gravidez.', desc: 'Preparar consultas pré-concepcionais e fertilidade' },
                { id: 'preparando', label: 'Quero preparar-me para uma futura gravidez.', desc: 'Educação materna e saúde preventiva' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPhase(opt.id as any)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    phase === opt.id
                      ? 'border-[#A83260] bg-[#F8E7ED]/70 dark:bg-[#30232D] ring-2 ring-[#A83260]/30 shadow-xs'
                      : 'border-rose-100 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#1D161C]'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#30232A] dark:text-[#FFF5F8]">{opt.label}</h4>
                    <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] mt-0.5">{opt.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      phase === opt.id
                        ? 'border-[#A83260] bg-[#A83260] text-white'
                        : 'border-neutral-300 dark:border-[#493642]'
                    }`}
                  >
                    {phase === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end pt-3">
              <button
                type="button"
                onClick={handleNextFromQuestion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in">
            {phase === 'gravida' ? (
              <>
                <h3 className="font-serif-accent font-bold text-lg text-center text-[#70213F] dark:text-[#FFF5F8]">
                  Sabes de quantas semanas estás grávida?
                </h3>

                <div className="space-y-2.5">
                  {[
                    { id: 'sei_semanas', label: 'Sim, sei as semanas.', desc: 'Tenho a contagem confirmada pelo médico ou ecografia' },
                    { id: 'tenho_dpa', label: 'Tenho uma data provável do parto.', desc: 'O médico estimou a data prevista de nascimento' },
                    { id: 'nao_sei', label: 'Ainda não sei.', desc: 'Vamos ajudar-te a estimar pelo teu último período' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setWeekKnowledge(opt.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        weekKnowledge === opt.id
                          ? 'border-[#A83260] bg-[#F8E7ED]/70 dark:bg-[#30232D] ring-2 ring-[#A83260]/30 shadow-xs'
                          : 'border-rose-100 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#1D161C]'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#30232A] dark:text-[#FFF5F8]">{opt.label}</h4>
                        <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] mt-0.5">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          weekKnowledge === opt.id
                            ? 'border-[#A83260] bg-[#A83260] text-white'
                            : 'border-neutral-300 dark:border-[#493642]'
                        }`}
                      >
                        {weekKnowledge === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif-accent font-bold text-lg text-center text-[#70213F] dark:text-[#FFF5F8]">
                  Qual é o teu principal objetivo?
                </h3>

                <div className="space-y-2.5">
                  {[
                    { id: 'preparar_consultas', label: 'Preparar consultas.', desc: 'Organizar exames e tirar dúvidas com o médico' },
                    { id: 'aprender_saude', label: 'Aprender sobre saúde materna.', desc: 'Conhecer guias clínicos e nutrição em Angola' },
                    { id: 'organizar_cuidados', label: 'Organizar os meus cuidados.', desc: 'Registar hábitos saudáveis e bem-estar diário' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPlanningGoal(opt.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        planningGoal === opt.id
                          ? 'border-[#A83260] bg-[#F8E7ED]/70 dark:bg-[#30232D] ring-2 ring-[#A83260]/30 shadow-xs'
                          : 'border-rose-100 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#1D161C]'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#30232A] dark:text-[#FFF5F8]">{opt.label}</h4>
                        <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] mt-0.5">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          planningGoal === opt.id
                            ? 'border-[#A83260] bg-[#A83260] text-white'
                            : 'border-neutral-300 dark:border-[#493642]'
                        }`}
                      >
                        {planningGoal === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1 hover:bg-neutral-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromQuestion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-serif-accent font-bold text-lg text-center text-[#70213F] dark:text-[#FFF5F8]">
              O que gostarias de acompanhar na aplicação?
            </h3>
            <p className="text-center text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
              Podes escolher várias opções:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Desenvolvimento do bebé.',
                'Consultas pré-natais.',
                'Lembretes de medicamentos prescritos.',
                'Calendário e compromissos.',
                'Guias e orientações.',
                'Bem-estar diário.'
              ].map(topic => {
                const isSelected = trackingTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#A83260] bg-[#F8E7ED] dark:bg-[#30232D] text-[#70213F] dark:text-[#E878A0] font-bold shadow-xs'
                        : 'border-rose-100 dark:border-[#493642] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#A83260] bg-[#A83260] text-white'
                          : 'border-neutral-300 dark:border-[#493642]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{topic}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1 hover:bg-neutral-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromQuestion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 4 */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="font-serif-accent font-bold text-lg text-center text-[#70213F] dark:text-[#FFF5F8]">
              Como preferes receber os teus lembretes?
            </h3>

            <div className="space-y-2.5">
              {[
                {
                  id: 'notificacoes_dispositivo',
                  label: 'Notificações no dispositivo, quando disponíveis.',
                  desc: 'Avisos visuais na barra de notificações do telemóvel'
                },
                {
                  id: 'lembretes_app',
                  label: 'Lembretes dentro da aplicação.',
                  desc: 'Badges e alertas ao abrir a plataforma'
                },
                {
                  id: 'configurar_depois',
                  label: 'Quero configurar isso mais tarde.',
                  desc: 'Ajustar nas definições do perfil quando quiser'
                }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setReminderPreference(opt.id as any)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    reminderPreference === opt.id
                      ? 'border-[#A83260] bg-[#F8E7ED]/70 dark:bg-[#30232D] ring-2 ring-[#A83260]/30 shadow-xs'
                      : 'border-rose-100 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#1D161C]'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#30232A] dark:text-[#FFF5F8]">{opt.label}</h4>
                    <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] mt-0.5">{opt.desc}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      reminderPreference === opt.id
                        ? 'border-[#A83260] bg-[#A83260] text-white'
                        : 'border-neutral-300 dark:border-[#493642]'
                    }`}
                  >
                    {reminderPreference === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1 hover:bg-neutral-50"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromQuestion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>Terminar perguntas</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: FRIENDLY TRANSITION SCREEN */}
        {step === 5 && (
          <div className="space-y-6 text-center py-4 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#70213F] to-[#A83260] text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-900/20">
              <Heart className="w-10 h-10 fill-current animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-accent font-bold text-2xl text-[#70213F] dark:text-[#FFF5F8]">
                Perfeito! Vamos preparar o teu espaço de cuidado.
              </h3>
              <p className="text-xs sm:text-sm text-[#796A72] dark:text-[#C8B8C1] max-w-sm mx-auto leading-relaxed">
                As tuas preferências foram registadas. No próximo passo, vamos criar a tua conta pessoal segura.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8E7ED]/60 dark:bg-[#30232D] text-xs text-[#70213F] dark:text-[#E878A0] text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantia de Confidencialidade</span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-300">
                Os teus dados de gravidez e contactos permanecem estritamente privados e encriptados.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3 px-5 rounded-2xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(6)}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-sm shadow-lg shadow-rose-900/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar para os meus dados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: PERSONAL DETAILS FORM */}
        {step === 6 && (
          <form onSubmit={handlePersonalDetailsSubmit} className="space-y-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold mb-1">Nome completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Beatriz Silva Santos"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Data de nascimento</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Endereço de e-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="teu.email@exemplo.ao"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Número de telefone (Angola +244)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+244 923 000 000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 carateres"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {/* Strength indicator */}
                {password && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px]">
                    <div className="w-12 h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div className={`h-full ${pwdStrength.color}`} style={{ width: `${(pwdStrength.score / 3) * 100}%` }} />
                    </div>
                    <span className="text-neutral-500">{pwdStrength.label}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Confirmar palavra-passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repete a senha"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Província em Angola</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
              >
                <option value="Luanda">Luanda</option>
                <option value="Benguela">Benguela</option>
                <option value="Huambo">Huambo</option>
                <option value="Huíla">Huíla</option>
                <option value="Cabinda">Cabinda</option>
                <option value="Cuanza Sul">Cuanza Sul</option>
                <option value="Uíge">Uíge</option>
                <option value="Malanje">Malanje</option>
                <option value="Zaire">Zaire</option>
                <option value="Namibe">Namibe</option>
              </select>
            </div>

            {/* Checkbox for Terms */}
            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded border-neutral-300 text-[#A83260] focus:ring-[#A83260]"
              />
              <span className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] leading-tight">
                Declaro que li e aceito os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> do GraviFlow, com consentimento para registo de cuidados de saúde.
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>A ativar o teu teste de 3 dias...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Concluir e Entrar (3 Dias Grátis)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 7: PREGNANCY PROFILE SETUP (FOR PREGNANT USERS) */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-rose-50 dark:bg-[#30232D] rounded-2xl border border-rose-100 dark:border-[#493642] text-xs text-[#70213F] dark:text-[#E878A0] leading-relaxed">
              <p>
                <strong>Datas clínicas:</strong> Os campos abaixo ajudam a calcular a semana exata e os marcos do bebé. Podes saltar e preencher mais tarde nas consultas.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Semana de gestação atual (se confirmada por ecografia ou médico)
              </label>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-neutral-400">Semana 1</span>
                <span className="text-xs font-bold text-[#A83260] dark:text-[#E878A0] bg-[#F8E7ED] dark:bg-[#30232D] px-2.5 py-0.5 rounded-full">
                  Semana {confirmedWeek} de 40
                </span>
                <span className="text-[11px] text-neutral-400">Semana 40</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                value={confirmedWeek}
                onChange={e => setConfirmedWeek(Number(e.target.value))}
                className="w-full accent-[#A83260]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Data da Última Menstruação (DUM)
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={e => setLmpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Data Provável do Parto (DPA)
                </label>
                <input
                  type="date"
                  value={eddDate}
                  onChange={e => setEddDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Já pensaste no nome do bebé? (Opcional)
              </label>
              <input
                type="text"
                value={babyName}
                onChange={e => setBabyName(e.target.value)}
                placeholder="Ex: Serena, Kamba, Luena, Mateus..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isEstimatedDate}
                onChange={e => setIsEstimatedDate(e.target.checked)}
                className="rounded border-neutral-300 text-[#A83260] focus:ring-[#A83260]"
              />
              <span className="text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
                Esta data é uma estimativa pessoal e ainda não foi confirmada por ecografia clínica.
              </span>
            </label>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalAccountCreation}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>A preparar o teu espaço...</span>
                ) : (
                  <>
                    <span>Entrar no Meu Espaço de Cuidado</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
