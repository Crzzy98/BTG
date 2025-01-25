'use client';

import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import * as InAppPurchases from 'react-native-iap';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setSelectedClub } from '@/store/reducers/clubReducer';
import type { Club } from '@/store/types'; // Import the exact type

interface TierProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  limit: number;
}

const { width, height } = Dimensions.get('window');

export default function CreateClubView() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierProduct | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();

  const DEFAULT_BIRDIE_WEIGHT = 65

  const tiers: TierProduct[] = [
    { id: 'small_tier', title: 'Small Club', description: 'Up to 25 members', price: '$4.99', limit: 25 },
    { id: 'medium_tier', title: 'Medium Club', description: 'Up to 50 members', price: '$9.99', limit: 50 },
    { id: 'large_tier', title: 'Large Club', description: 'Up to 100 members', price: '$19.99', limit: 100 },
  ];

  //Store user on login and retrieve here
  const handlePurchase = async () => {
    if (!selectedTier || !user) {
      Alert.alert('Error', 'Please select a tier and ensure you are logged in');
      return;
    }

    if (name.length < 6 || passcode.length < 6) {
      Alert.alert('Validation Error', 'Club name and passcode must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const purchase = await InAppPurchases.requestPurchase({
        sku: selectedTier.id
      });

      const purchaseResult = Array.isArray(purchase) ? purchase[0] : purchase;

      //REview swift file using AI to determine necessary club data structure
      //  and do same for player and user/ refine store
      if (purchaseResult) {
        const newClub: Partial<Club> = {
          name,
          passcode,
          superAdmin: user.id,
          admins: [user.id],
          birdieWeight: DEFAULT_BIRDIE_WEIGHT,
          clubLimit: selectedTier.limit,
        };

        const response = await fetch('/api/clubs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClub),
        });

        const data: Club = await response.json();

        if (response.ok) {
          dispatch(setSelectedClub(data));
          setShowPurchaseModal(false);
          router.push('/views/ClubDetailedView');
        } else {
          Alert.alert('Error', 'Failed to create club');
        }
      }
    } catch (error) {
      console.error('Error creating club:', error);
      Alert.alert('Error', 'Failed to create club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTierOption = (tier: TierProduct) => (
    <TouchableOpacity
      key={tier.id}
      style={[
        styles.tierOption,
        selectedTier?.id === tier.id && styles.selectedTier
      ]}
      onPress={() => setSelectedTier(tier)}
    >
      <Text style={styles.tierTitle}>{tier.title}</Text>
      <Text style={styles.tierDescription}>{tier.description}</Text>
      <Text style={styles.tierPrice}>{tier.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create New Club</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Club Name (min. 6 characters)"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Passcode (min. 6 characters)"
            value={passcode}
            onChangeText={setPasscode}
            placeholderTextColor="#666"
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.sectionTitle}>Select Club Size</Text>
          
          <View style={styles.tiersContainer}>
            {tiers.map(renderTierOption)}
          </View>

          <TouchableOpacity 
            style={styles.createButton}
            onPress={handlePurchase}
            disabled={loading || !selectedTier}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createButtonText}>Create Club</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  tiersContainer: {
    marginBottom: 20,
  },
  tierOption: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedTier: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  tierTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tierDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  tierPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 5,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
