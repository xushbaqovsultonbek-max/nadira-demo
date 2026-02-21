// Экран избранного — сетка лайкнутых видео
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_VIDEOS } from '../../src/services/mockData';
import { Video } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Размер ячейки: 3 колонки с отступами
const COLUMN_COUNT = 3;
const CELL_GAP = 2;
const CELL_SIZE = (SCREEN_WIDTH - CELL_GAP * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

// Фильтрация видео с лайком
const likedVideos = MOCK_VIDEOS.filter((v) => v.isLiked);

export default function LikesScreen() {
  // Рендер одного превью видео
  const renderItem = ({ item, index }: ListRenderItemInfo<Video>) => (
    <TouchableOpacity
      style={[
        styles.cell,
        { marginLeft: index % COLUMN_COUNT === 0 ? CELL_GAP : 0 },
      ]}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      {/* Иконка лайка поверх превью */}
      <View style={styles.overlay}>
        <Ionicons name="heart" size={16} color="#ff2d55" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Избранное</Text>
        <Text style={styles.count}>{likedVideos.length} видео</Text>
      </View>

      {likedVideos.length === 0 ? (
        // Пустое состояние
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#333333" />
          <Text style={styles.emptyTitle}>Нет избранного</Text>
          <Text style={styles.emptySubtitle}>
            Лайкайте видео и они появятся здесь
          </Text>
        </View>
      ) : (
        // Сетка видео
        <FlatList
          data={likedVideos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: CELL_GAP }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
  count: {
    color: '#666666',
    fontSize: 14,
  },
  grid: {
    paddingBottom: 80, // Отступ для плавающего таб-бара
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.6,
    marginRight: CELL_GAP,
    marginBottom: 0,
    backgroundColor: '#1a1a1a',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  // Пустое состояние
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
