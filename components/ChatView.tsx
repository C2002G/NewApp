import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ChatMessage, CleaningJob } from '../types';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  ArrowLeft, 
  MessageCircle, 
  Clock,
  Check,
  ChevronRight,
  Plus
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { 
    currentRole, 
    activeUser, 
    jobs, 
    messages, 
    sendMessage, 
    activeChatJobId, 
    setActiveChatJobId, 
    acceptProposal,
    cleaners,
    clientUser
  } = useMarketplace();

  const [inputText, setInputText] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerValue, setOfferValue] = useState(170);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by job
  const relevantJobs = jobs.filter(j => 
    messages.some(m => m.jobId === j.id) ||
    j.clientId === clientUser.id ||
    j.acceptedCleanerId === activeUser.id ||
    j.proposals.some(p => p.cleanerId === activeUser.id)
  );

  const selectedJob = relevantJobs.find(j => j.id === activeChatJobId) || relevantJobs[0];

  useEffect(() => {
    if (!activeChatJobId && relevantJobs.length > 0) {
      setActiveChatJobId(relevantJobs[0].id);
    }
  }, [activeChatJobId, relevantJobs, setActiveChatJobId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedJob]);

  // Current counter-party profile
  const isClient = currentRole === 'client';
  const otherPartyName = isClient
    ? selectedJob?.acceptedCleanerId
      ? cleaners.find(c => c.id === selectedJob.acceptedCleanerId)?.name || 'Dona Rosa Oliveira'
      : selectedJob?.proposals[0]?.cleanerName || 'Profissional'
    : selectedJob?.clientName || 'Mariana Souza';

  const otherPartyAvatar = isClient
    ? selectedJob?.acceptedCleanerId
      ? cleaners.find(c => c.id === selectedJob.acceptedCleanerId)?.avatar || cleaners[0].avatar
      : selectedJob?.proposals[0]?.cleanerAvatar || cleaners[0].avatar
    : selectedJob?.clientAvatar || clientUser.avatar;

  const currentJobMessages = selectedJob 
    ? messages.filter(m => m.jobId === selectedJob.id) 
    : [];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedJob || !inputText.trim()) return;

    sendMessage(selectedJob.id, inputText);
    setInputText('');
  };

  const handleSendPriceOffer = () => {
    if (!selectedJob) return;
    sendMessage(
      selectedJob.id,
      `Proponho fechar em R$ ${offerValue},00. O que acha?`,
      offerValue
    );
    setShowOfferInput(false);
  };

  const quickReplies = isClient ? [
    'Você traz produtos próprios ou prefere usar os meus?',
    'A portaria já está autorizada para sua subida!',
    'Pode focar especialmente na cozinha e banheiros?',
    'Muito obrigada, excelente trabalho!',
  ] : [
    'Levo meus panos de microfibra limpos e produtos!',
    'Já estou a caminho do endereço!',
    'Cheguei no local!',
    'Serviço finalizado! Ficou tudo brilhando ✨',
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#cde4dd] shadow-sm overflow-hidden flex flex-col md:flex-row h-[75vh] min-h-[550px]">
      {/* Sidebar: Conversation List */}
      <div className={`w-full md:w-80 border-r border-[#e2ece9] flex flex-col bg-[#f8faf9] ${
        activeChatJobId ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-[#e2ece9] bg-white">
          <h2 className="text-base font-bold text-[#162a45]">Mensagens & Negociações</h2>
          <p className="text-xs text-gray-500">Comunicação direta em tempo real</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {relevantJobs.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              Nenhuma conversa ativa no momento.
            </div>
          ) : (
            relevantJobs.map((job) => {
              const lastMsg = [...messages].reverse().find(m => m.jobId === job.id);
              const isSelected = selectedJob?.id === job.id;

              return (
                <button
                  key={job.id}
                  onClick={() => setActiveChatJobId(job.id)}
                  className={`w-full p-4 text-left transition cursor-pointer flex items-start gap-3 ${
                    isSelected ? 'bg-[#eaf6f3] border-l-4 border-[#0f9286]' : 'hover:bg-white'
                  }`}
                >
                  <img
                    src={isClient ? (job.proposals[0]?.cleanerAvatar || cleaners[0].avatar) : job.clientAvatar}
                    alt=""
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-[#162a45] truncate">
                        {isClient ? (job.proposals[0]?.cleanerName || 'Profissional') : job.clientName}
                      </h4>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {lastMsg ? lastMsg.timestamp : 'Novo'}
                      </span>
                    </div>
                    <p className="text-xs text-[#0f766e] font-semibold truncate mt-0.5">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'Conversa iniciada'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className={`flex-1 flex flex-col bg-white ${
        !activeChatJobId ? 'hidden md:flex' : 'flex'
      }`}>
        {selectedJob ? (
          <>
            {/* Top Bar with Counterparty Details */}
            <div className="p-3.5 sm:p-4 border-b border-[#e2ece9] flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatJobId(null)}
                  className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <img
                  src={otherPartyAvatar}
                  alt={otherPartyName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#0f9286]/30"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-[#162a45]">{otherPartyName}</h3>
                    <ShieldCheck className="w-4 h-4 text-[#0f9286]" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {selectedJob.title} • <span className="font-semibold text-[#0f766e]">R$ {selectedJob.finalPrice || selectedJob.proposedPrice}</span>
                  </p>
                </div>
              </div>

              {/* Status pill & direct action */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#e2f5f1] text-[#0f766e]">
                  {selectedJob.status === 'open' && 'Negociando Propostas'}
                  {selectedJob.status === 'accepted' && 'Confirmado'}
                  {selectedJob.status === 'in_progress' && 'Em Andamento'}
                  {selectedJob.status === 'completed' && 'Concluído'}
                </span>
              </div>
            </div>

            {/* InDrive Job Mini Summary Banner inside Chat */}
            <div className="bg-[#f0faf7] px-4 py-2 border-b border-[#d8ebe5] flex items-center justify-between text-xs text-[#162a45]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0f766e]" />
                  {selectedJob.scheduledDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0f766e]" />
                  {selectedJob.address.neighborhood}
                </span>
              </div>
              <button
                onClick={() => setShowOfferInput(!showOfferInput)}
                className="font-bold text-[#0f766e] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Negociar Valor
              </button>
            </div>

            {/* Counter-offer drawer inside chat */}
            {showOfferInput && (
              <div className="bg-white p-3 border-b border-[#cde5df] shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
                <span className="text-xs font-bold text-gray-700">Enviar nova proposta de valor:</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">R$</span>
                    <input
                      type="number"
                      value={offerValue}
                      onChange={(e) => setOfferValue(Number(e.target.value))}
                      className="w-24 text-center font-bold text-sm bg-gray-50 border border-gray-200 rounded-lg py-1 px-3 pl-6"
                    />
                  </div>
                  <button
                    onClick={handleSendPriceOffer}
                    className="px-3 py-1 bg-[#0f9286] text-white text-xs font-bold rounded-lg hover:bg-[#0c7c72]"
                  >
                    Enviar Oferta
                  </button>
                  <button
                    onClick={() => setShowOfferInput(false)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Chat Message History */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbfdfc]">
              <div className="text-center my-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-full font-semibold">
                  Início da conversa segura • Limpaépi
                </span>
              </div>

              {currentJobMessages.map((msg) => {
                const isMe = msg.senderId === activeUser.id;
                const isSystem = msg.senderId === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-3">
                      <span className="inline-block text-xs bg-[#e2f5f1] text-[#0f766e] font-semibold px-3 py-1 rounded-full border border-[#c6eae0]">
                        {msg.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={msg.senderAvatar || otherPartyAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                      />
                    )}

                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#0f9286] text-white rounded-br-xs'
                          : 'bg-white border border-[#e2ece9] text-[#162a45] rounded-bl-xs'
                      }`}
                    >
                      {/* Price Proposal Card inside Chat */}
                      {msg.isPriceOffer && (
                        <div className={`p-2.5 rounded-xl mb-1.5 flex items-center justify-between gap-3 ${
                          isMe ? 'bg-white/20 text-white' : 'bg-[#eaf6f3] text-[#0f766e]'
                        }`}>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider">Oferta de valor:</span>
                            <div className="text-base font-black">R$ {msg.offerPrice || selectedJob.proposedPrice}</div>
                          </div>
                          {!isMe && selectedJob.status === 'open' && isClient && (
                            <button
                              onClick={() => {
                                const prop = selectedJob.proposals[0];
                                if (prop) acceptProposal(selectedJob.id, prop.id);
                              }}
                              className="px-2.5 py-1 bg-[#0f9286] hover:bg-[#0c7c72] text-white text-[11px] font-bold rounded-lg shadow-xs cursor-pointer"
                            >
                              Aceitar
                            </button>
                          )}
                        </div>
                      )}

                      <p>{msg.text}</p>

                      <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                        isMe ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <Check className="w-3 h-3 stroke-[2.5]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-gray-400 shrink-0 uppercase tracking-wider">Sugestões:</span>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(selectedJob.id, reply)}
                  className="shrink-0 text-xs bg-[#f2faf7] hover:bg-[#e4f5f0] text-[#0f766e] border border-[#d2ebe4] px-2.5 py-1 rounded-full font-medium transition cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-[#e2ece9] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite sua mensagem para negociar ou alinhar detalhes..."
                className="flex-1 bg-[#f4f7f6] border border-gray-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#0f9286] focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-2xl bg-[#0f9286] hover:bg-[#0c7c72] disabled:opacity-40 text-white flex items-center justify-center transition cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-bold text-gray-600">Nenhuma conversa selecionada</p>
            <p className="text-xs text-gray-400 mt-1">Selecione uma solicitação ao lado para abrir a conversa.</p>
          </div>
        )}
      </div>
    </div>
  );
};
