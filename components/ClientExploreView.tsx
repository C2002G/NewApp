import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CleaningJob, JobProposal } from '../types';
import { 
  Plus, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight,
  SlidersHorizontal,
  Home,
  Award,
  DollarSign,
  UserCheck
} from 'lucide-react';

export const ClientExploreView: React.FC = () => {
  const { 
    clientUser, 
    jobs, 
    cleaners, 
    setShowCreateJobModal, 
    acceptProposal, 
    setActiveChatJobId, 
    setActiveTab, 
    setSelectedJobForDetail,
    setReviewModalData,
    updateJobStatus
  } = useMarketplace();

  const [filterType, setFilterType] = useState<string>('todos');

  // Filter client's jobs
  const clientJobs = jobs.filter(j => j.clientId === clientUser.id);
  const activeJob = clientJobs.find(j => j.status === 'open' || j.status === 'accepted' || j.status === 'in_progress');
  const completedJobs = clientJobs.filter(j => j.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Hero Banner for Client */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#0f9286] via-[#11998e] to-[#0c7c72] text-white p-6 sm:p-8 shadow-lg shadow-[#0f9286]/15">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#a8ffeb]" />
            <span>Marketplace estilo inDrive</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            Sua casa impecável, com o preço que você propõe.
          </h1>

          <p className="text-sm text-white/85 mt-2 leading-relaxed">
            Publique as características do imóvel, ofereça um valor e receba propostas imediatas de profissionais verificados perto de você.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateJobModal(true)}
              id="btn-solicitar-hero"
              className="py-3 px-5 rounded-xl bg-white text-[#0f766e] font-bold text-sm shadow-md hover:bg-[#eaf7f4] active:scale-95 transition cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Solicitar serviço de limpeza</span>
            </button>
            <div className="text-xs text-white/80 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#a8ffeb]" />
              <span>Profissionais 100% com antecedentes verificados</span>
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Active Requests & In-flight proposals */}
      {activeJob && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cde5de] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  activeJob.status === 'open' 
                    ? 'bg-amber-100 text-amber-800' 
                    : activeJob.status === 'accepted'
                    ? 'bg-[#e2f5f1] text-[#0f766e]'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeJob.status === 'open' && '• Aguardando Propostas'}
                  {activeJob.status === 'accepted' && '✓ Profissional Contratado'}
                  {activeJob.status === 'in_progress' && '🧹 Limpeza em Andamento'}
                </span>
                <span className="text-xs text-gray-400">{activeJob.createdAt}</span>
              </div>
              <h2 className="text-lg font-bold text-[#162a45] mt-1">{activeJob.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {activeJob.address.neighborhood}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {activeJob.scheduledDate}
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#0f766e]">
                  <DollarSign className="w-3.5 h-3.5" />
                  Sua oferta: R$ {activeJob.proposedPrice}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChatJobId(activeJob.id);
                  setActiveTab('chat');
                }}
                className="px-3.5 py-2 rounded-xl border border-[#d2e6e1] text-[#0f766e] bg-[#f4faf8] hover:bg-[#eaf6f3] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Abrir Chat</span>
              </button>

              {activeJob.status === 'accepted' && (
                <button
                  onClick={() => updateJobStatus(activeJob.id, 'in_progress')}
                  className="px-3.5 py-2 rounded-xl bg-[#0f9286] text-white text-xs font-bold hover:bg-[#0c7c72] transition cursor-pointer"
                >
                  Iniciar Serviço
                </button>
              )}

              {activeJob.status === 'in_progress' && (
                <button
                  onClick={() => {
                    updateJobStatus(activeJob.id, 'completed');
                    const acceptedCleaner = cleaners.find(c => c.id === activeJob.acceptedCleanerId) || cleaners[0];
                    setReviewModalData({
                      jobId: activeJob.id,
                      toUserId: acceptedCleaner.id,
                      toUserName: acceptedCleaner.name,
                      toUserAvatar: acceptedCleaner.avatar,
                      targetRole: 'cleaner'
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                >
                  Concluir & Avaliar
                </button>
              )}
            </div>
          </div>

          {/* Proposals List for Open Job */}
          {activeJob.status === 'open' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Propostas Recebidas ({activeJob.proposals.length})
                </p>
                <span className="text-xs text-emerald-600 font-medium animate-pulse">
                  ● Atualizando em tempo real
                </span>
              </div>

              {activeJob.proposals.length === 0 ? (
                <div className="bg-[#f8faf9] p-6 rounded-2xl text-center border border-dashed border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-[#e2f5f1] text-[#0f766e] flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Seu pedido foi enviado aos profissionais locais!</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Profissionais em {activeJob.address.neighborhood} estão analisando sua solicitação de R$ {activeJob.proposedPrice}. Em instantes as propostas aparecerão aqui.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeJob.proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-[#fafffd] rounded-2xl p-4 border border-[#cbe6df] shadow-xs flex flex-col justify-between hover:border-[#0f9286] transition"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={prop.cleanerAvatar}
                              alt={prop.cleanerName}
                              className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#0f9286]/20"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-sm text-[#162a45]">{prop.cleanerName}</h4>
                                <ShieldCheck className="w-4 h-4 text-[#0f9286]" />
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                                <span className="flex items-center text-amber-600 font-bold gap-0.5">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {prop.cleanerRating}
                                </span>
                                <span>•</span>
                                <span>{prop.cleanerReviewCount} avaliações</span>
                                <span>•</span>
                                <span>{prop.cleanerDistanceKm} km</span>
                              </div>
                            </div>
                          </div>

                          {/* Price Tag */}
                          <div className="text-right">
                            <div className="text-base font-extrabold text-[#0f766e]">
                              R$ {prop.price}
                            </div>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              prop.isCounterOffer 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-[#d6f2eb] text-[#0f766e]'
                            }`}>
                              {prop.isCounterOffer ? 'Contraproposta' : 'Aceitou seu valor'}
                            </span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {prop.cleanerBadges.map((badge, bIdx) => (
                            <span key={bIdx} className="text-[10px] bg-white border border-[#d2ece5] text-[#162a45] px-2 py-0.5 rounded-md font-medium">
                              {badge}
                            </span>
                          ))}
                          {prop.includesSupplies && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                              + Leva produtos
                            </span>
                          )}
                        </div>

                        {/* Note */}
                        <p className="text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-gray-100 mb-3 italic">
                          "{prop.note}"
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setActiveChatJobId(activeJob.id);
                            setActiveTab('chat');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl border border-[#cce4dd] text-[#0f766e] text-xs font-bold hover:bg-[#eaf5f2] transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Negociar / Chat</span>
                        </button>

                        <button
                          onClick={() => acceptProposal(activeJob.id, prop.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Aceitar R$ {prop.price}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* When Accepted */}
          {activeJob.status === 'accepted' && (
            <div className="bg-[#eef9f6] p-4 rounded-2xl border border-[#cce8e0] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0f9286] text-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#162a45]">Profissional Confirmada</h4>
                  <p className="text-xs text-gray-600">
                    O profissional chegará em {activeJob.scheduledDate}. Valor fechado em R$ {activeJob.finalPrice || activeJob.proposedPrice}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveChatJobId(activeJob.id);
                  setActiveTab('chat');
                }}
                className="py-2 px-3.5 rounded-xl bg-white border border-[#bfe2d8] text-[#0f766e] font-bold text-xs hover:bg-[#eaf6f3] transition cursor-pointer"
              >
                Ver no Chat
              </button>
            </div>
          )}
        </section>
      )}

      {/* Featured Professionals Directory (Autonomia e Reputação) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#162a45]">Profissionais Verificados na sua Região</h2>
            <p className="text-xs text-gray-500">Compare avaliações, experiências e especialidades</p>
          </div>
          <span className="text-xs bg-[#e2f5f1] text-[#0f766e] font-bold px-2.5 py-1 rounded-lg">
            {cleaners.length} disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cleaners.map((cleaner) => (
            <div
              key={cleaner.id}
              className="bg-white rounded-3xl p-5 border border-[#e2ece9] shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={cleaner.avatar}
                      alt={cleaner.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#0f9286]/20 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-[#162a45]">{cleaner.name}</h3>
                        {cleaner.verified && (
                          <span title="Documentos e antecedentes verificados">
                            <ShieldCheck className="w-4 h-4 text-[#0f9286]" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                        <span className="flex items-center text-amber-600 font-bold gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {cleaner.rating}
                        </span>
                        <span>•</span>
                        <span>{cleaner.reviewCount} avaliações</span>
                        <span>•</span>
                        <span>{cleaner.completedJobsCount} faxinas</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {cleaner.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Preço médio</span>
                    <p className="text-sm font-bold text-[#0f766e]">
                      ~R$ {cleaner.hourlyRateHint ? cleaner.hourlyRateHint * 4 : 160}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                  {cleaner.bio}
                </p>

                {/* Badges & Specialties */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cleaner.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#eef8f5] text-[#0f766e] border border-[#d2ece4]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-500">Membro desde {cleaner.memberSince}</span>
                <button
                  onClick={() => setShowCreateJobModal(true)}
                  className="py-2 px-3.5 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Solicitar Serviço</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed Services & Mutual Reviews */}
      {completedJobs.length > 0 && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2ece9] shadow-xs">
          <h3 className="text-base font-bold text-[#162a45] mb-3">Histórico de Serviços & Reputação</h3>
          <div className="space-y-3">
            {completedJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">{job.title}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Concluído
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0f766e]">R$ {job.finalPrice || job.proposedPrice}</span>
                </div>

                {job.clientReview && (
                  <div className="bg-white p-3 rounded-xl border border-gray-100 mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-gray-700">Sua avaliação para o prestador:</span>
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        {job.clientReview.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{job.clientReview.comment}"</p>
                  </div>
                )}

                {job.cleanerReview && (
                  <div className="bg-[#f0faf7] p-3 rounded-xl border border-[#cdebe3] mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#0f766e]">Avaliação recebida do profissional:</span>
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                        {job.cleanerReview.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 italic">"{job.cleanerReview.comment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
