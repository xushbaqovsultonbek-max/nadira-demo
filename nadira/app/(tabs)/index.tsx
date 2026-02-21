// Главный экран — вертикальная лента видео (Reels)
import { useState, useCallback, useRef } from 'react';
import {
  FlatList,
  ViewToken,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import VideoCard from '../../src/components/VideoCard/VideoCard';
import { MOCK_VIDEOS } from '../../src/services/mockData';
import { Video } from '../../src/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [activeVideoId, setActiveVideoId] = useState<string>(MOCK_VIDEOS[0]?.id ?? '');
  const [isTabFocused, setIsTabFocused] = useState(true);

  // Пауза всех видео при уходе с вкладки, возобновление при возврате
  useFocusEffect(
    useCallback(() => {
      setIsTabFocused(true);
      return () => {
        setIsTabFocused(false);
      };
    }, [])
  );

  // Отслеживание видимого видео при скролле
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].item) {
        const visibleVideo = viewableItems[0].item as Video;
        setActiveVideoId(visibleVideo.id);
      }
    },
    []
  );

  // Настройки видимости — видео считается активным при 80% видимости
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  });

  // Обработчик лайка — переключает состояние isLiked и обновляет счётчик
  const handleLike = useCallback((videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;
        return {
          ...v,
          isLiked: !v.isLiked,
          likes: v.isLiked ? v.likes - 1 : v.likes + 1,
        };
      })
    );
  }, []);

  // Рендер одной карточки видео
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Video>) => (
      <VideoCard
        video={item}
        isActive={item.id === activeVideoId}
        isScreenFocused={isTabFocused}
        onLike={handleLike}
      />
    ),
    [activeVideoId, isTabFocused, handleLike]
  );

  const keyExtractor = useCallback((item: Video) => item.id, []);

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig.current}
      style={styles.list}
      removeClippedSubviews
      maxToRenderPerBatch={3}
      windowSize={5}
      initialNumToRender={2}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
