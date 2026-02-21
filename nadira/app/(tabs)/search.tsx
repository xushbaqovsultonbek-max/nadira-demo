// Экран поиска — теги, категории, сетка видео
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_VIDEOS } from '../../src/services/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Трендовые теги
const TRENDING_TAGS = [
  '#ВайбовыеБоксы',
  '14 февраля',
  '#КреаторыWib',
  '#Мода2024',
  '#Красота',
  '#Техника',
];

// Категории с превью-коллажем
const CATEGORIES = [
  {
    id: 'c1',
    name: 'Красота',
    thumbnails: [MOCK_VIDEOS[0].thumbnail, MOCK_VIDEOS[5].thumbnail],
  },
  {
    id: 'c2',
    name: 'Мода',
    thumbnails: [MOCK_VIDEOS[1].thumbnail, MOCK_VIDEOS[6].thumbnail],
  },
  {
    id: 'c3',
    name: 'Техника',
    thumbnails: [MOCK_VIDEOS[2].thumbnail, MOCK_VIDEOS[7].thumbnail],
  },
  {
    id: 'c4',
    name: 'Дом и уют',
    thumbnails: [MOCK_VIDEOS[3].thumbnail, MOCK_VIDEOS[0].thumbnail],
  },
  {
    id: 'c5',
    name: 'Спорт',
    thumbnails: [MOCK_VIDEOS[4].thumbnail, MOCK_VIDEOS[2].thumbnail],
  },
  {
    id: 'c6',
    name: 'Еда в тренде',
    thumbnails: [MOCK_VIDEOS[1].thumbnail, MOCK_VIDEOS[3].thumbnail],
  },
];

// Размеры ячеек
const TILE_WIDTH = (SCREEN_WIDTH - 12 * 3) / 2;
const CELL_SIZE = (SCREEN_WIDTH - 2) / 3;

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  // Фильтрация видео по запросу
  const filteredVideos = useMemo(() => {
    if (!searchText.trim()) return MOCK_VIDEOS;
    const query = searchText.toLowerCase();
    return MOCK_VIDEOS.filter(
      (v) =>
        v.description.toLowerCase().includes(query) ||
        v.hashtags.some((tag) => tag.toLowerCase().includes(query)) ||
        v.user.username.toLowerCase().includes(query) ||
        v.user.displayName.toLowerCase().includes(query)
    );
  }, [searchText]);

  const isSearching = searchText.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* Строка поиска */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#888888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск"
            placeholderTextColor="#888888"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#666666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!isSearching ? (
          <>
            {/* Горизонтальные трендовые теги */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsRow}
            >
              {TRENDING_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagChip}
                  onPress={() => setSearchText(tag.replace('#', ''))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Сетка категорий — 2 колонки с коллажем */}
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat.id} style={styles.categoryTile} activeOpacity={0.8}>
                  {/* Коллаж из 2 превью */}
                  <View style={styles.categoryImages}>
                    <Image
                      source={{ uri: cat.thumbnails[0] }}
                      style={styles.thumbLeft}
                    />
                    <Image
                      source={{ uri: cat.thumbnails[1] }}
                      style={styles.thumbRight}
                    />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Баннер — статьи */}
            <TouchableOpacity style={styles.featureBanner} activeOpacity={0.9}>
              <Image
                source={{ uri: MOCK_VIDEOS[1].thumbnail }}
                style={styles.featureBannerImage}
              />
              {/* Затемнение */}
              <View style={styles.featureBannerOverlay} />
              {/* Иконка воспроизведения слева */}
              <View style={styles.featurePlayBtn}>
                <Ionicons name="play" size={20} color="#ffffff" />
              </View>
              {/* Кнопка "Читать статьи" справа */}
              <View style={styles.featureReadBadge}>
                <Text style={styles.featureReadText}>Читать статьи</Text>
              </View>
            </TouchableOpacity>

            {/* Заголовок секции видео */}
            <Text style={styles.sectionTitle}>Популярные видео</Text>
          </>
        ) : (
          /* Заголовок результатов */
          <Text style={styles.sectionTitle}>
            {filteredVideos.length > 0
              ? `Найдено: ${filteredVideos.length}`
              : 'Ничего не найдено'}
          </Text>
        )}

        {/* Сетка видео (3 колонки) */}
        {filteredVideos.length > 0 ? (
          <View style={styles.videosGrid}>
            {filteredVideos.map((video) => (
              <TouchableOpacity key={video.id} style={styles.videoCell} activeOpacity={0.85}>
                <Image source={{ uri: video.thumbnail }} style={styles.videoThumb} />
                {/* Иконка воспроизведения */}
                <View style={styles.playIcon}>
                  <Ionicons name="play" size={12} color="#ffffff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          /* Пустой результат поиска */
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={52} color="#333333" />
            <Text style={styles.emptyTitle}>Ничего не найдено</Text>
            <Text style={styles.emptySubtitle}>Попробуйте другой запрос</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  // Поисковая строка
  searchBarWrapper: {
    paddingTop: 56,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  // Теги
  tagsRow: {
    paddingHorizontal: 12,
    paddingBottom: 18,
    gap: 8,
    flexDirection: 'row',
  },
  tagChip: {
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2c2c2c',
  },
  tagText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  // Категории
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 14,
  },
  categoryTile: {
    width: TILE_WIDTH,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryImages: {
    height: 105,
    flexDirection: 'row',
  },
  thumbLeft: {
    flex: 1,
    height: '100%',
    marginRight: 1,
  },
  thumbRight: {
    flex: 1,
    height: '100%',
  },
  categoryName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  // Баннер
  featureBanner: {
    marginHorizontal: 12,
    marginBottom: 18,
    borderRadius: 14,
    overflow: 'hidden',
    height: 210,
  },
  featureBannerImage: {
    width: '100%',
    height: '100%',
  },
  featureBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  featurePlayBtn: {
    position: 'absolute',
    left: 16,
    bottom: '40%',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureReadBadge: {
    position: 'absolute',
    right: 16,
    bottom: '40%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  featureReadText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  // Заголовок секции
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  // Сетка видео
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  videoCell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.55,
    backgroundColor: '#1c1c1c',
    margin: 0.5,
    position: 'relative',
  },
  videoThumb: {
    width: '100%',
    height: '100%',
  },
  playIcon: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
    padding: 4,
  },
  // Пустое состояние
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: '#666666',
    fontSize: 14,
  },
});
