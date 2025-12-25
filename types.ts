
export interface User {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  rating: number;
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
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  tags: string[];
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
}

export interface ChatSession {
  id: string;
  participants: User[];
  lastMessage: string;
  listingId: string;
}
