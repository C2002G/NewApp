import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Clock, Users, Award } from 'lucide-react';

export const ConceptModal: React.FC = () => {
  const {
    showPresentationModal,
    setShowPresentationModal,
    setRole,
    setActiveTab,
    setShowCreateJobModal
  } = useMarketplace();

  if (!showPresentationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0f1d30]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#edf8f5] rounded-3xl shadow-2xl border border-[#cbe7e0] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowPresentationModal(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 flex items-center justify-center shadow-xs transition cursor-pointer"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Presentation typography matching screenshot */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="inline-block px-3.5 py-1.5 rounded-lg bg-[#dcf2ed] text-[#0f766e] text-xs font-bold tracking-wider uppercase mb-6">
              LIMPA + APP
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#162a45] tracking-tight mb-4">
              Limpaépi
            </h1>

            <p className="text-lg sm:text-xl text-[#2d4766] font-medium leading-relaxed mb-8 max-w-md">
              Uma nova forma de conectar pessoas e serviços de limpeza.
            </p>

            <div className="space-y-3 mb-8 text-xs text-gray-500 max-w-xs">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0f9286]" />
                Autonomia real para o profissional negociar
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0f9286]" />
                Praticidade e comparação de preços para o cliente
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0f9286]" />
                Construção mútua de reputação transparente
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#cee3dd]">
            <p className="text-xs text-gray-400 mb-1">
              Apresentação conceitual para desenvolvimento • Nome provisório em validação
            </p>
            <p className="text-sm font-bold text-[#0f9286]">
              Hoje, uma plataforma web. Amanhã, o app da sua limpeza.
            </p>
          </div>
        </div>

        {/* Right Side: Visual Card matching the screenshot */}
        <div className="w-full md:w-[380px] bg-[#dcf2ed]/60 p-6 sm:p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-[#cbe5de]">
          <div className="w-full bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-[#e2ece9] flex flex-col gap-3.5">
            <button
              onClick={() => {
                setShowPresentationModal(false);
                setRole('cleaner');
                setActiveTab('explore');
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#eaf7f4] hover:bg-[#d8f0ea] text-[#0f766e] font-bold text-sm text-center transition cursor-pointer flex items-center justify-between"
            >
              <span>Limpeza disponível</span>
              <span className="text-xs bg-white text-[#0f766e] px-2 py-0.5 rounded-full font-bold">Ver</span>
            </button>

            <button
              onClick={() => {
                setShowPresentationModal(false);
                setRole('client');
                setActiveTab('explore');
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#f4f7f6] hover:bg-[#e9f0ee] text-[#162a45] font-bold text-sm text-center transition cursor-pointer flex items-center justify-between"
            >
              <span>Profissionais</span>
              <span className="text-xs bg-[#e2ece9] text-[#162a45] px-2 py-0.5 rounded-full font-bold">140+</span>
            </button>

            <button
              onClick={() => {
                setShowPresentationModal(false);
                setRole('client');
                setShowCreateJobModal(true);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#f4f7f6] hover:bg-[#e9f0ee] text-[#162a45] font-bold text-sm text-center transition cursor-pointer flex items-center justify-between"
            >
              <span>Escolha e agende</span>
              <Sparkles className="w-4 h-4 text-[#0f9286]" />
            </button>

            <div className="pt-2">
              <button
                onClick={() => setShowPresentationModal(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] active:scale-[0.98] text-white font-bold text-sm text-center shadow-md shadow-[#0f9286]/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
