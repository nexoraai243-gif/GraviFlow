import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Heart,
  Bell,
  Moon,
  Sun,
  Shield,
  CreditCard,
  Download,
  Trash2,
  CheckCircle2,
  RotateCcw,
  LogOut,
  MapPin,
  Lock,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    calculatedWeek,
    daysRemaining,
    setActiveQuickModal,
    setActiveTab,
    resetToDemoData,
    addNotification,
    logout
  } = useApp();

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [province, setProvince] = useState(user.province);
  const [babyName, setBabyName] = useState(user.babyName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const provincesAngola = [
    'Luanda', 'Benguela', 'Huambo', 'Huíla', 'Cabinda', 'Cuanza Sul', 'Cuanza Norte',
    'Uíge', 'Malanje', 'Namibe', 'Zaire', 'Bié', 'Lunda Norte', 'Lunda Sul',
    'Moxico', 'Cunene', 'Cuando Cubango', 'Bengo'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name,
      phone,
      province,
      babyName: babyName.trim() || undefined
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    addNotification('Perfil Atualizado', 'Os teus dados pessoais foram guardados.', 'milestone');
  };

  const handleExportData = () => {
    const exportPayload = {
      user,
      exportDate: new Date().toISOString(),
      platform: 'Mãe Serena Angola',
      gestationalWeek: calculatedWeek
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-mae-serena-${user.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Dados Exportados', 'O ficheiro JSON com o histórico da gravidez foi descarregado.', 'milestone');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 sm:p-8 rounded-3xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#7D2347] to-[#A83260] text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-rose-950/20">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-accent font-bold text-2xl text-[#30232A] dark:text-[#FFF5F8]">
                  {user.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8E7ED] dark:bg-[#30232D] text-[#A83260] dark:text-[#E878A0]">
                  {user.role === 'admin' ? 'Administrador' : 'Utilizadora'}
                </span>
              </div>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                {user.email} • {user.province}, Angola
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveQuickModal('onboarding')}
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-[#493642] hover:bg-neutral-50 dark:hover:bg-[#30232D] transition-colors"
            >
              Recalcular Gestação
            </button>
          </div>
        </div>

        {/* Gestational Summary Mini Bar */}
        <div className="mt-6 pt-6 border-t border-[#F0E4E9] dark:border-[#493642] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 bg-[#FFFCFD] dark:bg-[#30232D] rounded-2xl border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] font-bold uppercase">Semana Atual</span>
            <span className="font-bold text-sm text-[#A83260] dark:text-[#E878A0]">Semana {calculatedWeek}</span>
          </div>
          <div className="p-3 bg-[#FFFCFD] dark:bg-[#30232D] rounded-2xl border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] font-bold uppercase">Tempo Restante</span>
            <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">~{daysRemaining} dias</span>
          </div>
          <div className="p-3 bg-[#FFFCFD] dark:bg-[#30232D] rounded-2xl border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] font-bold uppercase">Subscrição</span>
            <span className="font-bold text-sm text-emerald-600 capitalize">
              {user.isSubscribed ? user.planId : 'Básica'}
            </span>
          </div>
          <div className="p-3 bg-[#FFFCFD] dark:bg-[#30232D] rounded-2xl border border-neutral-100 dark:border-[#493642]">
            <span className="text-neutral-400 block text-[10px] font-bold uppercase">Nome do Bebé</span>
            <span className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8]">
              {user.babyName || 'Não definido'}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="font-serif-accent font-bold text-xl text-[#30232A] dark:text-[#FFF5F8]">
          Dados Pessoais
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Telemóvel (Angola)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+244 923 456 789"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Província de Residência</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              >
                {provincesAngola.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Nome Escolhido para o Bebé</label>
              <input
                type="text"
                value={babyName}
                onChange={e => setBabyName(e.target.value)}
                placeholder="Ex: Serena"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Alterações guardadas com sucesso!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white text-xs font-semibold shadow-md shadow-rose-900/20"
            >
              Guardar Perfil
            </button>
          </div>
        </form>
      </div>


      {/* Account Safety, Data Export & Management */}
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs space-y-4">
        <h2 className="font-serif-accent font-bold text-xl text-[#30232A] dark:text-[#FFF5F8]">
          Privacidade e Exportação de Dados
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#30232D] border border-neutral-100 dark:border-[#493642]">
            <div>
              <p className="font-bold">Exportar Histórico Pré-Natal (JSON)</p>
              <p className="text-[11px] text-neutral-500">
                Transfira todas as suas anotações, tomas de medicação e consultas para partilhar com o seu médico.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#241C23] border border-neutral-300 dark:border-[#493642] font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-50 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Descarregar
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#1E101A] border border-neutral-100 dark:border-[#3B1B2B]">
            <div>
              <p className="font-bold">Tipo de Conta GraviFlow</p>
              <p className="text-[11px] text-neutral-500">
                {user.role === 'admin' ? 'Conta de Desenvolvedor (Acesso Total)' : 'Utilizadora Registada'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#FCEEF3] dark:bg-[#2C1421] text-[#A83260] dark:text-[#E878A0] font-bold text-xs">
              {user.role === 'admin' ? 'Admin' : 'Utilizadora'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
            <div>
              <p className="font-bold text-rose-800 dark:text-rose-300">Restaurar Dados de Demonstração</p>
              <p className="text-[11px] text-rose-700/70 dark:text-rose-400">
                Volta ao estado inicial com o perfil da Ana Domingos (Semana 24).
              </p>
            </div>
            <button
              onClick={resetToDemoData}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar
            </button>
          </div>

          {/* Terminar Sessão - Redireciona para Cadastro e Login */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-100/60 dark:bg-rose-950/40 border border-rose-300/80 dark:border-rose-900/60">
            <div>
              <p className="font-bold text-rose-950 dark:text-rose-100">Terminar Sessão</p>
              <p className="text-[11px] text-rose-800 dark:text-rose-300">
                Encerra a sessão da tua conta e regressa à página de cadastro e login.
              </p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-[#7D2347] hover:bg-[#A83260] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              Terminar Sessão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
