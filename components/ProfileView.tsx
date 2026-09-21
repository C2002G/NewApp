import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Star, 
  ShieldCheck, 
  Award, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  RotateCcw, 
  ArrowRightLeft,
  Sparkles,
  Heart,
  Clock,
  Briefcase
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentRole, 
    setRole, 
    activeUser, 
    clientUser, 
    cleaners, 
    activeCleanerId, 
    setActiveCleanerId,
    jobs,
    resetData
  } = useMarketplace();

  // Find reviews targeting this user
  const reviewsReceived = jobs
    .flatMap(j => [j.clientReview, j.cleanerReview])
    .filter((rev): rev is NonNullable<typeof rev> => Boolean(rev && rev.toUserId === activeUser.id));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cde4dd] shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-[#0f9286]/25 shadow-md"
            />
            {activeUser.verified && (
              <div className="absolute -bottom-2 -right-2 bg-[#0f9286] text-white p-1.5 rounded-xl shadow-xs" title="Perfil Verificado">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-[#162a45]">{activeUser.name}</h1>
                <p className="text-xs text-[#0f766e] font-bold uppercase tracking-wider mt-0.5">
                  {currentRole === 'client' ? 'Perfil de Contratante (Cliente)' : 'Perfil de Diarista Profissional'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 bg-[#f0faf7] px-3 py-1.5 rounded-2xl border border-[#cdebe3]">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base font-black text-[#162a45]">{activeUser.rating}</span>
                <span className="text-xs text-gray-500">({activeUser.reviewCount} avaliações)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
              {activeUser.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-500 mt-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0f9286]" />
                {activeUser.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#0f9286]" />
                Na plataforma desde {activeUser.memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100 text-center">
          <div className="p-3 bg-[#f8faf9] rounded-2xl border border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Serviços Feitos</span>
            <p className="text-xl font-black text-[#0f766e] mt-0.5">{activeUser.completedJobsCount}</p>
          </div>
          <div className="p-3 bg-[#f8faf9] rounded-2xl border border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Avaliações 5★</span>
            <p className="text-xl font-black text-[#0f766e] mt-0.5">{activeUser.reviewCount}</p>
          </div>
          <div className="p-3 bg-[#f8faf9] rounded-2xl border border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Pontualidade</span>
            <p className="text-xl font-black text-[#0f766e] mt-0.5">100%</p>
          </div>
        </div>
      </div>

      {/* Badges de Reputação */}
      <div className="bg-white rounded-3xl p-6 border border-[#cde4dd] shadow-xs">
        <h3 className="text-base font-bold text-[#162a45] mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-[#0f9286]" />
          <span>Selos & Conquistas de Reputação</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {activeUser.badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-[#f0faf7] rounded-2xl border border-[#cde8e1]">
              <div className="w-8 h-8 rounded-xl bg-white text-[#0f9286] flex items-center justify-center font-bold shadow-2xs">
                ★
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#162a45]">{badge}</h4>
                <p className="text-[11px] text-gray-500">Reconhecido pela comunidade do Limpaépi</p>
              </div>
            </div>
          ))}

          {activeUser.specialties.map((spec, idx) => (
            <div key={`spec_${idx}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="w-8 h-8 rounded-xl bg-white text-gray-600 flex items-center justify-center font-bold shadow-2xs">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">{spec}</h4>
                <p className="text-[11px] text-gray-500">Especialidade confirmada em serviços</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Received List */}
      <div className="bg-white rounded-3xl p-6 border border-[#cde4dd] shadow-xs">
        <h3 className="text-base font-bold text-[#162a45] mb-4">
          Depoimentos e Avaliações Recebidas ({reviewsReceived.length})
        </h3>

        {reviewsReceived.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl">
            Nenhuma avaliação registrada ainda. Complete um serviço para inaugurar sua reputação!
          </div>
        ) : (
          <div className="space-y-3">
            {reviewsReceived.map((rev) => (
              <div key={rev.id} className="p-4 bg-[#fbfdfc] rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.fromUserAvatar}
                      alt={rev.fromUserName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#162a45]">{rev.fromUserName}</h4>
                      <span className="text-[10px] text-gray-400">{rev.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {rev.rating}.0
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {rev.tags.map((t, tidx) => (
                    <span key={tidx} className="text-[10px] bg-[#eaf6f3] text-[#0f766e] px-2 py-0.5 rounded-md font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Switch Persona / Reset Data Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#cde4dd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#162a45]">Alternar Perfil Ativo para Teste</h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Teste a visão do Contratante e das Diaristas no mesmo navegador
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRole(currentRole === 'client' ? 'cleaner' : 'client')}
            className="px-3.5 py-2 rounded-xl bg-[#eaf6f3] text-[#0f766e] hover:bg-[#d8f0ea] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Mudar para {currentRole === 'client' ? 'Profissional' : 'Cliente'}</span>
          </button>

          <button
            onClick={resetData}
            className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Restaurar dados originais de demonstração"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
