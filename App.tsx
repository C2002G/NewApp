import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/Header';
import { ConceptModal } from './components/ConceptModal';
import { CreateJobModal } from './components/CreateJobModal';
import { ReviewModal } from './components/ReviewModal';
import { ClientExploreView } from './components/ClientExploreView';
import { CleanerRadarView } from './components/CleanerRadarView';
import { MyJobsView } from './components/MyJobsView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { BottomNav } from './components/BottomNav';
import { 
  Sparkles, 
  ArrowRightLeft, 
  ShieldCheck, 
  MessageSquare, 
  Home, 
  ClipboardList, 
  User, 
  Radar 
} from 'lucide-react';

const MarketplaceApp: React.FC = () => {
  const { currentRole, setRole, activeTab, setActiveTab, activeUser } = useMarketplace();

  return (
    <div className="min-h-screen bg-[#f5fbf9] flex flex-col text-[#162a45]">
      {/* Top Header */}
      <Header />

      {/* Desktop Tab Navigation Bar */}
      <div className="hidden md:block bg-white border-b border-[#e2ece9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'explore'
                  ? 'border-[#0f9286] text-[#0f766e]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {currentRole === 'client' ? (
                <>
                  <Home className="w-4 h-4" />
                  <span>Explorar Serviços</span>
                </>
              ) : (
                <>
                  <Radar className="w-4 h-4 text-[#0f9286]" />
                  <span>Radar de Oportunidades</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('my_jobs')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'my_jobs'
                  ? 'border-[#0f9286] text-[#0f766e]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>{currentRole === 'client' ? 'Meus Pedidos' : 'Minha Agenda'}</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-[#0f9286] text-[#0f766e]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <span>Chat em Tempo Real</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-[#0f9286] text-[#0f766e]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Perfil & Reputação</span>
            </button>
          </div>

          {/* Role status pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Você está navegando como:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#e2f5f1] text-[#0f766e] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentRole === 'client' ? 'Cliente (Mariana)' : `Profissional (${activeUser.name.split(' ')[0]})`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'explore' && (
          currentRole === 'client' ? <ClientExploreView /> : <CleanerRadarView />
        )}

        {activeTab === 'my_jobs' && <MyJobsView />}

        {activeTab === 'chat' && <ChatView />}

        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals */}
      <ConceptModal />
      <CreateJobModal />
      <ReviewModal />

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}
