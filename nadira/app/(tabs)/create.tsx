// Экран создания нового видео-обзора — загрузка из галереи
import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

// Цветовая схема
const COLORS = {
  background: '#000000',
  surface: '#1a1a1a',
  primary: '#ffffff',
  secondary: '#888888',
  accent: '#ff2d55',
  buy: '#ff6b35',
  border: '#2a2a2a',
};

export default function CreateScreen() {
  const [description, setDescription] = useState('');
  const [productLink, setProductLink] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Выбор видео из галереи
  const handlePickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Нет доступа к галерее',
        'Откройте Настройки и разрешите доступ к медиатеке.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedVideoUri(result.assets[0].uri);
    }
  };

  // Удалить выбранное видео
  const handleRemoveVideo = () => {
    Alert.alert('Удалить видео?', 'Выбранное видео будет убрано.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => setSelectedVideoUri(null),
      },
    ]);
  };

  // Публикация видео
  const handlePublish = async () => {
    if (!selectedVideoUri) {
      Alert.alert('Выберите видео', 'Загрузите видео из галереи.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Добавьте описание', 'Расскажите о товаре в описании.');
      return;
    }

    setIsLoading(true);

    // Имитация загрузки на сервер (MVP — заглушка)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);

    Alert.alert('Опубликовано!', 'Ваш видео-обзор успешно опубликован.', [
      {
        text: 'Отлично!',
        onPress: () => {
          // Сбросить форму после публикации
          setDescription('');
          setProductLink('');
          setHashtags('');
          setSelectedVideoUri(null);
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Заголовок */}
        <Text style={styles.title}>Новый обзор</Text>

        {/* Зона выбора / превью видео */}
        {selectedVideoUri ? (
          // Превью выбранного видео с нативными контролами
          <View style={styles.previewWrapper}>
            <ExpoVideo
              source={{ uri: selectedVideoUri }}
              style={styles.videoPreview}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              isMuted={false}
              useNativeControls
            />
            {/* Кнопка удаления видео */}
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveVideo}>
              <Ionicons name="close-circle" size={28} color="#ff2d55" />
            </TouchableOpacity>
          </View>
        ) : (
          // Кнопка загрузки из галереи
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={handlePickVideo}
            activeOpacity={0.7}
          >
            <View style={styles.uploadIconWrapper}>
              <Ionicons name="cloud-upload-outline" size={40} color={COLORS.buy} />
            </View>
            <Text style={styles.uploadTitle}>Загрузить видео</Text>
            <Text style={styles.uploadSubtitle}>Выберите видео из галереи</Text>
            <Text style={styles.uploadHint}>MP4, MOV — до 60 секунд</Text>
          </TouchableOpacity>
        )}

        {/* Форма с описанием */}
        <View style={styles.form}>
          {/* Описание */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Расскажите о товаре..."
              placeholderTextColor={COLORS.secondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={200}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          {/* Ссылка на товар */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ссылка на товар</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="link-outline" size={18} color={COLORS.secondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="https://..."
                placeholderTextColor={COLORS.secondary}
                value={productLink}
                onChangeText={setProductLink}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Хэштеги */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Хэштеги</Text>
            <View style={styles.inputWithIcon}>
              <Text style={[styles.inputIcon, { color: COLORS.secondary, fontSize: 16 }]}>#</Text>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="красота мода стиль"
                placeholderTextColor={COLORS.secondary}
                value={hashtags}
                onChangeText={setHashtags}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <Text style={styles.hint}>Через пробел, без #</Text>
          </View>
        </View>

        {/* Кнопка публикации */}
        <TouchableOpacity
          style={[
            styles.publishButton,
            (!selectedVideoUri || !description.trim()) && styles.publishButtonDisabled,
          ]}
          onPress={handlePublish}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={22} color="#ffffff" />
              <Text style={styles.publishButtonText}>Опубликовать</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100, // Отступ для плавающего таб-бара
  },
  title: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
  },
  // Зона загрузки видео (пустое состояние)
  uploadArea: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  uploadIconWrapper: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,107,53,0.12)',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  uploadTitle: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '700',
  },
  uploadSubtitle: {
    color: COLORS.secondary,
    fontSize: 14,
  },
  uploadHint: {
    color: '#555555',
    fontSize: 12,
    marginTop: 2,
  },
  // Превью выбранного видео
  previewWrapper: {
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#111',
    position: 'relative',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 2,
  },
  // Форма
  form: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.primary,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  textArea: {
    height: 110,
  },
  charCount: {
    color: '#555555',
    fontSize: 11,
    textAlign: 'right',
  },
  hint: {
    color: '#555555',
    fontSize: 11,
  },
  // Кнопка публикации
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buy,
    borderRadius: 14,
    paddingVertical: 17,
    gap: 8,
  },
  publishButtonDisabled: {
    opacity: 0.4,
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
