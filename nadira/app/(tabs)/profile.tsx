// Экран профиля пользователя
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_VIDEOS, MOCK_USERS, formatCount } from '../../src/services/mockData';
import { Video } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Текущий пользователь (первый в списке мок-данных)
const CURRENT_USER = MOCK_USERS[0];

// Видео текущего пользователя
const userVideos = MOCK_VIDEOS.filter((v) => v.user.id === CURRENT_USER.id);

// Размер ячейки сетки (3 колонки)
const COLUMN_COUNT = 3;
const CELL_GAP = 2;
const CELL_SIZE = (SCREEN_WIDTH - CELL_GAP * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

export default function ProfileScreen() {
  const [isFollowing, setIsFollowing] = useState(false);

  // Рендер статистики
  const StatItem = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{formatCount(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  // Рендер ячейки видео в сетке
  const renderVideoCell = ({ item, index }: ListRenderItemInfo<Video>) => (
    <TouchableOpacity
      style={[
        styles.videoCell,
        { marginLeft: index % COLUMN_COUNT === 0 ? CELL_GAP : 0 },
      ]}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.videoCellImage} />
      {/* Количество просмотров / лайков */}
      <View style={styles.videoCellOverlay}>
        <Ionicons name="heart" size={12} color="#ffffff" />
        <Text style={styles.videoCellLikes}>{formatCount(item.likes)}</Text>
      </View>
    </TouchableOpacity>
  );

  // Шапка профиля (рендерится как ListHeaderComponent)
  const ProfileHeader = () => (
    <View style={styles.header}>
      {/* Аватар */}
      <Image source={{ uri: CURRENT_USER.avatar }} style={styles.avatar} />

      {/* Имя */}
      <Text style={styles.displayName}>{CURRENT_USER.displayName}</Text>
      <Text style={styles.username}>@{CURRENT_USER.username}</Text>

      {/* Биография */}
      <Text style={styles.bio}>{CURRENT_USER.bio}</Text>

      {/* Статистика */}
      <View style={styles.statsRow}>
        <StatItem label="Подписки" value={CURRENT_USER.following} />
        <View style={styles.statDivider} />
        <StatItem label="Подписчики" value={CURRENT_USER.followers} />
        <View style={styles.statDivider} />
        <StatItem label="Лайки" value={CURRENT_USER.totalLikes} />
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Редактирование', 'Функция будет доступна в следующей версии')}
        >
          <Text style={styles.editButtonText}>Редактировать профиль</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Разделитель перед сеткой */}
      <View style={styles.sectionHeader}>
        <Ionicons name="grid-outline" size={18} color="#ffffff" />
        <Text style={styles.sectionTitle}>Видео</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={userVideos}
      renderItem={renderVideoCell}
      keyExtractor={(item) => item.id}
      numColumns={COLUMN_COUNT}
      ListHeaderComponent={ProfileHeader}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: CELL_GAP }} />}
      ListEmptyComponent={() => (
        <View style={styles.emptyVideos}>
          <Ionicons name="videocam-outline" size={48} color="#333333" />
          <Text style={styles.emptyText}>Нет видео</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    paddingBottom: 80, // Отступ для плавающего таб-бара
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#ff6b35',
    marginBottom: 12,
  },
  displayName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  username: {
    color: '#aaaaaa',
    fontSize: 14,
    marginBottom: 10,
  },
  bio: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  // Статистика
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#aaaaaa',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333333',
  },
  // Кнопки действий
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    width: '100%',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  shareButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
    width: '100%',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Сетка видео
  videoCell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.6,
    marginRight: CELL_GAP,
    backgroundColor: '#1a1a1a',
  },
  videoCellImage: {
    width: '100%',
    height: '100%',
  },
  videoCellOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  videoCellLikes: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyVideos: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
  },
});
