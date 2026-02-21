// Layout таб-навигации — точный стиль Wibes
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Без подписей под иконками
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#000000',
          borderTopColor: 'rgba(255,255,255,0.10)',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 0,
        },
      }}
    >
      {/* Главная — иконка-призрак (Wibes логотип) */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="ghost"
              size={26}
              color={focused ? '#ffffff' : 'rgba(255,255,255,0.45)'}
            />
          ),
        }}
      />

      {/* Поиск */}
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={24}
              color={focused ? '#ffffff' : 'rgba(255,255,255,0.45)'}
            />
          ),
        }}
      />

      {/* Создать — жёлтая кнопка по центру */}
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: () => (
            <View style={styles.createBtn}>
              <Ionicons name="add" size={26} color="#000000" />
            </View>
          ),
        }}
      />

      {/* Избранное / Лайки */}
      <Tabs.Screen
        name="likes"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={24}
              color={focused ? '#ffffff' : 'rgba(255,255,255,0.45)'}
            />
          ),
        }}
      />

      {/* Профиль */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'}
              size={26}
              color={focused ? '#ffffff' : 'rgba(255,255,255,0.45)'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // Жёлтая кнопка "+" — точно как Wibes
  createBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFE600',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
