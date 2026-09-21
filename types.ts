export type UserRole = 'client' | 'cleaner';

export type ServiceType = 
  | 'padrao' 
  | 'pesada' 
  | 'pos_obra' 
  | 'comercial' 
  | 'passadoria';

export type TimeSlot = 'manha' | 'tarde' | 'dia_todo';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  location: string;
  verified: boolean;
  phone?: string;
  bio: string;
  specialties: string[];
  badges: string[];
  hourlyRateHint?: number;
  memberSince: string;
}

export interface JobProposal {
  id: string;
  jobId: string;
  cleanerId: string;
  cleanerName: string;
  cleanerAvatar: string;
  cleanerRating: number;
  cleanerReviewCount: number;
  cleanerDistanceKm: number;
  cleanerBadges: string[];
  price: number;
  isCounterOffer: boolean;
  note: string;
  includesSupplies: boolean;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface CleaningJob {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientRating: number;
  clientReviewCount: number;
  title: string;
  serviceType: ServiceType;
  propertyType: 'apartamento' | 'casa' | 'comercial';
  rooms: {
    bedrooms: number;
    bathrooms: number;
    livingRooms: number;
    hasPets: boolean;
    areaM2?: number;
  };
  address: {
    street?: string;
    neighborhood: string;
    city: string;
    distanceKm?: number; // relative to cleaner viewing it
  };
  scheduledDate: string; // e.g. "Amanhã, 22 de Set"
  timeSlot: TimeSlot;
  description: string;
  bringSupplies: boolean;
  needsIroning: boolean;
  needsWindowCleaning: boolean;
  proposedPrice: number; // inDrive style price suggestion
  status: 'open' | 'negotiating' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  proposals: JobProposal[];
  selectedProposalId?: string;
  acceptedCleanerId?: string;
  finalPrice?: number;
  clientReview?: Review;
  cleanerReview?: Review;
}

export interface ChatMessage {
  id: string;
  jobId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isPriceOffer?: boolean;
  offerPrice?: number;
}
