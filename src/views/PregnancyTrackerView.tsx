import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PREGNANCY_WEEKS } from '../data/pregnancyWeeks';
import {
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
  Calendar,
  Smile,
  ShieldCheck,
  Activity,
  Plus
} from 'lucide-react';

export const PregnancyTrackerView: React.FC = () => {
  const {
    user,
    calculatedWeek,
    daysRemaining,
    dailyLog,
    setActiveQuickModal
  } = useApp();

  const [selectedWeek, setSelectedWeek] = useState<number>(calculatedWeek);
  const [personalNote, setPersonalNote] = useState<string>('');

  const weekInfo = PREGNANCY_WEEKS.find(w => w.week === selectedWeek) || PREGNANCY_WEEKS[23];

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
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
              Jornada de 40 Semanas
            </span>
            <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8]">
              Desenvolvimento do Bebé
            </h1>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
              Explora o crescimento semana a semana e descobre as mudanças no teu corpo.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => setSelectedWeek(calculatedWeek)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F8E7ED] hover:bg-[#F2D7E0] dark:bg-[#30232D] dark:hover:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] transition-colors border border-rose-200 dark:border-[#493642]"
            >
              Ir para Semana Atual ({calculatedWeek})
            </button>
            <button
              onClick={() => setActiveQuickModal('symptom')}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white shadow-md shadow-rose-900/20"
            >
              + Registar Diário
            </button>
          </div>
        </div>

        {/* Trimester Tabs */}
        <div className="flex gap-2 mt-6 border-b border-[#F0E4E9] dark:border-[#493642] pb-3 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setSelectedWeek(Math.min(13, Math.max(1, selectedWeek)))}
            className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
              selectedWeek <= 13
                ? 'bg-[#A83260] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#30232D] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            1º Trimestre (Sem. 1 - 13)
          </button>
          <button
            onClick={() => setSelectedWeek(Math.min(27, Math.max(14, selectedWeek)))}
            className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
              selectedWeek >= 14 && selectedWeek <= 27
                ? 'bg-[#A83260] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#30232D] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            2º Trimestre (Sem. 14 - 27)
          </button>
          <button
            onClick={() => setSelectedWeek(Math.min(40, Math.max(28, selectedWeek)))}
            className={`px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
              selectedWeek >= 28
                ? 'bg-[#A83260] text-white shadow-xs'
                : 'bg-neutral-100 dark:bg-[#30232D] text-neutral-600 dark:text-neutral-300'
            }`}
          >
            3º Trimestre (Sem. 28 - 40)
          </button>
        </div>

        {/* Horizontal Week Carousel Picker */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto py-2 px-1 scrollbar-thin">
          {PREGNANCY_WEEKS.map(w => {
            const isSelected = w.week === selectedWeek;
            const isCurrent = w.week === calculatedWeek;
            return (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(w.week)}
                className={`flex-none w-11 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#A83260] text-white font-bold shadow-md scale-105'
                    : isCurrent
                    ? 'border-2 border-[#A83260] text-[#A83260] dark:text-[#E878A0] bg-[#F8E7ED] dark:bg-[#30232D] font-bold'
                    : 'bg-neutral-50 dark:bg-[#30232D] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#3D2C39]'
                }`}
              >
                <span className="text-[9px] uppercase tracking-tighter">Sem</span>
                <span className="text-sm font-extrabold">{w.week}</span>
                {isCurrent && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A83260] dark:bg-[#E878A0] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Week Showcase Card */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E9] dark:border-[#493642]">
          <div className="flex items-center gap-3">
            <button
              disabled={selectedWeek <= 1}
              onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
              className="p-2 rounded-xl border border-neutral-200 dark:border-[#493642] hover:bg-neutral-100 dark:hover:bg-[#30232D] disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                {weekInfo.trimester}º Trimestre
              </span>
              <h2 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8]">
                Semana {weekInfo.week} de Gestação
              </h2>
            </div>
          </div>

          <button
            disabled={selectedWeek >= 40}
            onClick={() => setSelectedWeek(prev => Math.min(40, prev + 1))}
            className="p-2 rounded-xl border border-neutral-200 dark:border-[#493642] hover:bg-neutral-100 dark:hover:bg-[#30232D] disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Baby Size Visual & Measurements */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 text-center p-6 bg-gradient-to-b from-[#FDF9FA] to-[#F8E7ED]/50 dark:from-[#30232D] dark:to-[#241C23] rounded-3xl border border-rose-100 dark:border-[#493642]">
            <div className="w-28 h-28 mx-auto rounded-full bg-white dark:bg-[#241C23] shadow-md flex items-center justify-center text-6xl mb-4 border-2 border-rose-200 dark:border-[#493642]">
              {getFruitIcon(weekInfo.week)}
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
              Tamanho Aproximado
            </p>
            <h3 className="font-serif-accent font-bold text-xl sm:text-2xl text-[#30232A] dark:text-[#FFF5F8] mt-1">
              {weekInfo.babySizeComparison}
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-1">
              {weekInfo.milestoneTitle}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-rose-200/60 dark:border-[#493642]">
              <div className="p-2 bg-white/80 dark:bg-[#30232D] rounded-xl text-center">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Comprimento</span>
                <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
                  ~{weekInfo.babyLengthCm} cm
                </span>
              </div>
              <div className="p-2 bg-white/80 dark:bg-[#30232D] rounded-xl text-center">
                <span className="block text-[10px] text-neutral-400 uppercase font-bold">Peso Médio</span>
                <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
                  ~{weekInfo.babyWeightGrams} g
                </span>
              </div>
            </div>
          </div>

          {/* Development Details */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#A83260] dark:text-[#E878A0] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Desenvolvimento Fetal
              </h4>
              <p className="text-xs sm:text-sm text-[#30232A] dark:text-[#FFF5F8] leading-relaxed">
                {weekInfo.fetalDevelopmentSummary}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#30232A] dark:text-[#FFF5F8] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" /> O Corpo da Mamã
              </h4>
              <p className="text-xs sm:text-sm text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
                {weekInfo.maternalChanges}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Conselho de Saúde em Angola 🇦🇴
              </span>
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                {weekInfo.angolaCareTip}
              </p>
            </div>
          </div>
        </div>

        {/* Questions for next prenatal consultation */}
        <div className="bg-[#F8E7ED]/50 dark:bg-[#30232D] border border-[#E0CBD3] dark:border-[#493642] p-5 rounded-2xl space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#A83260] dark:text-[#E878A0] flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Perguntas Recomendadas para a Próxima Consulta:
          </h4>
          <ul className="space-y-1.5 text-xs text-[#30232A] dark:text-[#FFF5F8]">
            {weekInfo.questionsForDoctor.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#A83260] font-bold">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personal Note for this week */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#30232A] dark:text-[#FFF5F8] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#A83260]" />
            Notas Pessoais da Semana {weekInfo.week}
          </label>
          <textarea
            rows={2}
            value={personalNote}
            onChange={e => setPersonalNote(e.target.value)}
            placeholder="Ex: Hoje senti o primeiro pontapé forte da Serena enquanto ouvia música..."
            className="w-full px-3.5 py-2.5 rounded-2xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
          />
        </div>
      </div>

      {/* Today's Wellbeing Journal Entry Preview */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h3 className="font-serif-accent font-bold text-xl">Registo Diário de Hoje</h3>
          </div>
          <button
            onClick={() => setActiveQuickModal('symptom')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Editar Diário
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Humor Geral</span>
            <span className="font-bold text-sm capitalize text-[#30232A] dark:text-[#FFF5F8]">
              {dailyLog.mood}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Energia</span>
            <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
              {dailyLog.energyLevel} de 5
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFCFD] dark:bg-[#30232D] border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] uppercase font-bold">Hidratação</span>
            <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
              {dailyLog.waterGlasses * 250} ml ({dailyLog.waterGlasses} copos)
            </span>
          </div>
        </div>

        {dailyLog.notes && (
          <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] italic bg-neutral-50 dark:bg-[#30232D] p-3 rounded-xl border border-neutral-100 dark:border-[#493642]">
            "{dailyLog.notes}"
          </p>
        )}
      </div>
    </div>
  );
};
