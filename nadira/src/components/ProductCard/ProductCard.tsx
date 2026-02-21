// Карточка товара с кнопкой "Купить"
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../types';
import { formatPrice } from '../../services/mockData';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Открытие ссылки на товар в браузере
  const handleBuy = async () => {
    const canOpen = await Linking.canOpenURL(product.shopUrl);
    if (canOpen) {
      await Linking.openURL(product.shopUrl);
    }
  };

  return (
    <View style={styles.container}>
      {/* Изображение товара */}
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

      {/* Информация о товаре */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Цена со скидкой если есть */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price, product.currency)}</Text>
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* Кнопка покупки */}
      <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
        <Ionicons name="bag-outline" size={16} color="#ffffff" />
        <Text style={styles.buyButtonText}>Купить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  productInfo: {
    flex: 1,
    gap: 3,
  },
  productName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    color: '#aaaaaa',
    fontSize: 12,
  },
  discountBadge: {
    backgroundColor: '#ff2d55',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
