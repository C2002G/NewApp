import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Home, 
  Search, 
  ClipboardList, 
  MessageSquare, 
  User, 
  Plus, 
  Radar, 
  Sparkles 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    currentRole, 
    activeTab, 
    setActiveTab, 
    setShowCreateJobModal, 
    messages,
    jobs
  } = useMarketplace();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2ece9] shadow-lg pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {/* Tab 1: Início / Radar */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'explore'
              ? 'text-[#0f9286]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {currentRole === 'client' ? (
            <Home className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <Radar className="w-5 h-5 stroke-[2.2]" />
          )}
          <span className="text-[10px] font-bold mt-1">
            {currentRole === 'client' ? 'Início' : 'Radar'}
          </span>
        </button>

        {/* Tab 2: Meus Pedidos / Minhas Faxinas */}
        <button
          onClick={() => setActiveTab('my_jobs')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'my_jobs'
              ? 'text-[#0f9286]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ClipboardList className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-1">
            {currentRole === 'client' ? 'Pedidos' : 'Agenda'}
          </span>
        </button>

        {/* Central Floating Action Button (Solicitar Faxina if client) */}
        {currentRole === 'client' && (
          <div className="-mt-5">
            <button
              onClick={() => setShowCreateJobModal(true)}
              className="w-12 h-12 rounded-full bg-linear-to-tr from-[#0f9286] to-[#14a395] text-white flex items-center justify-center shadow-lg shadow-[#0f9286]/40 active:scale-95 transition cursor-pointer"
              title="Solicitar serviço"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Tab 3: Chat com Badge */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl relative transition cursor-pointer ${
            activeTab === 'chat'
              ? 'text-[#0f9286]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-[10px] font-bold mt-1">Chat</span>
        </button>

        {/* Tab 4: Perfil & Reputação */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#0f9286]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-bold mt-1">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
