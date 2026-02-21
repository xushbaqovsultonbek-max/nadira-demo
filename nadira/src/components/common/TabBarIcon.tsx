// Иконка для нижней навигационной панели
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

interface TabBarIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}

export default function TabBarIcon({ name, color }: TabBarIconProps) {
  return (
    <Ionicons
      name={name}
      size={26}
      color={color}
      style={styles.icon}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
});
