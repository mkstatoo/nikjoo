
export interface User {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  rating: number;
  role?: 'admin' | 'user';
  phone?: string;
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
  icon?: string;
  isModerated?: boolean;
}

export interface Banner {
  id: string;
  name: string; // نام داخلی بنر
  title: string; // متن روی بنر
  imageUrl: string;
  link: string;
  position: number;
  price: number; // قیمت اجاره بنر
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
