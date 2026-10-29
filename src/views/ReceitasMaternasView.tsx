import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MATERNAL_RECIPES, FOOD_SAFETY_GUIDELINES } from '../data/recipes';
import { Recipe, RecipeCategory } from '../types';
import {
  UtensilsCrossed,
  Search,
  Sparkles,
  Heart,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  X,
  Share2,
  Droplets,
  BookOpen,
  Filter,
  Check,
  Info
} from 'lucide-react';

export const ReceitasMaternasView: React.FC = () => {
  const { user, calculatedWeek, currentTrimester } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [selectedTrimester, setSelectedTrimester] = useState<string>('todos');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'receitas' | 'seguranca'>('receitas');
  
  // Favorites persistence
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('maeserena_fav_recipes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteRecipeIds(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('maeserena_fav_recipes', JSON.stringify(updated));
      return updated;
    });
  };

  // Checked ingredients inside the recipe modal
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const toggleCheckIngredient = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return MATERNAL_RECIPES.filter(recipe => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(query);
        const matchesDesc = recipe.shortDescription.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients.some(i => i.toLowerCase().includes(query));
        const matchesTags = recipe.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesIngredients && !matchesTags) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'todas' && recipe.category !== selectedCategory) {
        return false;
      }

      // Trimester
      if (selectedTrimester !== 'todos') {
        if (recipe.trimester !== 'todos' && recipe.trimester !== selectedTrimester) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedTrimester]);

  const categories: Array<{ id: string; label: string; icon: string }> = [
    { id: 'todas', label: 'Todas as Receitas', icon: '🍽️' },
    { id: 'anti_enjoo', label: 'Anti-Enjoo (1º Trimestre)', icon: '🥣' },
    { id: 'ferro_anemia', label: 'Ricas em Ferro', icon: '🩸' },
    { id: 'calcio_ossos', label: 'Cálcio & Ossinhos', icon: '🦴' },
    { id: 'energia_fibras', label: 'Energia & Fibras', icon: '🌾' },
    { id: 'hidratacao', label: 'Hidratação & Múcua', icon: '🍹' },
    { id: 'lanches', label: 'Lanches Práticos', icon: '🥑' },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#7D2347] via-[#A83260] to-[#B83D6C] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <UtensilsCrossed className="w-3.5 h-3.5 text-rose-200" />
            <span>Nutrição Materna em Angola • Semana {calculatedWeek}</span>
          </div>

          <h1 className="font-serif-accent font-bold text-2xl sm:text-3xl text-white">
            Receitas & Nutrição para Grávidas
          </h1>

          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Alimentos frescos e seguros para cada trimestre, adaptados à culinária de Angola. Pratos ricos em ferro, ácido fólico, cálcio e soluções naturais para o enjoo matinal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setActiveTabSub('receitas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTabSub === 'receitas'
                  ? 'bg-white text-[#70213F] shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Ver Receitas ({MATERNAL_RECIPES.length})</span>
            </button>

            <button
              onClick={() => setActiveTabSub('seguranca')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTabSub === 'seguranca'
                  ? 'bg-white text-[#70213F] shadow-md'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>O Que Evitar & Cuidados na Gestação</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-view: Safety Guidelines (O Que Evitar) */}
      {activeTabSub === 'seguranca' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-amber-50 dark:bg-[#30232D] border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-accent font-bold text-base sm:text-lg text-amber-900 dark:text-amber-100 mb-1">
                  Guia de Segurança Alimentar Obstétrica para Angola
                </h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Durante a gravidez, as defesas imunitárias da mãe adaptam-se para proteger o bebé. Pequenas contaminações alimentares que antes passavam despercebidas podem afetar o feto. Segue estas recomendações clínicas em casa e nos restaurantes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FOOD_SAFETY_GUIDELINES.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#241C23] border border-rose-100 dark:border-[#493642] rounded-2xl p-5 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.riskLevel === 'Critico'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : item.riskLevel === 'Alerta'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {item.riskLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#30232A] dark:text-[#FFF5F8] mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-[#30232D] border border-rose-200 dark:border-[#493642] text-xs text-[#70213F] dark:text-[#E878A0] flex items-center justify-between">
            <span>Desejas voltar à lista completa de receitas saudáveis?</span>
            <button
              onClick={() => setActiveTabSub('receitas')}
              className="px-3 py-1.5 bg-[#A83260] text-white rounded-xl font-bold text-xs hover:bg-[#7D2347] transition-colors cursor-pointer"
            >
              Explorar Receitas
            </button>
          </div>
        </div>
      )}

      {/* Sub-view: Recipes List */}
      {activeTabSub === 'receitas' && (
        <div className="space-y-6">
          {/* Search & Trimester Filter Bar */}
          <div className="bg-white dark:bg-[#241C23] border border-rose-100 dark:border-[#493642] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por ingrediente (ex: peixe, múcua, aveia, kizaca, abacate)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-[#493642] bg-neutral-50/50 dark:bg-[#1E171E] text-xs text-[#30232A] dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#A83260]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Trimester Select */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <span className="text-[11px] font-semibold text-neutral-400 shrink-0 hidden sm:inline">
                  Trimestre:
                </span>
                <div className="grid grid-cols-4 gap-1 w-full sm:w-auto">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: '1', label: '1º Trim.' },
                    { id: '2', label: '2º Trim.' },
                    { id: '3', label: '3º Trim.' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTrimester(t.id)}
                      className={`px-2.5 py-2 text-[11px] font-semibold rounded-xl transition-all cursor-pointer text-center ${
                        selectedTrimester === t.id
                          ? 'bg-[#70213F] text-white shadow-xs font-bold'
                          : 'bg-neutral-100 dark:bg-[#30232D] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#A83260] text-white shadow-sm'
                        : 'bg-rose-50 dark:bg-[#30232D] text-[#70213F] dark:text-[#E878A0] hover:bg-rose-100'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Trimester Recommended Tip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-[#241C23] dark:to-[#30232D] border border-rose-200 dark:border-[#493642] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">✨</span>
              <p className="text-xs text-[#70213F] dark:text-[#E878A0] leading-snug">
                <strong>Recomendação para a tua {calculatedWeek}ª semana ({currentTrimester}º Trimestre):</strong>{' '}
                {currentTrimester === 1
                  ? 'Foca em refeições suaves, ricas em vitamina B6 e gengibre para neutralizar o enjoo matinal.'
                  : currentTrimester === 2
                  ? 'Fase de ganho muscular do bebé: aumenta alimentos com ferro (peixe, feijão) e vitamina C (múcua, laranja).'
                  : 'Fase de densidade óssea acelerada: prioriza o cálcio (iogurte, kizaca suave, folhas escuras) e muita água.'}
              </p>
            </div>
          </div>

          {/* Recipes Grid */}
          {filteredRecipes.length === 0 ? (
            <div className="bg-white dark:bg-[#241C23] border border-rose-100 dark:border-[#493642] rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-[#30232D] text-[#A83260] flex items-center justify-center mx-auto text-2xl">
                🍲
              </div>
              <h3 className="font-bold text-base text-[#30232A] dark:text-[#FFF5F8]">
                Nenhuma receita encontrada
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] max-w-sm mx-auto">
                Experimenta ajustar a tua pesquisa ou escolher a categoria &ldquo;Todas as Receitas&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todas');
                  setSelectedTrimester('todos');
                }}
                className="px-4 py-2 bg-[#A83260] text-white rounded-xl text-xs font-bold hover:bg-[#7D2347] transition-colors cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRecipes.map(recipe => {
                const isFav = favoriteRecipeIds.includes(recipe.id);
                return (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      setSelectedRecipe(recipe);
                      setCheckedIngredients({});
                    }}
                    className="bg-white dark:bg-[#241C23] border border-rose-100 dark:border-[#493642] rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-rose-300 dark:hover:border-rose-800 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Bar inside card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${recipe.bgGradient} flex items-center justify-center text-xl shadow-xs group-hover:scale-110 transition-transform`}>
                            {recipe.imageEmoji}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                              {recipe.category === 'anti_enjoo' && 'Anti-Enjoo'}
                              {recipe.category === 'ferro_anemia' && 'Rico em Ferro'}
                              {recipe.category === 'calcio_ossos' && 'Cálcio & Ossos'}
                              {recipe.category === 'energia_fibras' && 'Energia & Fibras'}
                              {recipe.category === 'hidratacao' && 'Hidratação'}
                              {recipe.category === 'lanches' && 'Lanche Saudável'}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-neutral-400" />
                                {recipe.prepTimeMinutes} min
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-neutral-400" />
                                {recipe.servings}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleFavorite(recipe.id, e)}
                          className={`p-2 rounded-xl transition-colors ${
                            isFav
                              ? 'text-rose-600 bg-rose-50 dark:bg-[#30232D]'
                              : 'text-neutral-300 hover:text-rose-500 hover:bg-neutral-50 dark:hover:bg-[#30232D]'
                          }`}
                          title={isFav ? 'Remover dos favoritos' : 'Guardar nos favoritos'}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600' : ''}`} />
                        </button>
                      </div>

                      <h3 className="font-serif-accent font-bold text-base text-[#30232A] dark:text-[#FFF5F8] group-hover:text-[#A83260] transition-colors mb-1.5 leading-snug">
                        {recipe.title}
                      </h3>

                      <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] leading-relaxed line-clamp-2 mb-3">
                        {recipe.shortDescription}
                      </p>

                      {/* Benefits preview badges */}
                      <div className="space-y-1.5 pt-2 border-t border-rose-50 dark:border-[#30232D]">
                        <div className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-rose-500 font-bold shrink-0">Mamã:</span>
                          <span className="text-[#30232A] dark:text-[#FFF5F8] line-clamp-1">{recipe.maternalBenefit}</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-amber-500 font-bold shrink-0">Bebé:</span>
                          <span className="text-[#30232A] dark:text-[#FFF5F8] line-clamp-1">{recipe.fetalBenefit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 flex items-center justify-between border-t border-neutral-100 dark:border-[#30232D]">
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#30232D] text-[#796A72] dark:text-[#C8B8C1]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-[#A83260] dark:text-[#E878A0] group-hover:translate-x-1 transition-transform">
                        <span>Ver Modo de Fazer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRecipe(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-[#30232D] text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3.5 mb-4 pr-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedRecipe.bgGradient} flex items-center justify-center text-3xl shadow-sm shrink-0`}>
                {selectedRecipe.imageEmoji}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A83260] dark:text-[#E878A0]">
                    Receita Recomendada • Angola
                  </span>
                  <span className="text-[10px] bg-rose-100 dark:bg-[#30232D] text-[#70213F] dark:text-[#E878A0] px-2 py-0.5 rounded-full font-semibold">
                    {selectedRecipe.trimester === 'todos' ? 'Todos os Trimestres' : `${selectedRecipe.trimester}º Trimestre`}
                  </span>
                </div>
                <h2 className="font-serif-accent font-bold text-xl sm:text-2xl text-[#70213F] dark:text-[#FFF5F8] mt-0.5">
                  {selectedRecipe.title}
                </h2>
              </div>
            </div>

            {/* Meta stats bar */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-rose-50/70 dark:bg-[#30232D] mb-5 text-center text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">TEMPO</span>
                <span className="font-bold text-[#70213F] dark:text-[#E878A0]">{selectedRecipe.prepTimeMinutes} minutos</span>
              </div>
              <div className="border-x border-rose-200/50 dark:border-[#493642]">
                <span className="text-[10px] text-neutral-400 block font-semibold">RENDIMENTO</span>
                <span className="font-bold text-[#70213F] dark:text-[#E878A0]">{selectedRecipe.servings}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block font-semibold">DIFICULDADE</span>
                <span className="font-bold text-[#70213F] dark:text-[#E878A0]">{selectedRecipe.difficulty}</span>
              </div>
            </div>

            {/* Benefits Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-[#2C212B] border border-rose-200/80 dark:border-[#493642]">
                <span className="text-[11px] font-bold text-[#A83260] dark:text-[#E878A0] flex items-center gap-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  Benefício para a Mamã:
                </span>
                <p className="text-xs text-[#30232A] dark:text-[#FFF5F8] leading-relaxed">
                  {selectedRecipe.maternalBenefit}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-[#2C212B] border border-amber-200/80 dark:border-[#493642]">
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Benefício para o Bebé:
                </span>
                <p className="text-xs text-[#30232A] dark:text-[#FFF5F8] leading-relaxed">
                  {selectedRecipe.fetalBenefit}
                </p>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-serif-accent font-bold text-base text-[#30232A] dark:text-[#FFF5F8] flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#A83260]" />
                  <span>Ingredientes (Marca para compras):</span>
                </h3>
                <span className="text-[11px] text-neutral-400">
                  {Object.values(checkedIngredients).filter(Boolean).length} de {selectedRecipe.ingredients.length} prontos
                </span>
              </div>

              <div className="space-y-1.5 bg-neutral-50 dark:bg-[#1E171E] p-3.5 rounded-2xl border border-neutral-100 dark:border-[#493642]">
                {selectedRecipe.ingredients.map((ing, idx) => {
                  const isChecked = Boolean(checkedIngredients[idx]);
                  return (
                    <label
                      key={idx}
                      onClick={() => toggleCheckIngredient(idx)}
                      className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-white dark:hover:bg-[#241C23] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-neutral-300 text-[#A83260] focus:ring-[#A83260]"
                      />
                      <span className={`text-xs leading-relaxed ${isChecked ? 'line-through text-neutral-400' : 'text-[#30232A] dark:text-[#FFF5F8]'}`}>
                        {ing}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mb-6">
              <h3 className="font-serif-accent font-bold text-base text-[#30232A] dark:text-[#FFF5F8] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A83260]" />
                <span>Modo de Preparação Passo a Passo:</span>
              </h3>

              <div className="space-y-3">
                {selectedRecipe.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-[#70213F] to-[#A83260] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-[#30232A] dark:text-[#FFF5F8] leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Obstetrician / Doctor's Tip */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-[#30232D] border border-rose-200 dark:border-[#493642] mb-6">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#A83260] dark:text-[#E878A0] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#70213F] dark:text-[#E878A0] mb-0.5">
                    Dica Médica do Obstetra:
                  </h4>
                  <p className="text-xs text-[#70213F]/90 dark:text-[#E878A0]/90 leading-relaxed">
                    {selectedRecipe.doctorTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100 dark:border-[#30232D]">
              <button
                onClick={(e) => toggleFavorite(selectedRecipe.id, e)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-[#493642] text-xs font-semibold hover:bg-rose-50 dark:hover:bg-[#30232D] transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${favoriteRecipeIds.includes(selectedRecipe.id) ? 'fill-rose-600 text-rose-600' : 'text-neutral-400'}`} />
                <span>
                  {favoriteRecipeIds.includes(selectedRecipe.id) ? 'Receita Guardada' : 'Guardar nos Favoritos'}
                </span>
              </button>

              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
