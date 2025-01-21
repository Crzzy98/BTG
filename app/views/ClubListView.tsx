import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ImageBackground,
  Dimensions,
  Platform,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import PaywallView from '../view-components/PayWallView';

const { width } = Dimensions.get('window');

interface Club {
  id: string;
  name: string;
  isInvited: boolean;
  memberCount?: number;
  role?: string;
}

interface ClubListViewProps {
  player?: {
    clubs: Club[];
    clubInvites: Club[];
  };
  subscriptionTier?: {
    clubLimit: number;
  };
}

export default function ClubListView({ player, subscriptionTier }: ClubListViewProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const clubs = player?.clubs || [];
  const clubInvites = player?.clubInvites || [];
  const clubLimit = subscriptionTier?.clubLimit || 1;

  const onRefresh = async () => {
    setRefreshing(true);
    // Implement your refresh logic here
    // await refreshClubs();
    setRefreshing(false);
  };

  const handleClubPress = (club: Club) => {
    if (club.id === 'create') {
      if (clubs.length >= clubLimit) {
        setShowPaywall(true);
      } else {
        router.push('/views/CreateClubView');
      }
    } else {
      router.push({
        pathname: '/views/CreateClubView',
        params: { clubId: club.id }
      });
    }
  };

  const renderCreateClubButton = () => (
    <TouchableOpacity
      style={styles.createClubCard}
      onPress={() => handleClubPress({ id: 'create', name: 'Create Club', isInvited: false })}
    >
      <ImageBackground
        source={require('../../assets/images/GolfCourses/image0.imageset/the-16th-hole-at-recently-named-ireland-s-best-golf-course-the-golf-course-at-adare-manor-1654791803.jpg')}
        style={styles.cardBackground}
        imageStyle={styles.cardBackgroundImage}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.createClubText}>Create Club +</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderClubCard = ({ item }: { item: Club }) => (
    <TouchableOpacity
      style={styles.clubCard}
      onPress={() => handleClubPress(item)}
    >
      <ImageBackground
        source={require('../../assets/images/GolfCourses/image0.imageset/the-16th-hole-at-recently-named-ireland-s-best-golf-course-the-golf-course-at-adare-manor-1654791803.jpg')}
        style={styles.cardBackground}
        imageStyle={styles.cardBackgroundImage}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.clubName}>{item.name}</Text>
          {item.memberCount && (
            <Text style={styles.memberCount}>
              {item.memberCount} Members
            </Text>
          )}
          {item.role && (
            <View style={styles.roleTag}>
              <Text style={styles.roleText}>{item.role}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderInviteCard = ({ item }: { item: Club }) => (
    <TouchableOpacity
      style={styles.inviteCard}
      onPress={() => handleClubPress(item)}
    >
      <ImageBackground
        source={require('../../assets/images/GolfCourses/image0.imageset/the-16th-hole-at-recently-named-ireland-s-best-golf-course-the-golf-course-at-adare-manor-1654791803.jpg')}
        style={styles.cardBackground}
        imageStyle={styles.cardBackgroundImage}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.clubName}>{item.name}</Text>
          <Text style={styles.inviteText}>Club Invite</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      >
        {clubInvites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Club Invites</Text>
            <FlatList
              data={clubInvites}
              renderItem={renderInviteCard}
              keyExtractor={(item) => `invite-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Clubs</Text>
          {renderCreateClubButton()}
          <FlatList
            data={clubs}
            renderItem={renderClubCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      </ScrollView>

      {showPaywall && (
        <PaywallView
          onClose={() => setShowPaywall(false)}
          currentLimit={clubLimit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006400',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  horizontalList: {
    paddingRight: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  createClubCard: {
    width: width - 32,
    height: 150,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  clubCard: {
    width: (width - 48) / 2,
    height: 180,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  inviteCard: {
    width: 200,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  cardBackgroundImage: {
    resizeMode: 'cover',
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createClubText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  memberCount: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  roleTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#006400',
  },
  inviteText: {
    fontSize: 14,
    color: '#FFD700',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
