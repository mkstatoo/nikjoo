
export interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  rating: number;
  role?: 'admin' | 'user';
  phone?: string;
  isVerified?: boolean;
  preferences: UserPreferences;
  blockedUsers?: string[];
  notifications_list?: UserNotification[];
}

export interface UserPreferences {
  viewMode: 'grid' | 'list';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  images: string[];
  seller: User;
  createdAt: string;
  updatedAt?: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  tags: string[];
  icon?: string;
  isModerated?: boolean;
  views: number;
  status: 'active' | 'sold' | 'expired' | 'pending';
  reportsCount?: number;
}

export interface SavedSearch {
  id: string;
  query: string;
  location: string;
  createdAt: string;
}

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

export interface Banner {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  link: string;
  position: number;
  price: number;
  status?: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isDeleted?: boolean;
}

export interface ChatSession {
  id: string;
  participants: User[];
  lastMessage: string;
  listingId: string;
}
