// Типы данных для приложения Nadira

// Пользователь
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  totalLikes: number;
}

// Товар
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  shopUrl: string;
  discount?: number;
}

// Видео
export interface Video {
  id: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  user: User;
  products: Product[];
  hashtags: string[];
  createdAt: string;
}

// Состояние воспроизведения видео
export interface VideoPlaybackState {
  isPlaying: boolean;
  isMuted: boolean;
}
