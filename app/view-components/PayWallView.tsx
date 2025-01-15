import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import InAppPurchases from 'react-native-iap'; //For in app purchases
import { useNavigation } from '@react-navigation/native';

interface Product {
  productId: string;
  title: string;
  localizedPrice: string;
}

const PaywallView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const navigation = useNavigation();

  const productIDs = ['your_product_id_1', 'your_product_id_2']; // Replace with your product IDs

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const items = await InAppPurchases.getProducts({ skus: productIDs });
        setProducts(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to fetch products.');
        setLoading(false);
      }
    };

    fetchProducts();

    // Cleanup in-app purchase listeners on unmount
    return () => {
      InAppPurchases.endConnection();
    };
  }, []);

  const handlePurchase = async (productId:any) => {
    setPurchasing(true);
    try {
      const purchase = await InAppPurchases.requestPurchase(productId);
      console.log('Purchase successful:', purchase);
      Alert.alert('Success', 'Purchase completed.');
      navigation.goBack(); // Close the paywall on successful purchase
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Purchase failed.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00b894" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
 <ScrollView contentContainerStyle={styles.container}>
      {products.map((product) => (
        <View key={product.productId} style={styles.productContainer}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>{product.localizedPrice}</Text>
          <Button
            title={purchasing ? 'Processing...' : 'Purchase'}
            onPress={() => handlePurchase(product.productId)}
            color="#00b894"
            disabled={purchasing}
          />
        </View>
      ))}
      <Button
        title="Restore Purchases"
        onPress={async () => {
          try {
            const restored = await InAppPurchases.initConnection();
            console.log('Restored purchases:', restored);
            Alert.alert('Success', 'Purchases restored.');
          } catch (error) {
            console.error('Restore error:', error);
            Alert.alert('Error', 'Failed to restore purchases.');
          }
        }}
        color="#00b894"
      />
    </ScrollView>  </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  productContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
});

export default PaywallView;
