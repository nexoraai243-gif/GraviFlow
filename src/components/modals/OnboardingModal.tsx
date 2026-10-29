import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Calendar, Sparkles, Check, MapPin, Bell } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { activeQuickModal, setActiveQuickModal, user, setUser, addNotification } = useApp();

  const [name, setName] = useState(user.name || '');
  const [province, setProvince] = useState(user.province || 'Luanda');
  const [method, setMethod] = useState<'week' | 'lmp' | 'edd'>('week');
  const [confirmedWeek, setConfirmedWeek] = useState(user.confirmedWeek || 24);
  const [lmpDate, setLmpDate] = useState(user.lmpDate || '2026-05-12');
  const [eddDate, setEddDate] = useState(user.eddDate || '2027-02-16');
  const [babyName, setBabyName] = useState(user.babyName || '');
  const [pushEnabled, setPushEnabled] = useState(user.notificationPrefs.pushEnabled);

  if (activeQuickModal !== 'onboarding') return null;

  const provincesAngola = [
    'Luanda', 'Benguela', 'Huambo', 'Huíla', 'Cabinda', 'Cuanza Sul', 'Cuanza Norte',
    'Uíge', 'Malanje', 'Namibe', 'Zaire', 'Bié', 'Lunda Norte', 'Lunda Sul',
    'Moxico', 'Cunene', 'Cuando Cubango', 'Bengo'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setUser(prev => ({
      ...prev,
      name: name.trim() || 'Mamã',
      province,
      confirmedWeek: method === 'week' ? confirmedWeek : undefined,
      lmpDate: method === 'lmp' ? lmpDate : undefined,
      eddDate: method === 'edd' ? eddDate : undefined,
      babyName: babyName.trim() || undefined,
      notificationPrefs: {
        ...prev.notificationPrefs,
        pushEnabled
      },
      onboardingCompleted: true
    }));

    addNotification(
      'Perfil Atualizado',
      'Os teus dados gestacionais foram recalculados com sucesso.',
      'milestone',
      'inicio'
    );

    setActiveQuickModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setActiveQuickModal(null)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] text-neutral-500 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-rose-100 dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] rounded-2xl">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h3 className="font-serif-accent font-bold text-xl sm:text-2xl">
              Configurar Minha Gravidez
            </h3>
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              Personaliza o teu acompanhamento semana a semana
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Como gostarias de ser chamada?</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Ana Domingos"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-sm focus:border-[#A83260]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#A83260]" /> Província
              </label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              >
                {provincesAngola.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#A83260]" /> Nome do Bebé (Opcional)
              </label>
              <input
                type="text"
                value={babyName}
                onChange={e => setBabyName(e.target.value)}
                placeholder="Ex: Serena"
                className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
          </div>

          {/* Dating Method Selector */}
          <div className="border-t border-[#F0E4E9] dark:border-[#493642] pt-3">
            <label className="block text-xs font-semibold mb-2">
              Como queres calcular a idade gestacional?
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setMethod('week')}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-colors ${
                  method === 'week'
                    ? 'border-[#A83260] bg-[#F8E7ED] text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0] font-bold'
                    : 'border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#2A2029]'
                }`}
              >
                Semana Confirmada
              </button>
              <button
                type="button"
                onClick={() => setMethod('lmp')}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-colors ${
                  method === 'lmp'
                    ? 'border-[#A83260] bg-[#F8E7ED] text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0] font-bold'
                    : 'border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#2A2029]'
                }`}
              >
                Data da Última Menstruação
              </button>
              <button
                type="button"
                onClick={() => setMethod('edd')}
                className={`py-2 px-2 rounded-xl text-[11px] font-medium border text-center transition-colors ${
                  method === 'edd'
                    ? 'border-[#A83260] bg-[#F8E7ED] text-[#A83260] dark:bg-[#3D2C39] dark:text-[#E878A0] font-bold'
                    : 'border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#2A2029]'
                }`}
              >
                Data Prevista do Parto
              </button>
            </div>

            {method === 'week' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Semana atual confirmada por ecografia ou médico:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={confirmedWeek}
                    onChange={e => setConfirmedWeek(Number(e.target.value))}
                    className="flex-1 accent-[#A83260]"
                  />
                  <span className="font-bold text-base text-[#A83260] dark:text-[#E878A0] w-16 text-right">
                    Semana {confirmedWeek}
                  </span>
                </div>
              </div>
            )}

            {method === 'lmp' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Primeiro dia da tua última menstruação (DUM):
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={e => setLmpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
                />
              </div>
            )}

            {method === 'edd' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Data provável do parto estimada pelo médico (DPA):
                </label>
                <input
                  type="date"
                  value={eddDate}
                  onChange={e => setEddDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
                />
              </div>
            )}

            <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed">
              * Nota: As datas da gravidez são estimativas informativas e podem ser ajustadas a qualquer momento pelo teu médico obstetra.
            </p>
          </div>

          <div className="border-t border-[#F0E4E9] dark:border-[#493642] pt-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={pushEnabled}
                onChange={e => setPushEnabled(e.target.checked)}
                className="rounded-sm text-[#A83260] focus:ring-[#A83260]"
              />
              <span className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#A83260]" />
                Receber lembretes de consultas e tomas no navegador
              </span>
            </label>
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white text-xs font-semibold shadow-md shadow-rose-900/20 hover:opacity-95 text-center"
            >
              Guardar e Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
