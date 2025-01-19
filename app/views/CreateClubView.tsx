import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useStore } from 'react-redux';
import InAppPurchase from 'react-native-iap';

const { width } = Dimensions.get('window');

const TIER_PRODUCTS = [
  { id: '1star.club.create', name: 'Basic Club', limit: 10, price: '$4.99' },
  { id: '2star.club.create', name: 'Standard Club', limit: 20, price: '$9.99' },
  { id: '3star.club.create', name: 'Premium Club', limit: 30, price: '$14.99' },
  { id: '4star.club.create', name: 'Pro Club', limit: 40, price: '$19.99' },
  { id: '5star.club.create', name: 'Elite Club', limit: 50, price: '$24.99' },
];

export default function CreateClubView() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clubVM = useStore();
  const vm = useStore();

  const isInputValid = name.trim().length > 5 && passcode.trim().length > 5;

//   const handlePurchase = async (productId: string) => {
//     if (!isInputValid) {
//       Alert.alert('Invalid Input', 'Club name and passcode must be at least 6 characters long.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const purchase = await InAppPurchase.requestPurchase(productId);
//       if (purchase) {
//         const tier = getProduct(purchase.transactionReceipt);
//         if (tier) {
//           const clubToCreate = {
//             name,
//             id: null,
//             superAdmin: vm.player?.id,
//             admins: [vm.player?.id || ''],
//             birdieWeight: 65,
//             clubLimit: tier.memberLimit,
//             password: passcode,
//           };

//           await new Promise((resolve) => {
//             clubVM.createClub(clubToCreate, () => {
//               vm.getPlayer(vm.player?.id || '', (success) => {
//                 resolve(success);
//               });
//             });
//           });

//           setSuccess(true);
//           setTimeout(() => {
//             router.back();
//           }, 2000);
//         }
//       }
//     } catch (error) {
//       console.error('Purchase failed:', error);
//       Alert.alert('Error', 'Failed to complete purchase. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

  const getProduct = (receipt: string) => {
    try {
      const productData = JSON.parse(receipt);
      return productData.productId ? { memberLimit: extractMemberLimit(productData.productId) } : null;
    } catch (error) {
      console.error('Failed to decode product data:', error);
      return null;
    }
  };

  const extractMemberLimit = (productId: string) => {
    const product = TIER_PRODUCTS.find(p => p.id === productId);
    return product?.limit || 0;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.header}>Club Name</Text>
          <Text style={styles.instructions}>
            Enter your club name (minimum 6 characters)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter club name"
            value={name}
            onChangeText={setName}
            maxLength={30}
          />

          <Text style={styles.header}>Club Passcode</Text>
          <Text style={styles.instructions}>
            Create a secure passcode for club members (minimum 6 characters)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter club passcode"
            value={passcode}
            onChangeText={setPasscode}
            secureTextEntry
            maxLength={20}
          />
        </View>

        <View style={styles.tierSection}>
          <Text style={styles.tierHeader}>Select Club Tier</Text>
          {TIER_PRODUCTS.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.tierButton,
                !isInputValid && styles.disabledButton
              ]}
              disabled={!isInputValid || loading}
            //   onPress={() => handlePurchase(product.id)}
            >
              <Text style={styles.tierName}>{product.name}</Text>
              <Text style={styles.tierDetails}>
                Up to {product.limit} members • {product.price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Processing Purchase...</Text>
        </View>
      )}

      {success && (
        <View style={styles.overlay}>
          <View style={styles.successBox}>
            <Text style={styles.successText}>Success!</Text>
            <Text style={styles.successMessage}>
              Your club has been created successfully.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#01796F',
  },
  scrollContent: {
    padding: 20,
  },
  formSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  instructions: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tierSection: {
    marginBottom: 20,
  },
  tierHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  tierButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#BDB76B',
    opacity: 0.7,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#01796F',
    marginBottom: 5,
  },
  tierDetails: {
    fontSize: 14,
    color: '#01796F',
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  successBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#01796F',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
