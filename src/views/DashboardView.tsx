import React from 'react';
import { useApp } from '../context/AppContext';
import { PREGNANCY_WEEKS } from '../data/pregnancyWeeks';
import {
  Heart,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Plus,
  HelpCircle,
  CreditCard,
  UtensilsCrossed
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    calculatedWeek,
    calculatedDay,
    daysRemaining,
    currentTrimester,
    appointments,
    medications,
    logMedicationDose,
    checklist,
    toggleChecklistItem,
    setActiveTab,
    setActiveQuickModal,
    setSelectedGuideForModal,
    guides,
    trialDaysRemaining
  } = useApp();

  const currentWeekInfo = PREGNANCY_WEEKS.find(w => w.week === calculatedWeek) || PREGNANCY_WEEKS[23];
  const displayName = user.name ? user.name.trim().split(' ')[0] : 'Mamã';

  const upcomingAppointments = appointments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const activeMedications = medications.filter(m => m.active);

  // Fruit & development emoji icons map for weeks
  const getFruitIcon = (week: number) => {
    if (week <= 4) return '🌱';
    if (week <= 7) return '🫐';
    if (week <= 10) return '🫒';
    if (week <= 13) return '🍑';
    if (week <= 16) return '🥑';
    if (week <= 19) return '🥭';
    if (week <= 22) return '🍌';
    if (week <= 25) return '🌽';
    if (week <= 28) return '🍆';
    if (week <= 31) return '🥥';
    if (week <= 34) return '🍍';
    if (week <= 37) return '🍈';
    return '🎃';
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Personalized Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#7D2347] via-[#A83260] to-[#C04774] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-950/20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentTrimester}º Trimestre de Gestação</span>
            </div>
            {user.role !== 'admin' && !user.isSubscribed && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  3 Dias Grátis: {trialDaysRemaining}d restantes
                </span>
                <button
                  onClick={() => setActiveTab('planos')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#7D2347] hover:bg-rose-50 text-xs font-extrabold shadow-md transition-all hover:scale-105 active:scale-95"
                  title="Pagar pacotes em Kwanzas (Kz)"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pagar Pacotes (Kz)</span>
                </button>
              </div>
            )}
          </div>
          <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
            Olá, {displayName}! Vamos cuidar de ti hoje.
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
            {user.babyName ? `Acompanha o crescimento da pequena ${user.babyName}. ` : 'Acompanha o crescimento do teu bebé. '}
            {daysRemaining > 0
              ? `Faltam cerca de ${daysRemaining} dias para a data prevista do nascimento.`
              : 'Chegou o momento previsto para conhecer o teu bebé!'}
          </p>
        </div>

        <button
          onClick={() => setActiveQuickModal('onboarding')}
          className="self-start sm:self-center shrink-0 bg-white hover:bg-rose-50 text-[#7D2347] font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-102"
        >
          Ajustar Datas
        </button>
      </div>

      {/* Gestational Progress Timeline Tracker */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-5 sm:p-6 rounded-3xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
              Evolução da Gravidez
            </span>
            <h2 className="font-serif-accent font-bold text-xl sm:text-2xl text-[#30232A] dark:text-[#FFF5F8]">
              Hoje, estás na semana {calculatedWeek}
            </h2>
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-[#30232D] px-3 py-1 rounded-full">
            Semana {calculatedWeek} de 40
          </span>
        </div>

        {/* Progress Bar with 3 Trimesters indicators */}
        <div className="relative pt-1">
          <div className="overflow-hidden h-3 text-xs flex rounded-full bg-[#F8E7ED] dark:bg-[#30232D]">
            <div
              style={{ width: `${Math.min(100, (calculatedWeek / 40) * 100)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#7D2347] to-[#A83260] rounded-full transition-all duration-500"
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#796A72] dark:text-[#C8B8C1] mt-2 font-medium">
            <span>1º Trimestre (Sem. 1-13)</span>
            <span className="font-bold text-[#A83260] dark:text-[#E878A0]">2º Trimestre (Sem. 14-27)</span>
            <span>3º Trimestre (Sem. 28-40)</span>
          </div>
        </div>
      </div>

      {/* Spotlight: Baby Development Card + Angola Health Tip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Baby Size Card */}
        <div className="md:col-span-5 bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0] bg-[#F8E7ED] dark:bg-[#30232D] px-2.5 py-1 rounded-full">
                Comparação de Tamanho
              </span>
              <button
                onClick={() => setActiveTab('gravidez')}
                className="text-xs font-semibold text-[#A83260] dark:text-[#E878A0] hover:underline flex items-center gap-1"
              >
                Ver semanas <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-center py-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#F8E7ED]/70 dark:bg-[#30232D] flex items-center justify-center text-5xl mb-3 shadow-inner">
                {getFruitIcon(calculatedWeek)}
              </div>
              <h3 className="font-serif-accent font-bold text-xl sm:text-2xl text-[#30232A] dark:text-[#FFF5F8]">
                {currentWeekInfo.babySizeComparison}
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-1 font-medium">
                {currentWeekInfo.milestoneTitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#F0E4E9] dark:border-[#493642] text-center">
            <div className="p-2.5 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-neutral-100 dark:border-[#493642]">
              <span className="block text-[10px] text-neutral-400 uppercase font-bold">Comprimento Aprox.</span>
              <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
                {currentWeekInfo.babyLengthCm} cm
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-neutral-100 dark:border-[#493642]">
              <span className="block text-[10px] text-neutral-400 uppercase font-bold">Peso Aprox.</span>
              <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
                {currentWeekInfo.babyWeightGrams} g
              </span>
            </div>
          </div>
        </div>

        {/* Development Summary & Angolan Care Tip */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#A83260] dark:text-[#E878A0]">
              <Heart className="w-4 h-4 fill-current" />
              <span>O QUE ESTÁ A ACONTECER ESTA SEMANA</span>
            </div>
            <p className="text-xs sm:text-sm text-[#30232A] dark:text-[#FFF5F8] leading-relaxed">
              {currentWeekInfo.fetalDevelopmentSummary}
            </p>
            <div className="pt-2 text-xs text-[#796A72] dark:text-[#C8B8C1]">
              <strong>No teu corpo:</strong> {currentWeekInfo.maternalChanges}
            </div>
          </div>

          {/* Dica para Angola */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-900/50 p-5 rounded-3xl space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Cuidado Recomendado em Angola 🇦🇴
            </span>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              {currentWeekInfo.angolaCareTip}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Two Columns: Upcoming Appointments & Medication Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments Card */}
        <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-100 dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] rounded-xl">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-serif-accent font-bold text-lg">Próximas Consultas</h3>
            </div>
            <button
              onClick={() => setActiveQuickModal('appointment')}
              className="text-xs font-bold text-[#A83260] dark:text-[#E878A0] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Marcar
            </button>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400">
                Nenhuma consulta agendada para os próximos dias.
              </div>
            ) : (
              upcomingAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-2xl border border-neutral-100 dark:border-[#3D2C39] bg-[#FFFCFD] dark:bg-[#30232D] space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-xs text-[#30232A] dark:text-[#FFF5F8]">
                      {apt.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0]">
                      {apt.date} • {apt.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
                    {apt.clinicOrDoctor} {apt.address ? `(${apt.address})` : ''}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActiveTab('calendario')}
            className="w-full text-center text-xs font-semibold text-[#A83260] dark:text-[#E878A0] hover:underline pt-1 block"
          >
            Abrir calendário completo de consultas →
          </button>
        </div>

        {/* Medication Reminders Card */}
        <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-serif-accent font-bold text-lg">Lembretes de Hoje</h3>
            </div>
            <button
              onClick={() => setActiveQuickModal('medication')}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Registar
            </button>
          </div>

          <div className="space-y-3">
            {activeMedications.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400">
                Sem medicação agendada.
              </div>
            ) : (
              activeMedications.map(med => (
                <div
                  key={med.id}
                  className="p-3.5 rounded-2xl border border-neutral-100 dark:border-[#3D2C39] bg-[#FFFCFD] dark:bg-[#30232D] space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#30232A] dark:text-[#FFF5F8]">
                        {med.medicationName}
                      </h4>
                      <p className="text-[11px] text-neutral-500">{med.dosage}</p>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                      {med.scheduleTimes[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-400 italic truncate max-w-[200px]">
                      {med.instructions}
                    </span>
                    <button
                      onClick={() => logMedicationDose(med.id, 'taken')}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg transition-colors shadow-xs"
                    >
                      Tomada ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center italic">
            * Organização de tomas prescritas. Não substitui consulta médica.
          </p>
        </div>
      </div>

      {/* Daily Checklist Section */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif-accent font-bold text-xl">Checklist Diário de Bem-Estar</h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              Pequenos passos diários para uma gravidez tranquila
            </p>
          </div>
          <button
            onClick={() => setActiveQuickModal('reminder')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#30232D]"
          >
            + Adicionar Tarefa
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                item.completed
                  ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50 text-neutral-400 line-through'
                  : 'bg-[#FFFCFD] dark:bg-[#30232D] border-neutral-100 dark:border-[#3D2C39] hover:border-neutral-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  item.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-neutral-300 dark:border-neutral-600'
                }`}
              >
                {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-medium text-[#30232A] dark:text-[#FFF5F8] flex-1">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Maternal Recipes Highlight */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-pink-500/10 dark:from-[#30232D] dark:to-[#241C23] border border-rose-200 dark:border-[#493642] p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#70213F] to-[#A83260] text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            🍲
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
              Nova Aba Especial • Nutrição em Angola
            </span>
            <h3 className="font-serif-accent font-bold text-lg text-[#30232A] dark:text-[#FFF5F8]">
              Receitas de Comidas para Grávidas
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              Caldo de peixe fresco, mufete suave, sumo de múcua com vitamina C, papas anti-enjoo e cuidados obstétricos.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('receitas')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer"
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Ver Receitas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Highlighted Guides Preview */}
      <div className="bg-[#F8E7ED]/50 dark:bg-[#30232D] border border-rose-200/80 dark:border-[#493642] p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#A83260] dark:text-[#E878A0]" />
            <h3 className="font-serif-accent font-bold text-lg text-[#30232A] dark:text-[#FFF5F8]">
              Guias Recomendados para Esta Fase
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('guias')}
            className="text-xs font-bold text-[#A83260] dark:text-[#E878A0] hover:underline"
          >
            Ver todos ({guides.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.slice(0, 2).map(guide => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuideForModal(guide)}
              className="bg-white dark:bg-[#241C23] p-4 rounded-2xl border border-neutral-100 dark:border-[#493642] shadow-xs cursor-pointer hover:shadow-md transition-shadow space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                  {guide.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-neutral-400">{guide.readTimeMinutes} min</span>
              </div>
              <h4 className="font-serif-accent font-bold text-sm text-[#30232A] dark:text-[#FFF5F8] line-clamp-1">
                {guide.title}
              </h4>
              <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] line-clamp-2">
                {guide.shortIntro}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
