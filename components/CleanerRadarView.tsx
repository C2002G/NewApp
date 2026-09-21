import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CleaningJob } from '../types';
import { 
  Radar, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Send, 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  Dog, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

export const CleanerRadarView: React.FC = () => {
  const { 
    activeUser, 
    cleaners, 
    activeCleanerId, 
    setActiveCleanerId, 
    jobs, 
    submitProposal, 
    setActiveChatJobId, 
    setActiveTab, 
    updateJobStatus,
    setReviewModalData,
    clientUser
  } = useMarketplace();

  const [counterOfferModalJob, setCounterOfferModalJob] = useState<CleaningJob | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(180);
  const [counterNote, setCounterNote] = useState<string>('');
  const [includesSupplies, setIncludesSupplies] = useState<boolean>(true);
  const [filterRadius, setFilterRadius] = useState<number>(5);

  // Available open jobs
  const openJobs = jobs.filter(j => j.status === 'open');

  // Jobs where this cleaner has an active engagement
  const myAssignedJobs = jobs.filter(j => 
    (j.acceptedCleanerId === activeUser.id || j.proposals.some(p => p.cleanerId === activeUser.id && p.status === 'accepted')) &&
    (j.status === 'accepted' || j.status === 'in_progress')
  );

  const myCompletedJobs = jobs.filter(j => 
    j.acceptedCleanerId === activeUser.id && j.status === 'completed'
  );

  const handleOpenCounterOffer = (job: CleaningJob) => {
    setCounterOfferModalJob(job);
    setCounterPrice(job.proposedPrice + 15);
    setCounterNote(`Olá ${job.clientName.split(' ')[0]}! Faço por R$ ${job.proposedPrice + 15} levando produtos de limpeza ecológicos e microfibras.`);
  };

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterOfferModalJob) return;

    submitProposal(
      counterOfferModalJob.id,
      Number(counterPrice),
      counterNote,
      includesSupplies
    );

    setCounterOfferModalJob(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Professional Header & Profile Switcher */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cce4dd] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-3 ring-[#0f9286]/30 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#162a45]">{activeUser.name}</h2>
                <span className="text-xs bg-[#e2f5f1] text-[#0f766e] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verificada
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{activeUser.bio}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2 font-medium">
                <span className="flex items-center text-amber-500 font-bold gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {activeUser.rating}
                </span>
                <span>•</span>
                <span>{activeUser.reviewCount} avaliações</span>
                <span>•</span>
                <span>{activeUser.completedJobsCount} faxinas realizadas</span>
                <span>•</span>
                <span className="text-[#0f766e] font-semibold">100% Autonomia</span>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher for testing the MVP */}
          <div className="bg-[#f0faf7] p-3 rounded-2xl border border-[#cde8e1] flex flex-col justify-center">
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Simular outro profissional:
            </label>
            <select
              value={activeCleanerId}
              onChange={(e) => setActiveCleanerId(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#c5e4dc] rounded-xl px-3 py-2 text-[#162a45] focus:outline-none focus:border-[#0f9286] cursor-pointer"
            >
              {cleaners.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.rating} ★ - {c.specialties[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Jobs in Progress / Accepted */}
      {myAssignedJobs.length > 0 && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cce4dd] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-[#162a45]">Serviços Confirmados na sua Agenda</h3>
              <p className="text-xs text-gray-500">Acompanhe e confirme o andamento das suas faxinas</p>
            </div>
            <span className="text-xs bg-[#e2f5f1] text-[#0f766e] font-bold px-2.5 py-1 rounded-full">
              {myAssignedJobs.length} agendado(s)
            </span>
          </div>

          <div className="space-y-3">
            {myAssignedJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-2xl bg-[#f5fbf9] border border-[#d2ebe4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e]">
                      {job.scheduledDate}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs font-medium text-gray-600">{job.address.neighborhood}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#162a45]">{job.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Cliente: {job.clientName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Seu ganho</span>
                    <p className="text-base font-black text-[#0f766e]">R$ {job.finalPrice || job.proposedPrice}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveChatJobId(job.id);
                      setActiveTab('chat');
                    }}
                    className="p-2.5 rounded-xl bg-white border border-[#cde5df] text-[#0f766e] hover:bg-[#eaf7f4] transition cursor-pointer"
                    title="Conversar com o cliente"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {job.status === 'accepted' ? (
                    <button
                      onClick={() => updateJobStatus(job.id, 'in_progress')}
                      className="px-4 py-2 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      Iniciar Faxina
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        updateJobStatus(job.id, 'completed');
                        setReviewModalData({
                          jobId: job.id,
                          toUserId: clientUser.id,
                          toUserName: clientUser.name,
                          toUserAvatar: clientUser.avatar,
                          targetRole: 'client'
                        });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      Finalizar & Avaliar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Radar de Oportunidades (inDrive Style) */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cce4dd] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e2f5f1] text-[#0f766e] flex items-center justify-center">
              <Radar className="w-5 h-5 animate-spin duration-3000" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#162a45]">Radar de Oportunidades</h3>
              <p className="text-xs text-gray-500">Pedidos abertos por clientes esperando propostas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Raio:</span>
            {[3, 5, 10].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRadius(r)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  filterRadius === r
                    ? 'bg-[#0f9286] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {openJobs.length === 0 ? (
          <div className="p-8 text-center bg-[#f8faf9] rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm font-bold text-gray-700">Nenhum pedido aberto no momento.</p>
            <p className="text-xs text-gray-500 mt-1">
              Alterne para o perfil de cliente e clique em "Solicitar serviço" para ver novas oportunidades surgirem no radar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {openJobs.map((job) => {
              const alreadyProposed = job.proposals.some(p => p.cleanerId === activeUser.id);
              const myExistingProposal = job.proposals.find(p => p.cleanerId === activeUser.id);

              return (
                <div
                  key={job.id}
                  className="bg-[#fafffd] rounded-2xl p-5 border border-[#cbe6df] hover:border-[#0f9286] shadow-xs transition flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={job.clientAvatar}
                        alt={job.clientName}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-gray-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#162a45]">{job.title}</h4>
                          <span className="text-xs text-gray-400">• {job.createdAt}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-600 mt-1">
                          <span className="font-medium text-gray-700">{job.clientName}</span>
                          <span className="flex items-center text-amber-500 font-bold gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {job.clientRating}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-[#0f766e]">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.address.neighborhood} (~{job.address.distanceKm || 2.1} km)
                          </span>
                        </div>

                        {/* Imóvel tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-md font-medium text-gray-700">
                            {job.rooms.bedrooms} quartos • {job.rooms.bathrooms} banheiros
                          </span>
                          <span className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded-md font-medium text-gray-700 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {job.scheduledDate} ({job.timeSlot === 'manha' ? 'Manhã' : job.timeSlot === 'tarde' ? 'Tarde' : 'Dia todo'})
                          </span>
                          {job.rooms.hasPets && (
                            <span className="text-[11px] bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                              <Dog className="w-3 h-3" />
                              Tem pet
                            </span>
                          )}
                          {job.bringSupplies && (
                            <span className="text-[11px] bg-[#e2f5f1] border border-[#bfe7df] text-[#0f766e] px-2 py-0.5 rounded-md font-medium">
                              Levar produtos
                            </span>
                          )}
                        </div>

                        {job.description && (
                          <p className="text-xs text-gray-600 mt-2 italic bg-white p-2 rounded-xl border border-gray-100">
                            "{job.description}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price Offer Card inDrive style */}
                    <div className="bg-[#f0faf7] p-3.5 rounded-2xl border border-[#c7e9e1] text-right sm:min-w-[170px] flex flex-col justify-center">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        Oferta do Cliente
                      </span>
                      <div className="text-2xl font-black text-[#0f766e]">
                        R$ {job.proposedPrice}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {job.proposals.length} proposta(s) já enviadas
                      </span>
                    </div>
                  </div>

                  {/* Cleaner inDrive actions */}
                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    {alreadyProposed ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0f766e] bg-[#eaf6f3] px-3 py-1.5 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-[#0f9286]" />
                        <span>Sua proposta de R$ {myExistingProposal?.price} já foi enviada!</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">
                        Você decide: aceite o valor ou contraproponha!
                      </span>
                    )}

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setActiveChatJobId(job.id);
                          setActiveTab('chat');
                        }}
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition cursor-pointer"
                        title="Tirar dúvidas no chat"
                      >
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                      </button>

                      <button
                        onClick={() => handleOpenCounterOffer(job)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-[#0f9286] text-[#0f766e] hover:bg-[#eaf7f4] text-xs font-bold transition cursor-pointer"
                      >
                        Contrapropor Valor
                      </button>

                      <button
                        onClick={() => submitProposal(job.id, job.proposedPrice, 'Aceito o valor proposto pelo cliente!', false)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Aceitar R$ {job.proposedPrice}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Contraproposta Modal (inDrive Style) */}
      {counterOfferModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1d30]/65 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#cbe6df]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e] bg-[#e2f5f1] px-2 py-0.5 rounded">
                  inDrive Limpeza
                </span>
                <h3 className="font-bold text-base text-[#162a45]">Fazer Contraproposta</h3>
              </div>
              <button
                onClick={() => setCounterOfferModalJob(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Cliente <strong>{counterOfferModalJob.clientName}</strong> ofereceu <strong>R$ {counterOfferModalJob.proposedPrice}</strong>. 
              Qual valor você deseja propor?
            </p>

            <form onSubmit={handleSendCounterOffer} className="space-y-4">
              <div className="bg-[#f0faf7] p-4 rounded-2xl border border-[#cbebe3] text-center">
                <span className="text-xs text-gray-500 font-medium">Seu valor sugerido</span>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setCounterPrice(Math.max(80, counterPrice - 10))}
                    className="w-9 h-9 rounded-xl bg-white border border-[#c5e4dc] font-bold text-gray-700"
                  >
                    -10
                  </button>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">R$</span>
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(Number(e.target.value))}
                      className="w-32 text-center text-2xl font-black text-[#0f766e] bg-white border-2 border-[#0f9286] rounded-xl py-1.5 px-4 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCounterPrice(counterPrice + 10)}
                    className="w-9 h-9 rounded-xl bg-white border border-[#c5e4dc] font-bold text-gray-700"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Justificativa / Diferencial (opcional)
                </label>
                <textarea
                  rows={2}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="Ex: Levo produtos biodegradáveis, aspirador de pó e chego no horário combinado..."
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0f9286]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="suppliesCheck"
                  checked={includesSupplies}
                  onChange={(e) => setIncludesSupplies(e.target.checked)}
                  className="rounded text-[#0f9286] focus:ring-[#0f9286]"
                />
                <label htmlFor="suppliesCheck" className="text-xs text-gray-700 font-medium">
                  Inclui meus produtos e materiais próprios de limpeza
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Proposta de R$ {counterPrice}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
