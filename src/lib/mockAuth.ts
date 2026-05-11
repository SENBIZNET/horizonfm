import { UserRole } from '../types';

export interface MockUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: UserRole;
  password: string;
}

export const MOCK_ADMINS: MockUser[] = [
  {
    uid: 'mock-admin-1',
    displayName: 'Oumoud Diallo',
    email: 'oumoud.dg@horizonmedias.net',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=oumoud',
    role: 'manager',
    password: 'Guinee@2026'
  },
  {
    uid: 'mock-writer-1',
    displayName: 'Journaliste Horizon',
    email: 'journaliste1@horizonmedias.net',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=journaliste',
    role: 'writer',
    password: 'Guinee@2026'
  },
  {
    uid: 'mock-animateur-1',
    displayName: 'Animateur Horizon',
    email: 'animateur@horizonmedias.net',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=animateur',
    role: 'writer',
    password: 'Guinee@2026'
  },
  {
    uid: 'mock-editor-1',
    displayName: 'Rédacteur Chef',
    email: 'redchef@horizonmedias.net',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=redactor',
    role: 'redchef',
    password: 'Guinee@2026'
  },
  {
    uid: 'mock-tech-1',
    displayName: 'Technicien Horizon',
    email: 'technicien@horizonmedias.net',
    photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    role: 'technician',
    password: 'Guinee@2026'
  }
];

export const MOCK_AUTH_KEY = 'horizon_mock_user';

export function getMockUserByEmail(email: string): MockUser | undefined {
  return MOCK_ADMINS.find(u => u.email.toLowerCase() === email.toLowerCase());
}
