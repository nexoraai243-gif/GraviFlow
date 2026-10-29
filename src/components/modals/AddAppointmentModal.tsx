import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, MapPin, User, FileText, Bell } from 'lucide-react';
import { AppointmentCategory } from '../../types';

export const AddAppointmentModal: React.FC = () => {
  const { activeQuickModal, setActiveQuickModal, addAppointment, user } = useApp();

  const [title, setTitle] = useState('Consulta Pré-Natal de Rotina');
  const [category, setCategory] = useState<AppointmentCategory>('prenatal');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('09:00');
  const [clinicOrDoctor, setClinicOrDoctor] = useState('Maternidade Lucrécia Paim');
  const [address, setAddress] = useState('Rua Amílcar Cabral, Luanda');
  const [notes, setNotes] = useState('Levar caderneta da grávida do MINSA e análises recentes.');
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(60);

  if (activeQuickModal !== 'appointment') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    addAppointment({
      userId: user.id,
      title,
      category,
      date,
      time,
      clinicOrDoctor,
      address,
      province: user.province || 'Luanda',
      notes,
      reminderMinutesBefore
    });

    setActiveQuickModal(null);
  };

  const categories: Array<{ id: AppointmentCategory; label: string }> = [
    { id: 'prenatal', label: 'Pré-Natal Geral' },
    { id: 'ultrassom', label: 'Ecografia / Ultrassom' },
    { id: 'analises', label: 'Análises de Sangue/Urina' },
    { id: 'dentista', label: 'Saúde Oral / Dentista' },
    { id: 'urgencia', label: 'Consulta de Urgência' },
    { id: 'outra', label: 'Outro Acompanhamento' }
  ];

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

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-rose-100 dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-accent font-bold text-xl">Marcar Nova Consulta</h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              Agendamento de cuidados e exames em Angola
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Título da Consulta</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Consulta Pré-Natal do 2º Trimestre"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-[#A83260]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Tipo de Consulta</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                    category === cat.id
                      ? 'border-[#A83260] bg-[#F8E7ED] text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0]'
                      : 'border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#2A2029]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#A83260]" /> Data
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#A83260]" /> Hora (Africa/Luanda)
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#A83260]" /> Profissional ou Clínica
            </label>
            <input
              type="text"
              value={clinicOrDoctor}
              onChange={e => setClinicOrDoctor(e.target.value)}
              placeholder="Ex: Dra. Esperança Manuel ou Maternidade Lucrécia Paim"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-[#A83260]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#A83260]" /> Localização / Província
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Ex: Maternidade Lucrécia Paim, Rua Amílcar Cabral, Luanda"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-[#A83260]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#A83260]" /> Notas ou Preparação
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Levar caderneta, beber 1L de água antes da ecografia..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-[#A83260]" /> Lembrete de Notificação
            </label>
            <select
              value={reminderMinutesBefore}
              onChange={e => setReminderMinutesBefore(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
            >
              <option value={30}>30 minutos antes</option>
              <option value={60}>1 hora antes</option>
              <option value={120}>2 horas antes</option>
              <option value={1440}>1 dia antes</option>
            </select>
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white text-xs font-semibold shadow-md shadow-rose-900/20 hover:opacity-95"
            >
              Guardar Consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
