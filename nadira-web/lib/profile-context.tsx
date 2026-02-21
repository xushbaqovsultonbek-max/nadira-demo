'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Типы данных профиля
interface ProfileStats {
  following: number;
  followers: number;
  likes: number;
  views: number;
}

interface ProfileState {
  avatar: string;
  name: string;
  username: string;
  bio: string;
  stats: ProfileStats;
}

interface ProfileContextType {
  profile: ProfileState;
  updateProfile: (updates: Partial<ProfileState>) => void;
}

// Начальные данные профиля
const defaultProfile: ProfileState = {
  avatar: '',
  name: 'Надира Ахмедова',
  username: '@nadira_official',
  bio: 'Обзоры товаров | Мода | Красота ✨',
  stats: {
    following: 234,
    followers: 12800,
    likes: 89400,
    views: 1200000,
  },
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);

  const updateProfile = (updates: Partial<ProfileState>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

// Хук для использования контекста профиля
export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

// Форматирование чисел: 12800 → 12.8K, 1200000 → 1.2M
export function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return String(n);
}
