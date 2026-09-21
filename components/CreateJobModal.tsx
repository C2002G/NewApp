import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ServiceType, TimeSlot } from '../types';
import { 
  X, 
  Sparkles, 
  Building, 
  Home, 
  Briefcase, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Check, 
  Plus, 
  Minus, 
  Info,
  Dog,
  Shirt,
  Sparkle
} from 'lucide-react';

export const CreateJobModal: React.FC = () => {
  const { showCreateJobModal, setShowCreateJobModal, createJob, setSelectedJobForDetail, jobs } = useMarketplace();

  const [serviceType, setServiceType] = useState<ServiceType>('padrao');
  const [propertyType, setPropertyType] = useState<'apartamento' | 'casa' | 'comercial'>('apartamento');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [livingRooms, setLivingRooms] = useState(1);
  const [hasPets, setHasPets] = useState(true);
  const [areaM2, setAreaM2] = useState(70);
  
  const [scheduledDate, setScheduledDate] = useState('Amanhã');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('manha');
  const [neighborhood, setNeighborhood] = useState('Botafogo');
  const [city, setCity] = useState('Rio de Janeiro');
  
  const [bringSupplies, setBringSupplies] = useState(false);
  const [needsIroning, setNeedsIroning] = useState(false);
  const [needsWindowCleaning, setNeedsWindowCleaning] = useState(false);
  const [description, setDescription] = useState('');

  // inDrive price suggestion calculation
  const basePrice = 120 + (bedrooms * 20) + (bathrooms * 15) + (needsIroning ? 25 : 0) + (bringSupplies ? 20 : 0) + (serviceType === 'pesada' ? 30 : serviceType === 'pos_obra' ? 70 : 0);
  const [proposedPrice, setProposedPrice] = useState(basePrice);

  if (!showCreateJobModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceTitles: Record<ServiceType, string> = {
      padrao: 'Faxina padrão',
      pesada: 'Limpeza pesada detalhada',
      pos_obra: 'Limpeza especializada pós-obra',
      comercial: 'Limpeza comercial / escritório',
      passadoria: 'Passadoria de roupas e organização',
    };

    const newJobId = createJob({
      title: `${serviceTitles[serviceType]} em ${propertyType} (${bedrooms}q, ${bathrooms}b)`,
      serviceType,
      propertyType,
      rooms: {
        bedrooms,
        bathrooms,
        livingRooms,
        hasPets,
        areaM2,
      },
      address: {
        neighborhood: neighborhood.trim() || 'Bairro Centro',
        city: city.trim() || 'Rio de Janeiro',
        distanceKm: 1.8,
      },
      scheduledDate,
      timeSlot,
      description: description.trim() || 'Limpeza completa com atenção aos detalhes do dia a dia.',
      bringSupplies,
      needsIroning,
      needsWindowCleaning,
      proposedPrice: Number(proposedPrice) || basePrice,
    });

    setShowCreateJobModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0f1d30]/65 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#d6e7e2] my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f9286] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Estilo inDrive
              </span>
              <h2 className="text-xl font-bold">Solicitar Serviço de Limpeza</h2>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Defina as necessidades e proponha o valor. Os profissionais vão responder em minutos!
            </p>
          </div>
          <button
            onClick={() => setShowCreateJobModal(false)}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* 1. Tipo de Limpeza */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              1. Tipo de Serviço
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'padrao', label: 'Faxina Padrão', desc: 'Manutenção residencial' },
                { id: 'pesada', label: 'Limpeza Pesada', desc: 'Gordura e detalhes' },
                { id: 'pos_obra', label: 'Pós-Obra', desc: 'Poeira fina e resíduos' },
                { id: 'comercial', label: 'Comercial', desc: 'Escritórios e salas' },
                { id: 'passadoria', label: 'Passadoria', desc: 'Roupas e camisas' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setServiceType(item.id as ServiceType);
                    // update benchmark
                    setProposedPrice(120 + (bedrooms * 20) + (bathrooms * 15) + (item.id === 'pesada' ? 30 : item.id === 'pos_obra' ? 70 : 0));
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    serviceType === item.id
                      ? 'border-[#0f9286] bg-[#eaf7f4] text-[#0f766e]'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <p className="font-bold text-xs sm:text-sm">{item.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Imóvel & Cômodos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              2. Detalhes do Imóvel
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { id: 'apartamento', label: 'Apartamento', icon: Building },
                { id: 'casa', label: 'Casa', icon: Home },
                { id: 'comercial', label: 'Comercial', icon: Briefcase },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setPropertyType(item.id as any)}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer ${
                      propertyType === item.id
                        ? 'border-[#0f9286] bg-[#eaf7f4] text-[#0f766e]'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Room counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#f8faf9] p-3 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100">
                <span className="text-xs font-medium text-gray-700">Quartos</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                    className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{bedrooms}</span>
                  <button
                    type="button"
                    onClick={() => setBedrooms(bedrooms + 1)}
                    className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100">
                <span className="text-xs font-medium text-gray-700">Banheiros</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                    className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{bathrooms}</span>
                  <button
                    type="button"
                    onClick={() => setBathrooms(bathrooms + 1)}
                    className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center justify-between p-2 bg-white rounded-xl border border-gray-100">
                <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  <Dog className="w-3.5 h-3.5 text-amber-500" />
                  Tem Pets?
                </span>
                <button
                  type="button"
                  onClick={() => setHasPets(!hasPets)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    hasPets ? 'bg-[#0f9286] text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {hasPets ? 'Sim' : 'Não'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Extras e Inclusões */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              3. O que precisa ser feito?
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setBringSupplies(!bringSupplies)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  bringSupplies
                    ? 'border-[#0f9286] bg-[#eaf7f4] text-[#0f766e]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Sparkle className="w-3.5 h-3.5" />
                <span>Profissional leva produtos (+R$20)</span>
              </button>

              <button
                type="button"
                onClick={() => setNeedsIroning(!needsIroning)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  needsIroning
                    ? 'border-[#0f9286] bg-[#eaf7f4] text-[#0f766e]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Passar roupas (+R$25)</span>
              </button>

              <button
                type="button"
                onClick={() => setNeedsWindowCleaning(!needsWindowCleaning)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                  needsWindowCleaning
                    ? 'border-[#0f9286] bg-[#eaf7f4] text-[#0f766e]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vidros / Sacada</span>
              </button>
            </div>
          </div>

          {/* 4. Data e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Data & Período
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                >
                  <option value="Hoje, urgente">Hoje (Urgente)</option>
                  <option value="Amanhã">Amanhã</option>
                  <option value="Quinta-feira">Quinta-feira</option>
                  <option value="Sexta-feira">Sexta-feira</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Próxima semana">Próxima semana</option>
                </select>

                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                >
                  <option value="manha">Manhã (08h às 12h)</option>
                  <option value="tarde">Tarde (13h às 17h)</option>
                  <option value="dia_todo">Dia todo (08h às 16h)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                Localização (Bairro)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Copacabana, Botafogo..."
                  className="w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                  required
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                  className="w-28 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* 5. inDrive Suggested Price & Counter-offer mechanism */}
          <div className="bg-[#f0faf7] p-4 sm:p-5 rounded-2xl border border-[#cde8e1]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-[#0f9286]" />
                <span className="text-sm font-bold text-[#162a45]">Sua Proposta de Preço</span>
              </div>
              <span className="text-xs bg-[#daf2ec] text-[#0f766e] px-2 py-0.5 rounded-full font-bold">
                Média sugerida: R$ {basePrice}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              Você define quanto quer pagar! Os profissionais podem aceitar na hora ou enviar contrapropostas.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProposedPrice(Math.max(80, proposedPrice - 10))}
                className="w-10 h-10 rounded-xl bg-white border border-[#cbe5de] text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition"
              >
                -10
              </button>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  className="w-36 text-center text-2xl font-black text-[#0f766e] bg-white border-2 border-[#0f9286] rounded-2xl py-2 px-6 focus:outline-none shadow-xs"
                />
              </div>

              <button
                type="button"
                onClick={() => setProposedPrice(proposedPrice + 10)}
                className="w-10 h-10 rounded-xl bg-white border border-[#cbe5de] text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center transition"
              >
                +10
              </button>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Observações adicionais (opcional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Focar na cozinha e azulejos do banheiro; tenho aspirador em casa..."
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:bg-white focus:outline-none focus:border-[#0f9286]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#0f9286] hover:bg-[#0c7c72] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#0f9286]/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Publicar Pedido por R$ {proposedPrice}</span>
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-2">
              Nenhum valor é cobrado antecipadamente. Você só confirma após escolher o profissional.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
