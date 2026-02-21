// Кнопки действий с видео: лайк, комментарии, поделиться
import { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCount } from '../../services/mockData';

interface VideoActionsProps {
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

export default function VideoActions({
  likes,
  comments,
  shares,
  isLiked,
  onLike,
  onComment,
  onShare,
}: VideoActionsProps) {
  // Анимация масштаба для кнопки лайка
  const likeScale = useRef(new Animated.Value(1)).current;

  // Анимация пружины при нажатии лайка
  const handleLike = () => {
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 50,
        bounciness: 20,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
    ]).start();
    onLike();
  };

  return (
    <View style={styles.container}>
      {/* Кнопка лайка */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <Animated.View style={{ transform: [{ scale: likeScale }] }}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={32}
            color={isLiked ? '#ff2d55' : '#ffffff'}
          />
        </Animated.View>
        <Text style={styles.actionCount}>{formatCount(likes)}</Text>
      </TouchableOpacity>

      {/* Кнопка комментариев */}
      <TouchableOpacity style={styles.actionButton} onPress={onComment}>
        <Ionicons name="chatbubble-ellipses-outline" size={30} color="#ffffff" />
        <Text style={styles.actionCount}>{formatCount(comments)}</Text>
      </TouchableOpacity>

      {/* Кнопка поделиться */}
      <TouchableOpacity style={styles.actionButton} onPress={onShare}>
        <Ionicons name="arrow-redo-outline" size={30} color="#ffffff" />
        <Text style={styles.actionCount}>{formatCount(shares)}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 80,
    paddingRight: 12,
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
