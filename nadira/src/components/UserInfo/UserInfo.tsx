// Компонент с информацией о пользователе (аватар + имя + описание)
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../../types';

interface UserInfoProps {
  user: User;
  description: string;
  hashtags: string[];
}

export default function UserInfo({ user, description, hashtags }: UserInfoProps) {
  return (
    <View style={styles.container}>
      {/* Имя пользователя */}
      <TouchableOpacity style={styles.userRow}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.username}>@{user.username}</Text>
      </TouchableOpacity>

      {/* Описание видео */}
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {/* Хэштеги */}
      <View style={styles.hashtagsRow}>
        {hashtags.slice(0, 3).map((tag) => (
          <Text key={tag} style={styles.hashtag}>
            #{tag}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginRight: 8,
  },
  username: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  hashtagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hashtag: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
