import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Pill, Clock, AlertCircle, Calendar } from 'lucide-react';
import { MedicationFrequency } from '../../types';

export const AddMedicationModal: React.FC = () => {
  const { activeQuickModal, setActiveQuickModal, addMedication, user } = useApp();

  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [frequency, setFrequency] = useState<MedicationFrequency>('daily');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  if (activeQuickModal !== 'medication') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName || !dosage || !instructions) return;

    addMedication({
      userId: user.id,
      medicationName,
      dosage,
      instructions,
      scheduleTimes: [scheduleTime],
      frequency,
      startDate,
      endDate: endDate || undefined
    });

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
          <div className="p-3 bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 rounded-2xl">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-accent font-bold text-xl">Registar Medicamento</h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              Organização de tomas prescritas pelo seu médico
            </p>
          </div>
        </div>

        {/* Mandatory Medical Disclaimer Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-3 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 mb-5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Aviso Importante:</strong> Esta funcionalidade ajuda-te a organizar as tomas. Não substitui a orientação de um profissional de saúde. Nunca inicie, altere ou interrompa medicamentos sem ordem médica.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome do Medicamento</label>
            <input
              type="text"
              required
              value={medicationName}
              onChange={e => setMedicationName(e.target.value)}
              placeholder="Ex: Sulfato Ferroso, Ácido Fólico, Cálcio..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-[#A83260]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Dosagem Exata Prescrita
            </label>
            <input
              type="text"
              required
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              placeholder="Ex: 1 comprimido (60mg Fe + 400mcg AF)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-[#A83260]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Instruções de Toma Fornecidas pelo Médico
            </label>
            <textarea
              rows={2}
              required
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Ex: Tomar imediatamente a seguir ao almoço com um copo de sumo de laranja ou água natural. Não tomar com leite."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Horário da Toma
              </label>
              <input
                type="time"
                required
                value={scheduleTime}
                onChange={e => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Frequência</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as MedicationFrequency)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              >
                <option value="daily">Uma vez ao dia</option>
                <option value="twice_daily">2 vezes ao dia (12 em 12h)</option>
                <option value="thrice_daily">3 vezes ao dia (8 em 8h)</option>
                <option value="weekly">Semanal</option>
                <option value="as_needed">Se necessário (SOS)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Início
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Data de Término (Opcional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
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
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-900/20"
            >
              Ativar Lembrete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
