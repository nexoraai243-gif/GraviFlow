import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Clock, ShieldAlert, AlertTriangle, HelpCircle, Share2 } from 'lucide-react';

export const GuideDetailModal: React.FC = () => {
  const { selectedGuideForModal, setSelectedGuideForModal, addNotification } = useApp();

  if (!selectedGuideForModal) return null;

  const guide = selectedGuideForModal;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.shortIntro,
        url: window.location.href
      }).catch(() => {});
    } else {
      addNotification('Link Copiado', 'O link do guia foi copiado para a área de transferência.', 'guide');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241C23] border border-[#F0E4E9] dark:border-[#493642] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setSelectedGuideForModal(null)}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F8E7ED] dark:hover:bg-[#30232D] text-neutral-500 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {guide.isUrgentAlert ? (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              Sinal de Alerta Vermelho
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F8E7ED] dark:bg-[#3D2C39] text-[#A83260] dark:text-[#E878A0] capitalize">
              {guide.category.replace('_', ' ')}
            </span>
          )}
          <span className="flex items-center gap-1 text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
            <Clock className="w-3.5 h-3.5" />
            {guide.readTimeMinutes} min de leitura
          </span>
        </div>

        {/* Title & Intro */}
        <h2 className="font-serif-accent font-bold text-2xl sm:text-3xl text-[#30232A] dark:text-[#FFF5F8] mb-3 leading-tight">
          {guide.title}
        </h2>
        <p className="text-sm text-[#796A72] dark:text-[#C8B8C1] leading-relaxed mb-6 font-medium">
          {guide.shortIntro}
        </p>

        {/* Medical Review Stamp */}
        <div className="bg-[#FFFCFD] dark:bg-[#30232D] border border-emerald-200 dark:border-emerald-900/60 p-3.5 rounded-2xl flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-[#30232A] dark:text-[#FFF5F8]">
              Revisto clinicamente por {guide.reviewerName}
            </p>
            <p className="text-[11px] text-[#796A72] dark:text-[#C8B8C1]">
              {guide.reviewerTitle} • Última revisão: {guide.medicalReviewDate}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-8 text-xs sm:text-sm leading-relaxed text-[#30232A] dark:text-[#FFF5F8]">
          {guide.sections.map((sec, idx) => (
            <div key={idx} className="border-t border-[#F0E4E9] dark:border-[#493642] pt-4">
              <h3 className="font-serif-accent font-bold text-lg text-[#7D2347] dark:text-[#E878A0] mb-2">
                {sec.heading}
              </h3>
              <div className="whitespace-pre-line text-[#30232A] dark:text-[#C8B8C1] space-y-2">
                {sec.body}
              </div>
            </div>
          ))}
        </div>

        {/* Questions for next appointment */}
        {guide.questionsForDoctor && guide.questionsForDoctor.length > 0 && (
          <div className="bg-[#F8E7ED]/50 dark:bg-[#3D2C39]/40 border border-[#E0CBD3] dark:border-[#493642] p-4 rounded-2xl mb-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#A83260] dark:text-[#E878A0] flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-4 h-4" /> Perguntas para a Próxima Consulta Pré-Natal:
            </h4>
            <ul className="space-y-1.5 text-xs text-[#30232A] dark:text-[#FFF5F8]">
              {guide.questionsForDoctor.map((q, qIdx) => (
                <li key={qIdx} className="flex items-start gap-2">
                  <span className="text-[#A83260] dark:text-[#E878A0] font-bold">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Disclaimer Banner */}
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 rounded-2xl text-[11px] text-rose-900 dark:text-rose-200 flex items-start gap-2 mb-6">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <p>
            <strong>Aviso Clínico Obrigatório:</strong> Os conteúdos desta aplicação são informativos e não substituem uma consulta médica presencial. Em caso de sintomas anormais, consulte sempre o seu médico ou dirija-se à maternidade mais próxima.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-[#30232D]"
          >
            <Share2 className="w-3.5 h-3.5" /> Partilhar Guia
          </button>
          <button
            onClick={() => setSelectedGuideForModal(null)}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7D2347] to-[#A83260] text-white text-xs font-semibold shadow-md shadow-rose-900/20 hover:opacity-95 text-center"
          >
            Fechar Leitura
          </button>
        </div>
      </div>
    </div>
  );
};
