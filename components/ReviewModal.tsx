import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Star, X, Sparkles, Award, CheckCircle2 } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { reviewModalData, setReviewModalData, submitReview } = useMarketplace();
  
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');

  if (!reviewModalData) return null;

  const isClientReviewingCleaner = reviewModalData.targetRole === 'cleaner';

  const availableTags = isClientReviewingCleaner ? [
    'Super Pontual ⏰',
    'Capricho Impecável ✨',
    'Cuidado com Detalhes 🔍',
    'Super Confiável 🛡️',
    'Produtos Ecológicos 🌿',
    'Carinho com Pets 🐾',
    'Passadoria Perfeita 👔',
  ] : [
    'Excelente Recepção 🏡',
    'Pagamento Imediato 💳',
    'Comunicação Clara 💬',
    'Ambiente Organizado 🛋️',
    'Instruções Claras 📋',
    'Muito Educada ⭐',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(
      reviewModalData.jobId,
      reviewModalData.toUserId,
      rating,
      selectedTags,
      comment.trim() || 'Serviço executado com excelência e muito respeito mútuo!'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1d30]/65 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#cbe5de] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={() => setReviewModalData(null)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <img
              src={reviewModalData.toUserAvatar}
              alt={reviewModalData.toUserName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#0f9286]/20 shadow-md mb-2"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0f9286] text-white rounded-full flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="font-extrabold text-lg text-[#162a45]">
            Avaliar {reviewModalData.toUserName}
          </h3>
          <p className="text-xs text-gray-500">
            {isClientReviewingCleaner ? 'Construa a reputação da profissional' : 'Construa a reputação do cliente'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="bg-[#f0faf7] p-3 rounded-2xl border border-[#cdebe3]">
            <div className="flex items-center justify-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition transform hover:scale-125 cursor-pointer focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#0f766e]">
              {rating === 5 && 'Excepcional! Nota Máxima (5.0)'}
              {rating === 4 && 'Muito Bom! (4.0)'}
              {rating === 3 && 'Bom (3.0)'}
              {rating <= 2 && 'Pode Melhorar'}
            </span>
          </div>

          {/* Compliment tags */}
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Destaques positivos
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl border transition cursor-pointer font-medium ${
                      isSelected
                        ? 'bg-[#0f9286] text-white border-[#0f9286]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
              Deixe um depoimento público
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descreva como foi o serviço, pontualidade e convivência..."
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:outline-none focus:border-[#0f9286]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#0f9286] hover:bg-[#0c7c72] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#0f9286]/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Avaliação & Reputação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
