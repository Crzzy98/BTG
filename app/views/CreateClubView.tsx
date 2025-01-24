// CreateClubView.tsx
'use client';

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
import * as InAppPurchases from 'react-native-iap';
import { useMain, useClub, Club } from '../context';
import PurchaseModal from '../view-components/PurchaseModal';

const { width } = Dimensions.get('window');

interface TierProduct {
  id: string;
  name: string;
  limit: number;
  price: string;
}

const TIER_PRODUCTS: TierProduct[] = [
  { id: '1star.club.create', name: 'Basic Club', limit: 10, price: '$4.99' },
  { id: '2star.club.create', name: 'Standard Club', limit: 20, price: '$9.99' },
  { id: '3star.club.create', name: 'Premium Club', limit: 30, price: '$14.99' },
  { id: '4star.club.create', name: 'Pro Club', limit: 40, price: '$19.99' },
  { id: '5star.club.create', name: 'Elite Club', limit: 50, price: '$24.99' },
];

export default function CreateClubView() {
  const { user } = useMain();
  const { setClubs, setSelectedClub } = useClub();

  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierProduct | null>(null);

  const isInputValid = name.trim().length > 5 && passcode.trim().length > 5;

  const handleTierSelection = (tier: TierProduct) => {
    if (!isInputValid) {
      Alert.alert('Invalid Input', 'Club name and passcode must be at least 6 characters long.');
      return;
    }
    setSelectedTier(tier);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedTier) return;

    setLoading(true);
    try {
      const purchase = await InAppPurchases.requestPurchase({
        sku: selectedTier.id
      });
      
      const purchaseResult = Array.isArray(purchase) ? purchase[0] : purchase;
      
      if (purchaseResult) {
        const newClub = {
          name,
          id: null,
          superAdmin: user?.id,
          admins: [user?.id || ''],
          birdieWeight: 65,
          clubLimit: selectedTier.limit,
          password: passcode,
        };

        // Make API call to create club
        const response = await fetch('/api/clubs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClub),
        });

        if (!response.ok) {
          throw new Error('Failed to create club');
        }

        const createdClub:Club = await response.json();
        
        // Update context
        setClubs((prevClubs) => [...prevClubs, createdClub]);
        setSelectedClub(createdClub);

        // Navigate to club detailed view
        router.push({
          pathname: '/views/ClubDetailedView',
          params: { id: createdClub.id }
        });
      }
    } catch (error) {
      console.error('Purchase/Creation failed:', error);
      Alert.alert('Error', 'Failed to complete purchase or create club. Please try again.');
    } finally {
      setLoading(false);
      setShowPurchaseModal(false);
    }
  };

  const renderTierItem = ({ item }: { item: TierProduct }) => (
    <TouchableOpacity
      style={[
        styles.tierButton,
        !isInputValid && styles.disabledButton
      ]}
      disabled={!isInputValid || loading}
      onPress={() => handleTierSelection(item)}
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

      <PurchaseModal
        visible={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={handlePurchase}
        loading={loading}
        tierDetails={selectedTier || {
          name: '',
          limit: 0,
          price: '',
        }}
      />

      {loading && !showPurchaseModal && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Processing Purchase...</Text>
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
    borderColor: 'rgba(1, 121, 111, 0.1)',
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
    backgroundColor: 'rgba(1, 121, 111, 0.9)',
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
});
