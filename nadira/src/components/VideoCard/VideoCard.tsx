// Полноэкранная карточка видео — pixel-perfect стиль Wibes
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Animated,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Video as ExpoVideo, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Video } from '../../types';
import { formatCount } from '../../services/mockData';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  isScreenFocused: boolean; // флаг: вкладка "Главная" активна
  onLike: (videoId: string) => void;
}

export default function VideoCard({ video, isActive, isScreenFocused, onLike }: VideoCardProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saves, setSaves] = useState(video.shares);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [progress, setProgress] = useState(0);

  // Анимация иконки паузы в центре экрана
  const pauseIconOpacity = useRef(new Animated.Value(0)).current;

  // Анимация лайка — пружинный эффект
  const likeScale = useRef(new Animated.Value(1)).current;

  // Управление воспроизведением: учитываем активность видео, паузу и фокус вкладки
  useEffect(() => {
    if (!videoRef.current) return;

    const shouldPlay = isActive && !isPaused && isScreenFocused;

    if (shouldPlay) {
      videoRef.current.playAsync().catch(() => {});
    } else {
      videoRef.current.pauseAsync().catch(() => {});
      // Сброс позиции только при смене видео, не при переключении вкладки
      if (!isActive) {
        videoRef.current.setPositionAsync(0).catch(() => {});
        setProgress(0);
        setIsLoaded(false);
      }
    }
  }, [isActive, isPaused, isScreenFocused]);

  // Пауза когда приложение уходит в фон (сворачивание)
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (!videoRef.current || !isActive || !isScreenFocused) return;
      if (nextState === 'background' || nextState === 'inactive') {
        videoRef.current.pauseAsync().catch(() => {});
      } else if (nextState === 'active' && !isPaused) {
        videoRef.current.playAsync().catch(() => {});
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [isActive, isPaused, isScreenFocused]);

  // Tap — пауза с анимацией иконки
  const handleTap = useCallback(() => {
    if (!isActive) return;
    setIsPaused((prev) => !prev);
    Animated.sequence([
      Animated.timing(pauseIconOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(pauseIconOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [isActive, pauseIconOpacity]);

  // Лайк с анимацией пружины
  const handleLike = useCallback(() => {
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.5, useNativeDriver: true, speed: 50, bounciness: 20 }),
      Animated.spring(likeScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
    ]).start();
    onLike(video.id);
  }, [onLike, video.id, likeScale]);

  // Сохранить (bookmark)
  const handleSave = useCallback(() => {
    setIsSaved((prev) => {
      setSaves((s) => (prev ? s - 1 : s + 1));
      return !prev;
    });
  }, []);

  // Подписаться
  const handleSubscribe = useCallback(() => setIsSubscribed((prev) => !prev), []);

  // Отслеживание прогресса видео
  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    setIsLoaded(true);
    if (status.durationMillis && status.positionMillis !== undefined) {
      setProgress(status.positionMillis / status.durationMillis);
    }
  }, []);

  const hasProducts = video.products && video.products.length > 0;

  return (
    <View style={styles.container}>

      {/* ── ВИДЕО (полный экран) ── */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.videoWrapper}>
          {/* Превью до загрузки */}
          {!isLoaded && (
            <Image
              source={{ uri: video.thumbnail }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          )}
          <ExpoVideo
            ref={videoRef}
            source={{ uri: video.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted={isMuted}
            shouldPlay={isActive && !isPaused}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />

          {/* Фиолетовое свечение сверху (Wibes стиль) */}
          <View style={styles.purpleGlow1} />
          <View style={styles.purpleGlow2} />

          {/* Нижний градиент для читаемости UI */}
          <View style={styles.bottomGradient} />

          {/* Иконка паузы/воспроизведения по центру */}
          <Animated.View style={[styles.pauseIconWrapper, { opacity: pauseIconOpacity }]}>
            <Ionicons
              name={isPaused ? 'play' : 'pause'}
              size={48}
              color="rgba(255,255,255,0.95)"
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {/* ── ПРАВАЯ ПАНЕЛЬ ДЕЙСТВИЙ ── */}
      <View style={styles.rightActions}>

        {/* Лайк */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
          <Animated.View style={{ transform: [{ scale: likeScale }] }}>
            <Ionicons
              name={video.isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={video.isLiked ? '#ff2d55' : '#ffffff'}
            />
          </Animated.View>
          <Text style={styles.actionCount}>{formatCount(video.likes)}</Text>
        </TouchableOpacity>

        {/* Комментарий */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#ffffff" />
          <Text style={styles.actionCount}>{formatCount(video.comments)}</Text>
        </TouchableOpacity>

        {/* Сохранить (bookmark) */}
        <TouchableOpacity style={styles.actionBtn} onPress={handleSave} activeOpacity={0.7}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={isSaved ? '#FFE600' : '#ffffff'}
          />
          <Text style={styles.actionCount}>{formatCount(saves)}</Text>
        </TouchableOpacity>

        {/* Поделиться */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-redo-outline" size={28} color="#ffffff" />
        </TouchableOpacity>

        {/* Три точки */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Звук */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsMuted((p) => !p)} activeOpacity={0.7}>
          <Ionicons
            name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      {/* ── НИЖНИЙ ЛЕВЫЙ: ПОЛЬЗОВАТЕЛЬ ── */}
      <View style={styles.bottomLeft}>

        {/* Строка: аватар + имя + подписаться */}
        <View style={styles.userRow}>
          {/* Аватар — фиолетовый фон (Wibes стиль) */}
          <View style={styles.avatarRing}>
            <Image source={{ uri: video.user.avatar }} style={styles.avatar} />
          </View>

          {/* Имя пользователя */}
          <Text style={styles.username} numberOfLines={1}>
            @{video.user.username}
          </Text>

          {/* Кнопка "Подписаться" — только рамка, прозрачный фон */}
          <TouchableOpacity
            style={[styles.subscribeBtn, isSubscribed && styles.subscribeBtnFilled]}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeBtnText}>
              {isSubscribed ? 'Вы подписаны' : 'Подписаться'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Просмотры */}
        <Text style={styles.viewsText}>
          {formatCount(video.likes * 4)} просмотров
        </Text>
      </View>

      {/* ── БАННЕР ТОВАРА "1 товар" ── */}
      {hasProducts && (
        <TouchableOpacity style={styles.productBanner} activeOpacity={0.85}>
          <Image
            source={{ uri: video.products[0].imageUrl }}
            style={styles.productThumb}
          />
          <Text style={styles.productBannerText}>
            {video.products.length} {video.products.length === 1 ? 'товар' : 'товара'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      )}

      {/* ── ПРОГРЕСС-БАР ── */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  videoWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },

  // Фиолетовое свечение сверху (два слоя для плавного эффекта)
  purpleGlow1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.22)',
  },
  purpleGlow2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },

  // Нижний градиент
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },

  // Иконка паузы в центре
  pauseIconWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Правая панель ──
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 130,
    alignItems: 'center',
    gap: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 3,
    minWidth: 36,
  },
  actionCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // ── Нижний левый: пользователь ──
  bottomLeft: {
    position: 'absolute',
    left: 12,
    right: 70,
    bottom: 128,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'nowrap',
    marginBottom: 5,
  },
  avatarRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  // Кнопка подписки — только рамка, прозрачный фон
  subscribeBtn: {
    borderWidth: 1.5,
    borderColor: '#ffffff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  subscribeBtnFilled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  subscribeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  viewsText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    marginLeft: 44,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // ── Баннер товара ──
  productBanner: {
    position: 'absolute',
    left: 12,
    bottom: 70,
    width: SCREEN_WIDTH * 0.65,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  productBannerText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },

  // Прогресс-бар (белый, тонкий)
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
});
