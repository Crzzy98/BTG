import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import { useNavigation } from 'expo-router';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../constants/types';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'clubListView'>;
import PaywallView from '../view-components/PayWallView';

interface Club {
  id: string;
  name: string;
  isInvited: boolean;
}

interface Props {
  player: {
    clubs: Club[];
    clubInvites: Club[];
  };
  subscriptionTier: {
    clubLimit: number;
  };
}

//Finish prop config
// const ClubListView = ({ player, subscriptionTier}: {
export const ClubListView = () => {
  const [showJoinClubView, setShowJoinClubView] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const [isPro, setIsPro] = useState(false);

  const slideAnim = new Animated.Value(1000); // Start from below the screen

  useEffect(() => {
    if (!isPro) {
      // Slide up animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8
      }).start();
    }
  }, [isPro]);

  const renderClubRow = (club: Club, isNavigable: boolean) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => {
        if (isNavigable) {
          navigation.navigate('clubDetailedView', { club });
        }
      }}
    >
      <Text style={styles.clubName}>{club.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          data={[
            { id: 'create', name: 'Create Club +', isInvited: false },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item.id === 'create' ? (
              <TouchableOpacity
                style={styles.createClubCard}
                onPress={() => navigation.navigate('createClubView')}
              >
                <Text style={styles.createClubText}>Create Club +</Text>
              </TouchableOpacity>
            ) : (
              renderClubRow(item, item.isInvited)
            )
          }
        />
      </ScrollView>

      {/* Paywall Overlay */}
      {!isPro && (
        <Animated.View
          style={[
            styles.paywallContainer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <PaywallView />
        </Animated.View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006400',
    padding: 10,
  },
  paywallContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%', // Adjust this value to control how much of the screen the paywall covers
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  createClubCard: {
    flex: 1,
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  createClubText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clubCard: {
    flex: 1,
    height: 200,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 20,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClubListView;
