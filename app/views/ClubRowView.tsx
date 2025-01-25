import React from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MainViewModel as useMainViewModel } from '../context/MainViewModel'; // Assuming context is used
import { ClubViewModel as useClubViewModel } from '../context/ClubViewModel'; // Assuming context is used

interface Club {
  id: string;
  name: string;
}

interface ClubRowViewProps {
  club: Club;
  isInvited: boolean;
}

const ClubRowView: React.FC<ClubRowViewProps> = ({ club, isInvited }) => {
  const vm = useMainViewModel(); // Provides main app state and actions
  const clubvm = useClubViewModel(); // Provides club-related actions and state

  const showLeaveAlert = () => {
    Alert.alert(
      'Leave Club?',
      'Are you sure you want to leave the club? You will have to be invited back to join.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            if (club.id) {
              clubvm.leaveClubNetworkCall(club.id, vm.user?.id ?? '', (success: any) => {
                if (success) {
                  vm.getPlayer(vm.user?.id ?? '', () => {});
                }
              });
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDecline = () => {
    if (club.id) {
      clubvm.deleteInviteForClubNetworkCall(club.id, vm.user?.id ?? '', (success: any) => {
        vm.getPlayer(vm.user?.id ?? '', () => {});
      });
    }
  };

  const handleJoin = () => {
    if (club.id) {
      clubvm.joinClubNetworkCall(club.id, vm.user?.id ?? '', (success: any) => {
        vm.getPlayer(vm.user?.id ?? '', () => {});
      });
    }
  };

  const renderContent = () => {
    if (isInvited) {
      return (
        <View style={styles.invitedContainer}>
          {clubvm.error ? (
            <Text style={styles.errorText}>{clubvm.error}</Text>
          ) : (
            <Text style={styles.invitedText}>
              You have been invited to join {club.name}. Do you want to join?
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleDecline} style={[styles.button, { backgroundColor: 'red' }]}>
              <Text style={styles.buttonText}>DECLINE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleJoin} style={[styles.button, { backgroundColor: 'green' }]}>
              <Text style={styles.buttonText}>JOIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.limitedContainer}>
          <Text style={styles.limitText}>
            You are already a member of this club. If you want to leave, click below.
          </Text>
          <TouchableOpacity onPress={showLeaveAlert} style={[styles.button, { backgroundColor: 'red' }]}>
            <Text style={styles.buttonText}>LEAVE</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: `https://example.com/image${Math.floor(Math.random() * 6)}.png` }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      <Text style={styles.clubName}>{club.name}</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  clubName: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  invitedContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    textAlign: 'center',
  },
  invitedText: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  limitedContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  limitText: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ClubRowView;
