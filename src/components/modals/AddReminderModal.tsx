import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Calendar, CheckSquare } from 'lucide-react';

export const AddReminderModal: React.FC = () => {
  const { activeQuickModal, setActiveQuickModal, addPersonalReminder, user } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  if (activeQuickModal !== 'reminder') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addPersonalReminder({
      userId: user.id,
      title,
      date,
      time,
      notes: notes || undefined
    });

    setActiveQuickModal(null);
  };

  const presetSuggestions = [
    'Beber 2,5L de água tratada/filtrada ao longo do dia',
    'Verificar fixação e integridade do mosquiteiro no quarto',
    'Caminhada suave de 20 minutos no final da tarde',
    'Descansar 20 minutos com as pernas ligeiramente elevadas',
    'Organizar documentos para a próxima consulta pré-natal'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8]">
        <button
          onClick={() => setActiveQuickModal(null)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] text-neutral-500 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-accent font-bold text-xl">Novo Lembrete Pessoal</h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              Hábitos diários, bem-estar e tarefas de gravidez
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1 text-neutral-500">Sugestões rápidas:</label>
          <div className="flex flex-wrap gap-1.5">
            {presetSuggestions.slice(0, 3).map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTitle(item)}
                className="text-[11px] bg-neutral-100 dark:bg-[#30232D] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-[#493642] text-left truncate max-w-full"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Descrição do Lembrete</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Fazer exercício de respiração para o parto"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Data
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Hora
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Notas Adicionais (Opcional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Detalhes ou observações pessoais..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-emerald-600"
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
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/20"
            >
              Adicionar Lembrete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
