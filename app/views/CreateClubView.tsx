import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useStore } from 'react-redux';
import * as InAppPurchases from 'react-native-iap';
import { Store } from 'redux';

const { width } = Dimensions.get('window');

// Define types for the tier products
interface TierProduct {
  id: string;
  name: string;
  limit: number;
  price: string;
}

// Mock data with proper typing
const TIER_PRODUCTS: TierProduct[] = [
  { id: '1star.club.create', name: 'Basic Club', limit: 10, price: '$4.99' },
  { id: '2star.club.create', name: 'Standard Club', limit: 20, price: '$9.99' },
  { id: '3star.club.create', name: 'Premium Club', limit: 30, price: '$14.99' },
  { id: '4star.club.create', name: 'Pro Club', limit: 40, price: '$19.99' },
  { id: '5star.club.create', name: 'Elite Club', limit: 50, price: '$24.99' },
];

// Types
interface Player {
  id: string;
}

interface AppStore extends Store {
  player?: Player;
  createClub: (club: ClubCreate, callback: (success: boolean) => void) => void;
  getPlayer: (playerId: string, callback: (success: boolean) => void) => void;
}

interface ClubCreate {
  name: string;
  id: null;
  superAdmin: string | undefined;
  admins: string[];
  birdieWeight: number;
  clubLimit: number;
  password: string;
}

export default function CreateClubView() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const clubVM = useStore() as AppStore;
  const vm = useStore() as AppStore;

  const isInputValid = name.trim().length > 5 && passcode.trim().length > 5;

  const handlePurchase = async (productId: string) => {
    if (!isInputValid) {
      Alert.alert('Invalid Input', 'Club name and passcode must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const purchase = await InAppPurchases.requestPurchase({
        sku: productId
      });
      
      const purchaseResult = Array.isArray(purchase) ? purchase[0] : purchase;
      
      if (purchaseResult) {
        const selectedTier = TIER_PRODUCTS.find(tier => tier.id === productId);
        
        if (selectedTier) {
          const clubToCreate: ClubCreate = {
            name,
            id: null,
            superAdmin: vm.player?.id,
            admins: [vm.player?.id || ''],
            birdieWeight: 65,
            clubLimit: selectedTier.limit,
            password: passcode,
          };

          await new Promise<boolean>((resolve) => {
            clubVM.createClub(clubToCreate, (success) => {
              vm.getPlayer(vm.player?.id || '', (success) => {
                resolve(success);
              });
            });
          });

          setSuccess(true);
          setTimeout(() => {
            router.back();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTierItem = ({ item }: { item: TierProduct }) => (
    <TouchableOpacity
      style={[
        styles.tierButton,
        !isInputValid && styles.disabledButton
      ]}
      disabled={!isInputValid || loading}
      onPress={() => handlePurchase(item.id)}
    >
      <Text style={styles.tierName}>{item.name}</Text>
      <Text style={styles.tierDetails}>
        Up to {item.limit} members • {item.price}
      </Text>
    </TouchableOpacity>
  );

  const FormSection = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Club Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter club name (min. 6 characters)"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          maxLength={30}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Club Passcode</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter passcode (min. 6 characters)"
          placeholderTextColor="#666"
          value={passcode}
          onChangeText={setPasscode}
          secureTextEntry
          maxLength={20}
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList<TierProduct>
        data={TIER_PRODUCTS}
        renderItem={renderTierItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Create New Club</Text>
            <FormSection />
            <Text style={styles.sectionTitle}>Select Club Tier</Text>
          </>
        }
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006400', 
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    marginTop: 20,
    letterSpacing: 1,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 16 : 14,
    fontSize: 16,
    color: '#01796F',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tierButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(1, 121, 111, 0.1)', // Light green border
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    opacity: 0.8,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#01796F',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tierDetails: {
    fontSize: 16,
    color: '#01796F',
    opacity: 0.8,
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(1, 121, 111, 0.9)', // Semi-transparent green
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  successBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  successText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#01796F',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  successMessage: {
    fontSize: 18,
    color: '#01796F',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    opacity: 0.9,
  },
});

