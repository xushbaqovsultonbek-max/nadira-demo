// Мок-данные для приложения Nadira
import { User, Product, Video } from '../types';

// Пользователи
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'beauty_nadira',
    displayName: 'Надира Косметика',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Обзоры косметики и уходовой косметики 💄',
    followers: 124500,
    following: 320,
    totalLikes: 1200000,
  },
  {
    id: 'u2',
    username: 'fashion_style',
    displayName: 'Fashion Style UZ',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Мода и стиль из Узбекистана 👗',
    followers: 87300,
    following: 210,
    totalLikes: 760000,
  },
  {
    id: 'u3',
    username: 'tech_review_uz',
    displayName: 'Tech Review UZ',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Обзоры гаджетов и техники 📱',
    followers: 205000,
    following: 450,
    totalLikes: 3200000,
  },
  {
    id: 'u4',
    username: 'home_decor_uz',
    displayName: 'Home Decor UZ',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'Интерьер и декор для дома 🏠',
    followers: 56800,
    following: 180,
    totalLikes: 430000,
  },
  {
    id: 'u5',
    username: 'sport_life_uz',
    displayName: 'Sport Life UZ',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Спорт и здоровый образ жизни 💪',
    followers: 98700,
    following: 290,
    totalLikes: 890000,
  },
];

// Товары
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Помада Mac Ruby Woo',
    price: 85000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/lipstick/200/200',
    shopUrl: 'https://example.com/product/1',
    discount: 15,
  },
  {
    id: 'p2',
    name: 'Тональная основа Fenty Beauty',
    price: 120000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/foundation/200/200',
    shopUrl: 'https://example.com/product/2',
  },
  {
    id: 'p3',
    name: 'Летнее платье Zara',
    price: 250000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/dress/200/200',
    shopUrl: 'https://example.com/product/3',
    discount: 20,
  },
  {
    id: 'p4',
    name: 'Наушники Sony WH-1000XM5',
    price: 1890000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/headphones/200/200',
    shopUrl: 'https://example.com/product/4',
  },
  {
    id: 'p5',
    name: 'Кроссовки Nike Air Max',
    price: 680000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/sneakers/200/200',
    shopUrl: 'https://example.com/product/5',
    discount: 10,
  },
  {
    id: 'p6',
    name: 'Сумка Coach',
    price: 950000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/bag/200/200',
    shopUrl: 'https://example.com/product/6',
  },
  {
    id: 'p7',
    name: 'Ароматическая свеча',
    price: 45000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/candle/200/200',
    shopUrl: 'https://example.com/product/7',
  },
  {
    id: 'p8',
    name: 'Протеиновый коктейль',
    price: 95000,
    currency: 'UZS',
    imageUrl: 'https://picsum.photos/seed/protein/200/200',
    shopUrl: 'https://example.com/product/8',
  },
];

// Видео — публичные тестовые видео от Google (надёжные, без ограничений)
export const MOCK_VIDEOS: Video[] = [
  {
    id: 'v1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://picsum.photos/seed/video1/400/700',
    description: 'Лучшая помада этого сезона! Стойкость 12 часов 💄✨',
    likes: 45200,
    comments: 1230,
    shares: 890,
    isLiked: true,
    user: MOCK_USERS[0],
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
    hashtags: ['косметика', 'макияж', 'beauty', 'помада'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'v2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://picsum.photos/seed/video2/400/700',
    description: 'Мой летний лук 2024 — что ношу каждый день 👗☀️',
    likes: 32100,
    comments: 876,
    shares: 543,
    isLiked: false,
    user: MOCK_USERS[1],
    products: [MOCK_PRODUCTS[2]],
    hashtags: ['мода', 'лук', 'стиль', 'fashion'],
    createdAt: '2024-01-16T14:00:00Z',
  },
  {
    id: 'v3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://picsum.photos/seed/video3/400/700',
    description: 'Честный обзор Sony WH-1000XM5 — стоит ли покупать? 🎧',
    likes: 89400,
    comments: 3210,
    shares: 2100,
    isLiked: false,
    user: MOCK_USERS[2],
    products: [MOCK_PRODUCTS[3]],
    hashtags: ['техника', 'наушники', 'sony', 'обзор'],
    createdAt: '2024-01-17T09:00:00Z',
  },
  {
    id: 'v4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://picsum.photos/seed/video4/400/700',
    description: 'Как я обновила интерьер за 50,000 сум 🏠✨',
    likes: 21300,
    comments: 654,
    shares: 320,
    isLiked: true,
    user: MOCK_USERS[3],
    products: [MOCK_PRODUCTS[6]],
    hashtags: ['декор', 'интерьер', 'дом', 'уют'],
    createdAt: '2024-01-18T16:30:00Z',
  },
  {
    id: 'v5',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://picsum.photos/seed/video5/400/700',
    description: 'Тренировка дома без оборудования — 30 минут 💪🔥',
    likes: 56700,
    comments: 1890,
    shares: 1240,
    isLiked: false,
    user: MOCK_USERS[4],
    products: [MOCK_PRODUCTS[4], MOCK_PRODUCTS[7]],
    hashtags: ['спорт', 'тренировка', 'фитнес', 'здоровье'],
    createdAt: '2024-01-19T07:00:00Z',
  },
  {
    id: 'v6',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    thumbnail: 'https://picsum.photos/seed/video6/400/700',
    description: 'ТОП-5 средств для ухода за кожей этой осенью 🍂',
    likes: 38900,
    comments: 1100,
    shares: 760,
    isLiked: true,
    user: MOCK_USERS[0],
    products: [MOCK_PRODUCTS[1]],
    hashtags: ['уход', 'кожа', 'skincare', 'beauty'],
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'v7',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://picsum.photos/seed/video7/400/700',
    description: 'Сумки которые в тренде прямо сейчас 👜',
    likes: 44100,
    comments: 1560,
    shares: 890,
    isLiked: false,
    user: MOCK_USERS[1],
    products: [MOCK_PRODUCTS[5]],
    hashtags: ['сумки', 'аксессуары', 'мода', 'тренд'],
    createdAt: '2024-01-21T13:00:00Z',
  },
  {
    id: 'v8',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    thumbnail: 'https://picsum.photos/seed/video8/400/700',
    description: 'Распаковка новинок техники за январь 📦📱',
    likes: 67800,
    comments: 2340,
    shares: 1890,
    isLiked: true,
    user: MOCK_USERS[2],
    products: [MOCK_PRODUCTS[3]],
    hashtags: ['распаковка', 'техника', 'гаджеты', 'новинки'],
    createdAt: '2024-01-22T15:00:00Z',
  },
];

// Форматирование числа (1200 -> 1.2K)
export const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Форматирование цены в UZS
export const formatPrice = (price: number, currency: string): string => {
  if (currency === 'UZS') {
    return `${price.toLocaleString()} сум`;
  }
  return `${price} ${currency}`;
};
