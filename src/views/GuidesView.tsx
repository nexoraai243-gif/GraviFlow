import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Search,
  ShieldAlert,
  Clock,
  CheckCircle,
  Lock,
  ArrowRight,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { EducationalGuide } from '../types';

export const GuidesView: React.FC = () => {
  const {
    guides,
    setSelectedGuideForModal,
    user,
    setIsCheckoutOpen,
    setCheckoutSelectedPlan,
    plans
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos os Guias' },
    { id: 'sinais_alerta', label: '🚨 Sinais de Alerta' },
    { id: 'consultas', label: 'Consultas MINSA' },
    { id: 'alimentacao', label: 'Nutrição em Angola' },
    { id: 'primeiro_trimestre', label: '1º Trimestre' },
    { id: 'mala_maternidade', label: 'Mala de Maternidade' },
    { id: 'parto', label: 'Preparação do Parto' },
    { id: 'amamentacao', label: 'Amamentação' },
    { id: 'pos_parto', label: 'Pós-Parto & Resguardo' }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.shortIntro.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenGuide = (guide: EducationalGuide) => {
    // If premium guide and user not subscribed, prompt checkout
    if (!guide.isFree && !user.isSubscribed) {
      setCheckoutSelectedPlan(plans[1]);
      setIsCheckoutOpen(true);
      return;
    }
    setSelectedGuideForModal(guide);
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] p-6 rounded-3xl shadow-xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A83260] dark:text-[#E878A0]">
            Biblioteca Médica e Cuidados Locais
          </span>
          <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8]">
            Guias Educativos da Gravidez
          </h1>
          <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] mt-0.5">
            Orientações clínicas revistas por especialistas com foco na realidade de Angola.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar guias, sintomas, nutrição..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#E0CBD3] dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D] text-xs focus:border-[#A83260]"
          />
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4 rounded-3xl text-xs text-rose-900 dark:text-rose-200 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Aviso Médico Crucial:</strong>
          <p className="leading-relaxed">
            Os conteúdos desta aplicação são informativos e não substituem uma consulta médica presencial. Em caso de sangramento, febre alta, dor abdominal severa ou ausência de movimentos fetais, procure uma maternidade de urgência imediatamente.
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#A83260] text-white shadow-sm scale-102'
                : 'bg-white dark:bg-[#241C23] border border-[#E0CBD3] dark:border-[#493642] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#30232D]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map(guide => {
          const isLocked = !guide.isFree && !user.isSubscribed;

          return (
            <div
              key={guide.id}
              onClick={() => handleOpenGuide(guide)}
              className={`bg-white dark:bg-[#241C23] rounded-3xl p-6 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                guide.isUrgentAlert
                  ? 'border-2 border-rose-500 bg-gradient-to-br from-white to-rose-50/60 dark:from-[#241C23] dark:to-rose-950/30'
                  : 'border-[#F0E4E9] dark:border-[#493642]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {guide.isUrgentAlert ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                      <ShieldAlert className="w-3 h-3" />
                      Urgência Médica
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F8E7ED] dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] capitalize">
                      {guide.category.replace('_', ' ')}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {guide.isFree ? (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                        Gratuito
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Premium
                      </span>
                    )}
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.readTimeMinutes} min
                    </span>
                  </div>
                </div>

                <h3 className="font-serif-accent font-bold text-lg sm:text-xl text-[#30232A] dark:text-[#FFF5F8] leading-snug">
                  {guide.title}
                </h3>

                <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed line-clamp-3">
                  {guide.shortIntro}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#F0E4E9] dark:border-[#493642] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[180px]">Por {guide.reviewerName}</span>
                </div>

                <span className="font-bold text-[#A83260] dark:text-[#E878A0] flex items-center gap-1">
                  {isLocked ? 'Desbloquear Guia' : 'Ler Artigo'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
