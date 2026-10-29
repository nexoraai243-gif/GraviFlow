import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X, ShieldAlert, MapPin } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-rose-50 border-b border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50 px-4 py-2 text-xs flex items-center justify-between text-rose-900 dark:text-rose-200">
        <div className="flex items-center gap-2 font-medium truncate">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 animate-pulse" />
          <span className="truncate">
            <strong>Aviso de Saúde:</strong> Esta aplicação é informativa e não substitui consulta médica.
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="shrink-0 ml-3 text-xs bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-full font-semibold transition-colors flex items-center gap-1 shadow-sm"
        >
          <PhoneCall className="w-3 h-3" />
          <span>Linhas de Urgência em Angola</span>
        </button>
      </div>

      {/* Emergency Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-rose-900/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8]">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/40 text-neutral-500 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-900/40 rounded-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif-accent font-bold text-xl leading-tight">Urgências Obstétricas — Angola</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Atendimento 24 horas por dia</p>
              </div>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/60 p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 mb-4">
              <strong className="block mb-1 font-semibold text-rose-700 dark:text-rose-300">
                Sinais de Perigo Imediato:
              </strong>
              Sangramento vaginal, dor abdominal severa, febre alta com calafrios, convulsões, perda súbita de líquido ou falta prolongada de movimentos do feto.
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D]">
                <div>
                  <h4 className="font-semibold text-sm">Emergências Médicas Nacionais</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Linha telefónica oficial gratuita</p>
                </div>
                <a
                  href="tel:111"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 shadow-sm"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  111
                </a>
              </div>

              <div className="p-3 rounded-xl border border-neutral-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D]">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Maternidade Lucrécia Paim</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500" /> Rua Amílcar Cabral, Luanda
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    24h Aberto
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-neutral-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#30232D]">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">Maternidade Augusto Ngangula</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-500" /> Bairro Vila Alice, Luanda
                    </p>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                    24h Aberto
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center mb-4 leading-relaxed">
              Em caso de dúvida urgente, não espere. Desloque-se acompanhada com a sua caderneta de grávida e documento de identificação.
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              Compreendi e Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
