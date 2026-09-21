import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CleaningJob } from '../types';
import { 
  ClipboardList, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  Star, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const MyJobsView: React.FC = () => {
  const { 
    currentRole, 
    activeUser, 
    jobs, 
    clientUser, 
    cleaners, 
    setActiveChatJobId, 
    setActiveTab, 
    setShowCreateJobModal,
    updateJobStatus,
    setReviewModalData
  } = useMarketplace();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const isClient = currentRole === 'client';

  // Filter jobs for active persona
  const userJobs = jobs.filter(job => {
    if (isClient) {
      return job.clientId === clientUser.id;
    } else {
      return (
        job.acceptedCleanerId === activeUser.id ||
        job.proposals.some(p => p.cleanerId === activeUser.id)
      );
    }
  });

  const filteredJobs = userJobs.filter(job => {
    if (statusFilter === 'active') {
      return job.status === 'open' || job.status === 'accepted' || job.status === 'in_progress';
    }
    if (statusFilter === 'completed') {
      return job.status === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cde4dd] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#162a45]">
            {isClient ? 'Meus Pedidos de Limpeza' : 'Minha Agenda & Propostas'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isClient
              ? 'Acompanhe suas solicitações, propostas recebidas e serviços agendados'
              : 'Gerencie os serviços aceitos, propostas enviadas e histórico de ganhos'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-[#f0faf7] p-1 rounded-xl border border-[#cdebe3]">
          {(['all', 'active', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === filter
                  ? 'bg-white text-[#0f766e] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {filter === 'all' && 'Todos'}
              {filter === 'active' && 'Em Andamento'}
              {filter === 'completed' && 'Concluídos'}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#e2ece9] shadow-xs">
          <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-base">Nenhum serviço encontrado</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {isClient
              ? 'Você ainda não possui pedidos nesta categoria. Solicite um novo serviço agora!'
              : 'Você ainda não demonstrou interesse em pedidos nesta categoria.'}
          </p>

          {isClient && (
            <button
              onClick={() => setShowCreateJobModal(true)}
              className="mt-4 px-4 py-2 bg-[#0f9286] text-white text-xs font-bold rounded-xl hover:bg-[#0c7c72] transition"
            >
              Solicitar Limpeza
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const acceptedCleaner = cleaners.find(c => c.id === job.acceptedCleanerId);

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cde4dd] shadow-xs hover:border-[#0f9286] transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        job.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : job.status === 'accepted'
                          ? 'bg-[#e2f5f1] text-[#0f766e]'
                          : job.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {job.status === 'open' && 'Aguardando Propostas'}
                        {job.status === 'accepted' && 'Profissional Confirmado'}
                        {job.status === 'in_progress' && 'Em Andamento'}
                        {job.status === 'completed' && 'Concluído'}
                      </span>
                      <span className="text-xs text-gray-400">{job.createdAt}</span>
                    </div>

                    <h3 className="font-bold text-base text-[#162a45]">{job.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1 font-medium text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-[#0f9286]" />
                        {job.address.neighborhood}, {job.address.city}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#0f9286]" />
                        {job.scheduledDate}
                      </span>
                      <span>•</span>
                      <span>
                        {job.rooms.bedrooms}q, {job.rooms.bathrooms}b
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="sm:text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Valor acordado</span>
                    <p className="text-xl font-black text-[#0f766e]">
                      R$ {job.finalPrice || job.proposedPrice}
                    </p>
                  </div>
                </div>

                {/* Counterparty & Actions Row */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {isClient ? (
                      acceptedCleaner ? (
                        <div className="flex items-center gap-2.5">
                          <img
                            src={acceptedCleaner.avatar}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200"
                          />
                          <div>
                            <span className="text-[11px] text-gray-400">Profissional contratada:</span>
                            <p className="text-xs font-bold text-[#162a45]">{acceptedCleaner.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 font-medium">
                          {job.proposals.length} proposta(s) recebida(s) de profissionais
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <img
                          src={job.clientAvatar}
                          alt=""
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200"
                        />
                        <div>
                          <span className="text-[11px] text-gray-400">Cliente solicitante:</span>
                          <p className="text-xs font-bold text-[#162a45]">{job.clientName}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveChatJobId(job.id);
                        setActiveTab('chat');
                      }}
                      className="px-3 py-2 rounded-xl border border-[#cde4dd] text-[#0f766e] hover:bg-[#eaf7f4] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    {job.status === 'accepted' && (
                      <button
                        onClick={() => updateJobStatus(job.id, 'in_progress')}
                        className="px-3.5 py-2 rounded-xl bg-[#0f9286] text-white text-xs font-bold hover:bg-[#0c7c72] transition"
                      >
                        Iniciar Faxina
                      </button>
                    )}

                    {job.status === 'in_progress' && (
                      <button
                        onClick={() => {
                          updateJobStatus(job.id, 'completed');
                          if (isClient) {
                            setReviewModalData({
                              jobId: job.id,
                              toUserId: acceptedCleaner?.id || cleaners[0].id,
                              toUserName: acceptedCleaner?.name || cleaners[0].name,
                              toUserAvatar: acceptedCleaner?.avatar || cleaners[0].avatar,
                              targetRole: 'cleaner'
                            });
                          } else {
                            setReviewModalData({
                              jobId: job.id,
                              toUserId: clientUser.id,
                              toUserName: clientUser.name,
                              toUserAvatar: clientUser.avatar,
                              targetRole: 'client'
                            });
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                      >
                        Finalizar & Avaliar
                      </button>
                    )}

                    {job.status === 'completed' && !job.clientReview && isClient && (
                      <button
                        onClick={() => {
                          setReviewModalData({
                            jobId: job.id,
                            toUserId: acceptedCleaner?.id || cleaners[0].id,
                            toUserName: acceptedCleaner?.name || cleaners[0].name,
                            toUserAvatar: acceptedCleaner?.avatar || cleaners[0].avatar,
                            targetRole: 'cleaner'
                          });
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Avaliar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
