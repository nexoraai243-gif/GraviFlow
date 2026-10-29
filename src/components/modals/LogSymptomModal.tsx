import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Activity, Smile, Frown, Meh, Heart, Zap, Droplets, HelpCircle, Lock } from 'lucide-react';
import { DailySymptomLog } from '../../types';

export const LogSymptomModal: React.FC = () => {
  const { activeQuickModal, setActiveQuickModal, dailyLog, updateDailyLog, addNotification } = useApp();

  const [mood, setMood] = useState<DailySymptomLog['mood']>(dailyLog.mood || 'tranquila');
  const [energyLevel, setEnergyLevel] = useState<number>(dailyLog.energyLevel || 3);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(dailyLog.symptoms || []);
  const [waterGlasses, setWaterGlasses] = useState<number>(dailyLog.waterGlasses || 6);
  const [notes, setNotes] = useState(dailyLog.notes || '');
  const [questionsForDoctor, setQuestionsForDoctor] = useState(dailyLog.questionsForDoctor || '');

  if (activeQuickModal !== 'symptom') return null;

  const commonSymptoms = [
    'Bebé a mexer ativamente',
    'Náusea / Enjoo matinal',
    'Azia / Refluxo',
    'Sensibilidade nos seios',
    'Cansaço ligeiro',
    'Dor lombar suave',
    'Sono profundo',
    'Inchaço leve nos tornozelos',
    'Fome aumentada',
    'Mudança de humor',
    'Cólicas suaves fisiológicas'
  ];

  const moods: Array<{ id: DailySymptomLog['mood']; label: string; icon: string }> = [
    { id: 'radiante', label: 'Radiante', icon: '✨' },
    { id: 'tranquila', label: 'Tranquila', icon: '🌸' },
    { id: 'cansada', label: 'Cansada', icon: '😴' },
    { id: 'sensivel', label: 'Sensível', icon: '🥺' },
    { id: 'enjoada', label: 'Enjoada', icon: '🤢' },
    { id: 'ansiosa', label: 'Ansiosa', icon: '💭' }
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateDailyLog({
      mood,
      energyLevel,
      symptoms: selectedSymptoms,
      waterGlasses,
      notes,
      questionsForDoctor
    });

    addNotification(
      'Diário Atualizado',
      'O teu registo diário de bem-estar foi guardado com segurança.',
      'milestone'
    );

    setActiveQuickModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setActiveQuickModal(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] text-neutral-500 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-accent font-bold text-xl">Diário de Bem-Estar</h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              Registo estritamente privado • Não constitui diagnóstico médico
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Mood */}
          <div>
            <label className="block text-xs font-semibold mb-2">Como te sentes hoje?</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {moods.map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                    mood === m.id
                      ? 'border-[#A83260] bg-[#F8E7ED] text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0] font-bold scale-102 shadow-xs'
                      : 'border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#2A2029] text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="text-xl mb-1">{m.icon}</span>
                  <span className="text-[11px]">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Nível de Energia
              </span>
              <span className="text-[11px] font-bold text-[#A83260] dark:text-[#E878A0]">
                {energyLevel} de 5
              </span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEnergyLevel(lvl)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    energyLevel >= lvl
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'border-neutral-200 dark:border-[#493642] text-neutral-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" /> Copos de Água (Meta: 8-10 copos)
              </span>
              <span className="text-[11px] font-bold text-sky-600">{waterGlasses * 250} ml</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                className="w-8 h-8 rounded-lg border border-neutral-300 dark:border-[#493642] flex items-center justify-center font-bold"
              >
                -
              </button>
              <div className="flex-1 flex gap-1">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => setWaterGlasses(idx + 1)}
                    className={`flex-1 h-6 rounded-md cursor-pointer transition-colors ${
                      idx < waterGlasses ? 'bg-sky-500' : 'bg-neutral-200 dark:bg-[#30232D]'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setWaterGlasses(waterGlasses + 1)}
                className="w-8 h-8 rounded-lg border border-neutral-300 dark:border-[#493642] flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">Sintomas e sensações notadas hoje:</label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {commonSymptoms.map(symp => {
                const isSelected = selectedSymptoms.includes(symp);
                return (
                  <button
                    key={symp}
                    type="button"
                    onClick={() => toggleSymptom(symp)}
                    className={`text-xs px-2.5 py-1.5 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'border-neutral-200 dark:border-[#493642] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#2A2029]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {symp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-semibold mb-1">Notas Pessoais do Dia</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Como me senti hoje, o que comi, momentos especiais..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-indigo-600"
            />
          </div>

          {/* Questions for doctor */}
          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#A83260]" /> Perguntas para a Próxima Consulta
            </label>
            <input
              type="text"
              value={questionsForDoctor}
              onChange={e => setQuestionsForDoctor(e.target.value)}
              placeholder="Ex: É normal sentir um pequeno repuxar ao levantar?"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-indigo-600"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setActiveQuickModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#30232D]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-900/20"
            >
              Guardar no Diário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
