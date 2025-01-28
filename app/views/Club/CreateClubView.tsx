import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setSelectedClub } from '@/store/reducers/clubReducer';
import type { Club, RootState } from '@/store/types';
import { router } from 'expo-router';

interface TierProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  limit: number;
}

export default function CreateClubView() {
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const tiers: TierProduct[] = [
    { 
      id: 'small_tier', 
      title: 'Small Club', 
      description: 'Up to 25 members', 
      price: '$4.99', 
      limit: 25 
    },
    { 
      id: 'medium_tier', 
      title: 'Medium Club', 
      description: 'Up to 50 members', 
      price: '$9.99', 
      limit: 50 
    },
    { 
      id: 'large_tier', 
      title: 'Large Club', 
      description: 'Up to 100 members', 
      price: '$19.99', 
      limit: 100 
    },
  ];

  // Validate form inputs
  useEffect(() => {
    setIsFormValid(name.length >= 6 && passcode.length >= 6);
  }, [name, passcode]);

  const handleCreateClub = async (tier: TierProduct) => {
    if (!isFormValid || !user) return;

    try {
      Alert.alert(
        'Confirm Club Creation',
        `Create "${name}" club with ${tier.title}?\n\nPrice: ${tier.price}`,
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Create',
            onPress: async () => {
              try {
                const newClub: Partial<Club> = {
                  name,
                  passcode,
                  superAdmin: user.id,
                  admins: [user.id],
                  birdieWeight: 65,
                  clubLimit: tier.limit,
                };

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

                const createdClub: Club = await response.json();
                dispatch(setSelectedClub(createdClub));
                
                Alert.alert(
                  'Success',
                  'Club created successfully!',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.push('/views/Club/ClubDetailedView')
                    }
                  ]
                );
              } catch (error) {
                Alert.alert('Error', 'Failed to create club. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create club. Please try again.');
    }
  };

  const renderTierOption = (tier: TierProduct) => (
    <TouchableOpacity
      key={tier.id}
      style={[
        styles.tierOption,
        !isFormValid && styles.disabledTier
      ]}
      onPress={() => handleCreateClub(tier)}
      disabled={!isFormValid}
    >
      <Text style={[
        styles.tierTitle,
        !isFormValid && styles.disabledText
      ]}>
        {tier.title}
      </Text>
      <Text style={[
        styles.tierDescription,
        !isFormValid && styles.disabledText
      ]}>
        {tier.description}
      </Text>
      <Text style={[
        styles.tierPrice,
        !isFormValid && styles.disabledText
      ]}>
        {tier.price}
      </Text>
      <Text style={[
        styles.selectText,
        !isFormValid && styles.disabledText
      ]}>
        Select & Create
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create New Club</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Club Name (min. 6 characters)"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Passcode (min. 6 characters)"
            value={passcode}
            onChangeText={setPasscode}
            placeholderTextColor="#666"
            secureTextEntry
          />

          <Text style={styles.sectionTitle}>Select Club Size</Text>
          
          <View style={styles.tiersContainer}>
            {tiers.map(renderTierOption)}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  tiersContainer: {
    marginBottom: 20,
  },
  tierOption: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  disabledTier: {
    opacity: 0.5,
    backgroundColor: '#e0e0e0',
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
    color: '#3b873e',
    marginTop: 5,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b873e',
    marginTop: 10,
    textAlign: 'center',
  },
  disabledText: {
    color: '#999',
  }
});
