import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Sparkles, Plus, ArrowRightLeft, ShieldCheck, HelpCircle, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentRole,
    setRole,
    activeUser,
    clientUser,
    cleaners,
    activeCleanerId,
    setActiveCleanerId,
    setShowCreateJobModal,
    setShowPresentationModal,
    setActiveTab,
  } = useMarketplace();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2ece9] shadow-xs">
      {/* Top accent teal stripe */}
      <div className="h-1 bg-linear-to-r from-[#0f9286] via-[#11998e] to-[#38ef7d]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand identity matching the design */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 text-left group transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0f9286] to-[#147a70] flex items-center justify-center text-white shadow-sm shadow-[#0f9286]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#162a45]">Limpaépi</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#e2f5f1] text-[#0f766e]">
                  Limpa + App
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">Marketplace inteligente de limpeza</p>
            </div>
          </button>
        </div>

        {/* Action Buttons & Role Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Concept presentation button from screenshot */}
          <button
            onClick={() => setShowPresentationModal(true)}
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#d2e7e2] text-[#0f766e] bg-[#f2faf8] hover:bg-[#e4f5f1] transition cursor-pointer"
            title="Ver conceito Limpa + App"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ver Conceito</span>
          </button>

          {/* Quick primary buttons requested: "Solicitar serviço" & "Prestar serviço" */}
          {currentRole === 'client' ? (
            <>
              <button
                onClick={() => setShowCreateJobModal(true)}
                id="btn-solicitar-servico-header"
                className="flex items-center gap-1.5 bg-[#0f9286] hover:bg-[#0c7c72] active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Solicitar serviço</span>
              </button>

              <button
                onClick={() => setRole('cleaner')}
                className="hidden sm:flex items-center gap-1.5 border border-[#d3e5e1] hover:border-[#0f9286] text-[#162a45] hover:text-[#0f9286] text-xs font-semibold px-3 py-2 rounded-xl bg-white transition cursor-pointer"
                title="Mudar para visão de prestador"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#0f9286]" />
                <span>Prestar serviço</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setRole('client');
                  setShowCreateJobModal(true);
                }}
                className="hidden sm:flex items-center gap-1.5 border border-[#d3e5e1] hover:border-[#0f9286] text-[#162a45] hover:text-[#0f9286] text-xs font-semibold px-3 py-2 rounded-xl bg-white transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#0f9286]" />
                <span>Solicitar serviço</span>
              </button>

              <div className="flex items-center gap-1.5 bg-[#eaf7f4] text-[#0f766e] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#cbebe3]">
                <ShieldCheck className="w-4 h-4 text-[#0f9286]" />
                <span>Modo Profissional</span>
              </div>
            </>
          )}

          {/* Role & Persona Switcher */}
          <div className="flex items-center bg-[#f0f6f5] p-1 rounded-xl border border-[#dfebe8]">
            <button
              onClick={() => setRole('client')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                currentRole === 'client'
                  ? 'bg-white text-[#0f766e] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setRole('cleaner')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                currentRole === 'cleaner'
                  ? 'bg-[#0f9286] text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Profissional
            </button>
          </div>

          {/* User Avatar & selector */}
          <div className="relative group">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-[#eaf5f2] transition border border-transparent hover:border-[#d2e6e1] cursor-pointer"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#0f9286]/30"
              />
              <div className="hidden lg:block text-left text-xs leading-tight">
                <p className="font-bold text-[#162a45] max-w-[90px] truncate">{activeUser.name.split(' ')[0]}</p>
                <p className="text-[10px] text-[#0f766e] font-medium">{activeUser.rating} ★</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
