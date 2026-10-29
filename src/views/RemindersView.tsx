import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Calendar,
  History,
  ShieldAlert,
  Bell
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const {
    medications,
    logMedicationDose,
    deleteMedication,
    personalReminders,
    togglePersonalReminder,
    deletePersonalReminder,
    setActiveQuickModal
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'meds' | 'personal'>('meds');

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
            Rotina e Adesão Terapêutica
          </span>
          <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8]">
            Gestão de Lembretes & Tomas
          </h1>
          <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
            Organiza horários de suplementos e medicamentos prescritos pelo teu médico.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'meds' ? (
            <button
              onClick={() => setActiveQuickModal('medication')}
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Registar Medicamento
            </button>
          ) : (
            <button
              onClick={() => setActiveQuickModal('reminder')}
              className="text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Adicionar Lembrete
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-4 rounded-3xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Aviso Médico Crucial:</strong>
          <p className="leading-relaxed">
            Esta funcionalidade ajuda-te a organizar as tomas. Não substitui a orientação de um profissional de saúde. Nunca inicie, altere ou interrompa qualquer medicamento sem receita e instrução do seu médico ou posto de saúde em Angola.
          </p>
        </div>
      </div>

      {/* Sub Tabs: Medicamentos vs Lembretes Pessoais */}
      <div className="flex gap-2 border-b border-[#F0E4E9] dark:border-[#493642] pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('meds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'meds'
              ? 'bg-[#A83260] text-white shadow-sm'
              : 'bg-white dark:bg-[#241C23] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-[#493642]'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Medicamentos Prescritos ({medications.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('personal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            activeSubTab === 'personal'
              ? 'bg-[#A83260] text-white shadow-sm'
              : 'bg-white dark:bg-[#241C23] text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-[#493642]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Lembretes Pessoais ({personalReminders.length})</span>
        </button>
      </div>

      {/* Medications Content */}
      {activeSubTab === 'meds' && (
        <div className="space-y-6">
          {medications.length === 0 ? (
            <div className="bg-white dark:bg-[#241C23] p-10 rounded-3xl border border-[#F0E4E9] dark:border-[#493642] text-center space-y-3">
              <Pill className="w-10 h-10 mx-auto text-neutral-300" />
              <p className="text-sm font-semibold">Nenhum medicamento prescrito registado.</p>
              <button
                onClick={() => setActiveQuickModal('medication')}
                className="text-xs font-bold text-[#A83260] dark:text-[#E878A0] underline"
              >
                Registar primeiro medicamento prescrito
              </button>
            </div>
          ) : (
            medications.map(med => (
              <div
                key={med.id}
                className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                        {med.scheduleTimes.join(', ')} • Diário
                      </span>
                      {med.startDate && (
                        <span className="text-[10px] text-neutral-400">
                          Desde {med.startDate}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif-accent font-bold text-xl text-[#30232A] dark:text-[#FFF5F8]">
                      {med.medicationName}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      Dosagem: {med.dosage}
                    </p>
                    <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed max-w-xl">
                      {med.instructions}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => logMedicationDose(med.id, 'taken')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Marcar Tomada
                    </button>
                    <button
                      onClick={() => logMedicationDose(med.id, 'skipped')}
                      className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#30232D]"
                    >
                      Ignorar
                    </button>
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="p-2 rounded-xl border border-neutral-200 dark:border-[#493642] text-neutral-400 hover:text-rose-600"
                      title="Eliminar medicamento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Medication Logs History */}
                {med.logs && med.logs.length > 0 && (
                  <div className="pt-4 border-t border-[#F0E4E9] dark:border-[#493642] space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Histórico Recente de Tomas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {med.logs.slice(0, 4).map(log => (
                        <div
                          key={log.id}
                          className={`text-[11px] px-3 py-1 rounded-xl flex items-center gap-1.5 font-medium ${
                            log.status === 'taken'
                              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40'
                              : 'bg-neutral-100 text-neutral-600 dark:bg-[#30232D] dark:text-neutral-400'
                          }`}
                        >
                          {log.status === 'taken' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-neutral-400" />
                          )}
                          <span>{log.date} às {log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Personal Reminders Content */}
      {activeSubTab === 'personal' && (
        <div className="space-y-4">
          {personalReminders.length === 0 ? (
            <div className="bg-white dark:bg-[#241C23] p-10 rounded-3xl border border-[#F0E4E9] dark:border-[#493642] text-center space-y-3">
              <Clock className="w-10 h-10 mx-auto text-neutral-300" />
              <p className="text-sm font-semibold">Nenhum lembrete pessoal no momento.</p>
              <button
                onClick={() => setActiveQuickModal('reminder')}
                className="text-xs font-bold text-[#A83260] dark:text-[#E878A0] underline"
              >
                Criar primeiro lembrete
              </button>
            </div>
          ) : (
            personalReminders.map(rem => (
              <div
                key={rem.id}
                className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-4 sm:p-5 rounded-2xl shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePersonalReminder(rem.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      rem.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-neutral-300 dark:border-neutral-600'
                    }`}
                  >
                    {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold text-[#30232A] dark:text-[#FFF5F8] ${
                        rem.completed ? 'line-through text-neutral-400' : ''
                      }`}
                    >
                      {rem.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      {rem.date} às {rem.time} {rem.notes ? `• ${rem.notes}` : ''}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deletePersonalReminder(rem.id)}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-[#493642] text-neutral-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
