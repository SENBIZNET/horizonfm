import { LucideIcon } from 'lucide-react';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  thumbnailUrl: string;
  publishedAt: any; // Firestore Timestamp
  authorName: string;
  authorId?: string;
  viewCount: number;
  status?: 'draft' | 'pending' | 'published';
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio';
  url: string;
  thumbnailUrl: string;
  category: string;
  duration: number;
  publishedAt: any;
}

export type UserRole = 'manager' | 'redchef' | 'writer' | 'technician' | 'user';

export interface Article {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'published';
  authorId: string;
  authorName: string;
  createdAt: any; // Firestore Timestamp or string
  updatedAt: any;
  publishedAt?: any;
  category: string;
  thumbnailUrl?: string;
  excerpt?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: any;
}

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}
