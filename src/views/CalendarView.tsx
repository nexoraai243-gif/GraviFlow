import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Trash2,
  Plus,
  Filter,
  AlertCircle
} from 'lucide-react';
import { AppointmentCategory } from '../types';

export const CalendarView: React.FC = () => {
  const {
    appointments,
    toggleAppointmentComplete,
    deleteAppointment,
    personalReminders,
    togglePersonalReminder,
    deletePersonalReminder,
    setActiveQuickModal
  } = useApp();

  // Current view month & year (starting Oct 2026 as per time context)
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 27)); // Oct 27, 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-29');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // convert to Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateKey = (d: number) => {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  // Filter events for selected date
  const appointmentsOnSelected = appointments.filter(
    a => a.date === selectedDateStr && (filterCategory === 'all' || a.category === filterCategory)
  );

  const remindersOnSelected = personalReminders.filter(
    r => r.date === selectedDateStr
  );

  const upcomingList = [...appointments]
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const getCategoryColor = (cat: AppointmentCategory) => {
    switch (cat) {
      case 'prenatal':
        return 'bg-rose-100 text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0]';
      case 'ultrassom':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      case 'analises':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300';
      case 'dentista':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'urgencia':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-[#30232D] dark:text-neutral-300';
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
            Agenda Pré-Natal • Fuso Horário de Luanda
          </span>
          <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8]">
            Calendário de Consultas e Exames
          </h1>
          <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
            Organiza as consultas nas maternidades e clínicas em Angola sem perder prazos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveQuickModal('appointment')}
            className="text-xs font-bold px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white shadow-md shadow-rose-900/20 hover:scale-102 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Marcar Consulta
          </button>
        </div>
      </div>

      {/* Main Calendar Grid and Day Details Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Left Column */}
        <div className="lg:col-span-7 bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
          {/* Month Navigator */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E9] dark:border-[#493642]">
            <h2 className="font-serif-accent font-bold text-xl text-[#30232A] dark:text-[#FFF5F8]">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                aria-label="Mês anterior"
                className="p-1.5 rounded-xl border border-neutral-200 dark:border-[#493642] hover:bg-neutral-100 dark:hover:bg-[#30232D]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Próximo mês"
                className="p-1.5 rounded-xl border border-neutral-200 dark:border-[#493642] hover:bg-neutral-100 dark:hover:bg-[#30232D]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-400 py-1">
            {daysOfWeek.map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {/* Blank days from previous month */}
            {Array.from({ length: startingDay }).map((_, idx) => (
              <div
                key={`prev-${idx}`}
                className="h-14 sm:h-16 rounded-xl border border-dashed border-neutral-100 dark:border-[#30232D] text-neutral-300 dark:text-neutral-600 p-1 text-[10px]"
              >
                {prevMonthDays - startingDay + idx + 1}
              </div>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateKey = formatDateKey(dayNum);
              const isSelected = dateKey === selectedDateStr;
              const isToday = dateKey === '2026-10-27';

              const dayApts = appointments.filter(a => a.date === dateKey);
              const dayRems = personalReminders.filter(r => r.date === dateKey);
              const hasEvents = dayApts.length > 0 || dayRems.length > 0;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateKey)}
                  className={`h-14 sm:h-16 rounded-2xl p-1.5 cursor-pointer transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'border-[#A83260] bg-[#F8E7ED]/70 dark:bg-[#3D2C39] font-bold shadow-xs'
                      : 'border-neutral-100 dark:border-[#30232D] bg-[#FFFCFD] dark:bg-[#2A2029] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        isToday
                          ? 'bg-[#A83260] text-white font-bold'
                          : isSelected
                          ? 'text-[#A83260] dark:text-[#E878A0] font-bold'
                          : 'text-[#30232A] dark:text-[#FFF5F8]'
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  {/* Event indicators dots */}
                  {hasEvents && (
                    <div className="flex items-center gap-1 overflow-hidden pt-1">
                      {dayApts.slice(0, 2).map((_, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-[#A83260] dark:bg-[#E878A0]"
                        />
                      ))}
                      {dayRems.slice(0, 1).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#A83260]" /> Consultas / Exames
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Lembretes Pessoais
            </span>
            <span>Hora: UTC+1 (Luanda)</span>
          </div>
        </div>

        {/* Selected Date Details Right Column */}
        <div className="lg:col-span-5 bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E4E9] dark:border-[#493642]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                Dia Selecionado
              </span>
              <h3 className="font-serif-accent font-bold text-lg text-[#30232A] dark:text-[#FFF5F8]">
                {selectedDateStr}
              </h3>
            </div>
            <button
              onClick={() => setActiveQuickModal('appointment')}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] hover:bg-rose-200"
            >
              + Adicionar
            </button>
          </div>

          {/* Events for selected day */}
          <div className="space-y-3">
            {appointmentsOnSelected.length === 0 && remindersOnSelected.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400 space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto opacity-30 text-[#A83260]" />
                <p>Nenhuma consulta ou lembrete para esta data.</p>
                <button
                  onClick={() => setActiveQuickModal('appointment')}
                  className="text-xs font-bold text-[#A83260] dark:text-[#E878A0] hover:underline"
                >
                  Agendar agora para este dia
                </button>
              </div>
            ) : (
              <>
                {appointmentsOnSelected.map(apt => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-neutral-100 dark:border-[#3D2C39] bg-[#FFFCFD] dark:bg-[#30232D] space-y-2 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getCategoryColor(apt.category)}`}>
                        {apt.category.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleAppointmentComplete(apt.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            apt.completed
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'border-neutral-200 text-neutral-400 hover:text-emerald-600'
                          }`}
                          title="Marcar como realizada"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-rose-600"
                          title="Eliminar consulta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className={`font-bold text-xs ${apt.completed ? 'line-through text-neutral-400' : ''}`}>
                      {apt.title}
                    </h4>

                    <div className="space-y-1 text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#A83260]" />
                        <span>{apt.time} (Africa/Luanda)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#A83260]" />
                        <span className="truncate">{apt.clinicOrDoctor} • {apt.address}</span>
                      </div>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-neutral-500 italic bg-neutral-50 dark:bg-[#241C23] p-2 rounded-lg">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>
                ))}

                {remindersOnSelected.map(rem => (
                  <div
                    key={rem.id}
                    className="p-3 rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span className={rem.completed ? 'line-through text-neutral-400' : 'font-medium'}>
                        {rem.title} ({rem.time})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePersonalReminder(rem.id)}
                        className={`p-1 rounded-md ${rem.completed ? 'text-emerald-700' : 'text-neutral-400'}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePersonalReminder(rem.id)}
                        className="p-1 rounded-md text-neutral-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Full Upcoming Appointments Timeline */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <h3 className="font-serif-accent font-bold text-xl">Todas as Próximas Consultas</h3>
        <div className="divide-y divide-[#F0E4E9] dark:divide-[#493642]">
          {upcomingList.map(apt => (
            <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mr-2 ${getCategoryColor(apt.category)}`}>
                  {apt.category}
                </span>
                <span className="font-bold text-xs text-[#30232A] dark:text-[#FFF5F8]">
                  {apt.title}
                </span>
                <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
                  {apt.clinicOrDoctor} • {apt.address}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-[#A83260] dark:text-[#E878A0] bg-[#F8E7ED] dark:bg-[#3D2C39] px-2.5 py-1 rounded-lg">
                  {apt.date} às {apt.time}
                </span>
                <button
                  onClick={() => toggleAppointmentComplete(apt.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    apt.completed ? 'bg-emerald-100 text-emerald-800' : 'border border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {apt.completed ? 'Concluída' : 'Marcar Feita'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
