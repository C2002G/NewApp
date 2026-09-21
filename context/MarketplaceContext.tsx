import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, UserProfile, CleaningJob, ChatMessage, JobProposal, Review } from '../types';
import { INITIAL_CLIENT, INITIAL_CLEANERS, INITIAL_JOBS, INITIAL_MESSAGES } from '../data/mockData';

interface MarketplaceContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeUser: UserProfile;
  clientUser: UserProfile;
  cleaners: UserProfile[];
  activeCleanerId: string;
  setActiveCleanerId: (id: string) => void;
  jobs: CleaningJob[];
  messages: ChatMessage[];
  activeChatJobId: string | null;
  setActiveChatJobId: (id: string | null) => void;
  activeTab: 'explore' | 'my_jobs' | 'chat' | 'profile';
  setActiveTab: (tab: 'explore' | 'my_jobs' | 'chat' | 'profile') => void;
  showCreateJobModal: boolean;
  setShowCreateJobModal: (show: boolean) => void;
  showPresentationModal: boolean;
  setShowPresentationModal: (show: boolean) => void;
  reviewModalData: {
    jobId: string;
    toUserId: string;
    toUserName: string;
    toUserAvatar: string;
    targetRole: UserRole;
  } | null;
  setReviewModalData: (data: any) => void;
  selectedJobForDetail: CleaningJob | null;
  setSelectedJobForDetail: (job: CleaningJob | null) => void;
  
  // Actions
  createJob: (jobData: Partial<CleaningJob>) => string;
  submitProposal: (jobId: string, price: number, note: string, includesSupplies: boolean) => void;
  acceptProposal: (jobId: string, proposalId: string) => void;
  updateJobStatus: (jobId: string, status: CleaningJob['status']) => void;
  sendMessage: (jobId: string, text: string, offerPrice?: number) => void;
  submitReview: (jobId: string, toUserId: string, rating: number, tags: string[], comment: string) => void;
  resetData: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const STORAGE_KEY_JOBS = 'limpaepi_jobs_v1';
const STORAGE_KEY_MSGS = 'limpaepi_msgs_v1';
const STORAGE_KEY_ROLE = 'limpaepi_role_v1';
const STORAGE_KEY_CLEANER = 'limpaepi_cleaner_id_v1';
const STORAGE_KEY_CLIENT = 'limpaepi_client_v1';
const STORAGE_KEY_CLEANERS_LIST = 'limpaepi_cleaners_list_v1';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROLE);
    return saved === 'cleaner' ? 'cleaner' : 'client';
  });

  const [clientUser, setClientUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLIENT);
    return saved ? JSON.parse(saved) : INITIAL_CLIENT;
  });

  const [cleaners, setCleaners] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLEANERS_LIST);
    return saved ? JSON.parse(saved) : INITIAL_CLEANERS;
  });

  const [activeCleanerId, setActiveCleanerIdState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLEANER);
    return saved || 'cleaner_rosa';
  });

  const [jobs, setJobs] = useState<CleaningJob[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MSGS);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeChatJobId, setActiveChatJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'explore' | 'my_jobs' | 'chat' | 'profile'>('explore');
  const [showCreateJobModal, setShowCreateJobModal] = useState<boolean>(false);
  const [showPresentationModal, setShowPresentationModal] = useState<boolean>(false);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<CleaningJob | null>(null);
  const [reviewModalData, setReviewModalData] = useState<{
    jobId: string;
    toUserId: string;
    toUserName: string;
    toUserAvatar: string;
    targetRole: UserRole;
  } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLEANER, activeCleanerId);
  }, [activeCleanerId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLIENT, JSON.stringify(clientUser));
  }, [clientUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLEANERS_LIST, JSON.stringify(cleaners));
  }, [cleaners]);

  // Cross-tab broadcast channel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('limpaepi_broadcast');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC') {
          const savedJobs = localStorage.getItem(STORAGE_KEY_JOBS);
          const savedMsgs = localStorage.getItem(STORAGE_KEY_MSGS);
          if (savedJobs) setJobs(JSON.parse(savedJobs));
          if (savedMsgs) setMessages(JSON.parse(savedMsgs));
        }
      };
      return () => channel.close();
    }
  }, []);

  const broadcastSync = useCallback(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('limpaepi_broadcast');
        channel.postMessage({ type: 'SYNC' });
        channel.close();
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const activeCleaner = cleaners.find(c => c.id === activeCleanerId) || cleaners[0];
  const activeUser = currentRole === 'client' ? clientUser : activeCleaner;

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  const setActiveCleanerId = (id: string) => {
    setActiveCleanerIdState(id);
  };

  // Create Job (Client)
  const createJob = (jobData: Partial<CleaningJob>): string => {
    const newId = `job_${Date.now()}`;
    const newJob: CleaningJob = {
      id: newId,
      clientId: clientUser.id,
      clientName: clientUser.name,
      clientAvatar: clientUser.avatar,
      clientRating: clientUser.rating,
      clientReviewCount: clientUser.reviewCount,
      title: jobData.title || 'Solicitação de Faxina',
      serviceType: jobData.serviceType || 'padrao',
      propertyType: jobData.propertyType || 'apartamento',
      rooms: jobData.rooms || { bedrooms: 2, bathrooms: 1, livingRooms: 1, hasPets: false },
      address: jobData.address || { neighborhood: 'Botafogo', city: 'Rio de Janeiro', distanceKm: 1.5 },
      scheduledDate: jobData.scheduledDate || 'Amanhã',
      timeSlot: jobData.timeSlot || 'manha',
      description: jobData.description || '',
      bringSupplies: Boolean(jobData.bringSupplies),
      needsIroning: Boolean(jobData.needsIroning),
      needsWindowCleaning: Boolean(jobData.needsWindowCleaning),
      proposedPrice: jobData.proposedPrice || 160,
      status: 'open',
      createdAt: 'Agora mesmo',
      proposals: [],
    };

    setJobs(prev => [newJob, ...prev]);
    broadcastSync();

    // InDrive-style instant simulation: after 3 seconds, a professional nearby sends an interest proposal!
    setTimeout(() => {
      const cleanerCandidate = cleaners[0]; // Dona Rosa
      const autoProposal: JobProposal = {
        id: `prop_${Date.now()}`,
        jobId: newId,
        cleanerId: cleanerCandidate.id,
        cleanerName: cleanerCandidate.name,
        cleanerAvatar: cleanerCandidate.avatar,
        cleanerRating: cleanerCandidate.rating,
        cleanerReviewCount: cleanerCandidate.reviewCount,
        cleanerDistanceKm: 1.5,
        cleanerBadges: cleanerCandidate.badges.slice(0, 2),
        price: newJob.proposedPrice,
        isCounterOffer: false,
        note: `Olá ${clientUser.name.split(' ')[0]}! Estou disponível para o horário e aceito sua proposta de R$ ${newJob.proposedPrice}. Será um prazer atender!`,
        includesSupplies: newJob.bringSupplies,
        status: 'pending',
        createdAt: 'Agora mesmo',
      };

      setJobs(prevJobs => 
        prevJobs.map(j => {
          if (j.id === newId) {
            return {
              ...j,
              proposals: [...j.proposals, autoProposal]
            };
          }
          return j;
        })
      );

      // Add welcoming chat message
      const welcomeMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        jobId: newId,
        senderId: cleanerCandidate.id,
        senderName: cleanerCandidate.name,
        senderAvatar: cleanerCandidate.avatar,
        senderRole: 'cleaner',
        text: `Olá! Vi sua solicitação para ${newJob.scheduledDate} e aceitei sua oferta de R$ ${newJob.proposedPrice}. Se precisar de algo a mais, me avise por aqui!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, welcomeMsg]);
      broadcastSync();
    }, 2800);

    return newId;
  };

  // Submit Proposal (Cleaner)
  const submitProposal = (jobId: string, price: number, note: string, includesSupplies: boolean) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const isCounterOffer = price !== job.proposedPrice;
    const newProposal: JobProposal = {
      id: `prop_${Date.now()}`,
      jobId,
      cleanerId: activeCleaner.id,
      cleanerName: activeCleaner.name,
      cleanerAvatar: activeCleaner.avatar,
      cleanerRating: activeCleaner.rating,
      cleanerReviewCount: activeCleaner.reviewCount,
      cleanerDistanceKm: 2.2,
      cleanerBadges: activeCleaner.badges.slice(0, 2),
      price,
      isCounterOffer,
      note: note || (isCounterOffer ? `Proponho R$ ${price} para atender com máxima qualidade e dedicação.` : 'Aceito seu valor proposto!'),
      includesSupplies,
      status: 'pending',
      createdAt: 'Agora mesmo',
    };

    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        // filter out existing from this cleaner if any
        const filtered = j.proposals.filter(p => p.cleanerId !== activeCleaner.id);
        return {
          ...j,
          proposals: [newProposal, ...filtered]
        };
      }
      return j;
    }));

    // Send chat message with the proposal
    const chatMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      jobId,
      senderId: activeCleaner.id,
      senderName: activeCleaner.name,
      senderAvatar: activeCleaner.avatar,
      senderRole: 'cleaner',
      text: isCounterOffer 
        ? `Enviei uma contraproposta de R$ ${price}. ${note}`
        : `Demonstrei interesse no seu pedido por R$ ${price}. ${note}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPriceOffer: true,
      offerPrice: price,
    };

    setMessages(prev => [...prev, chatMsg]);
    broadcastSync();
  };

  // Accept Proposal (Client)
  const acceptProposal = (jobId: string, proposalId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    const proposal = job.proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'accepted',
          selectedProposalId: proposalId,
          acceptedCleanerId: proposal.cleanerId,
          finalPrice: proposal.price,
          proposals: j.proposals.map(p => ({
            ...p,
            status: p.id === proposalId ? 'accepted' : 'rejected'
          }))
        };
      }
      return j;
    }));

    // Add confirmation message in chat
    const confirmMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      jobId,
      senderId: clientUser.id,
      senderName: clientUser.name,
      senderAvatar: clientUser.avatar,
      senderRole: 'client',
      text: `🎉 Proposta aceita! O serviço está confirmado por R$ ${proposal.price}. Nos vemos no horário combinado!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, confirmMsg]);
    broadcastSync();
  };

  // Update status (e.g. in_progress, completed)
  const updateJobStatus = (jobId: string, status: CleaningJob['status']) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, status };
      }
      return j;
    }));

    const statusLabels: Record<string, string> = {
      'in_progress': '🧹 O profissional iniciou o serviço de limpeza no local!',
      'completed': '✨ Serviço de limpeza concluído com sucesso! Hora de avaliar e construir reputação.',
      'cancelled': '❌ O serviço foi cancelado.'
    };

    if (statusLabels[status]) {
      const statusMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        jobId,
        senderId: 'system',
        senderName: 'Sistema Limpaépi',
        senderAvatar: '',
        senderRole: currentRole,
        text: statusLabels[status],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, statusMsg]);
    }

    broadcastSync();
  };

  // Send Chat Message
  const sendMessage = (jobId: string, text: string, offerPrice?: number) => {
    if (!text.trim() && !offerPrice) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      jobId,
      senderId: activeUser.id,
      senderName: activeUser.name,
      senderAvatar: activeUser.avatar,
      senderRole: currentRole,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPriceOffer: Boolean(offerPrice),
      offerPrice,
    };

    setMessages(prev => [...prev, newMsg]);
    broadcastSync();

    // If sent by client to cleaner, provide a friendly simulated reply if not switched
    if (currentRole === 'client') {
      const job = jobs.find(j => j.id === jobId);
      const recipientCleaner = cleaners.find(c => c.id === (job?.acceptedCleanerId || job?.proposals[0]?.cleanerId));
      if (recipientCleaner && recipientCleaner.id !== activeCleanerId) {
        setTimeout(() => {
          const autoReplies = [
            'Combinado! Pode deixar comigo, cuidarei de tudo com muito carinho.',
            'Perfeito! Estarei aí no horário em ponto.',
            'Obrigada pela mensagem! Qualquer dúvida antes de chegar eu pergunto por aqui.',
            'Com certeza! Vou levar os panos limpos e caprichar.',
          ];
          const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
          const replyMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            jobId,
            senderId: recipientCleaner.id,
            senderName: recipientCleaner.name,
            senderAvatar: recipientCleaner.avatar,
            senderRole: 'cleaner',
            text: randomReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, replyMsg]);
          broadcastSync();
        }, 1800);
      }
    }
  };

  // Submit Review & Update Reputations
  const submitReview = (jobId: string, toUserId: string, rating: number, tags: string[], comment: string) => {
    const isClientReviewing = currentRole === 'client';
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      jobId,
      fromUserId: activeUser.id,
      fromUserName: activeUser.name,
      fromUserAvatar: activeUser.avatar,
      toUserId,
      rating,
      tags,
      comment,
      createdAt: 'Hoje',
    };

    // Update job record
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'completed',
          clientReview: isClientReviewing ? newReview : j.clientReview,
          cleanerReview: !isClientReviewing ? newReview : j.cleanerReview,
        };
      }
      return j;
    }));

    // Update target user's reputation score and review count
    if (isClientReviewing) {
      setCleaners(prev => prev.map(c => {
        if (c.id === toUserId) {
          const newCount = c.reviewCount + 1;
          const newRating = Number(((c.rating * c.reviewCount + rating) / newCount).toFixed(2));
          return {
            ...c,
            reviewCount: newCount,
            completedJobsCount: c.completedJobsCount + 1,
            rating: newRating,
          };
        }
        return c;
      }));
    } else {
      setClientUser(prev => {
        const newCount = prev.reviewCount + 1;
        const newRating = Number(((prev.rating * prev.reviewCount + rating) / newCount).toFixed(2));
        return {
          ...prev,
          reviewCount: newCount,
          completedJobsCount: prev.completedJobsCount + 1,
          rating: newRating,
        };
      });
    }

    setReviewModalData(null);
    broadcastSync();
  };

  const resetData = () => {
    setClientUser(INITIAL_CLIENT);
    setCleaners(INITIAL_CLEANERS);
    setJobs(INITIAL_JOBS);
    setMessages(INITIAL_MESSAGES);
    setCurrentRoleState('client');
    setActiveCleanerIdState('cleaner_rosa');
    setActiveChatJobId(null);
    localStorage.clear();
    broadcastSync();
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentRole,
        setRole,
        activeUser,
        clientUser,
        cleaners,
        activeCleanerId,
        setActiveCleanerId,
        jobs,
        messages,
        activeChatJobId,
        setActiveChatJobId,
        activeTab,
        setActiveTab,
        showCreateJobModal,
        setShowCreateJobModal,
        showPresentationModal,
        setShowPresentationModal,
        reviewModalData,
        setReviewModalData,
        selectedJobForDetail,
        setSelectedJobForDetail,
        createJob,
        submitProposal,
        acceptProposal,
        updateJobStatus,
        sendMessage,
        submitReview,
        resetData,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
