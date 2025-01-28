import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { MainViewModel } from '../../context/MainViewModel';
import { Player, Club } from '../../../store/types';

interface DetailedPlayerViewProps {
  player: Player;
  club: Club;
}

export default function DetailedPlayerView({ 
    player, 
    club,
  }: DetailedPlayerViewProps){
  const viewModel = MainViewModel();
  const { rounds, loading } = viewModel;

  useEffect(() => {
    const loadPlayerRounds = async () => {
      try {
        await viewModel.fetchRounds(player.id);
      } catch (error) {
        console.error('Error loading rounds:', error);
        // Handle error appropriately
      }
    };

    loadPlayerRounds();
  }, [player.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading player details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Player Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.smallText}>Name</Text>
          <Text style={styles.boldText}>{player.name}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.smallText}>Weight</Text>
          <Text style={styles.boldText}>
            {player.getWeight?.(club)?.toFixed(2) ?? '0.00'}
          </Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.smallText}>Handicap</Text>
          <Text style={styles.boldText}>
            {player.handicap?.toString() ?? 'N/A'}
          </Text>
        </View>
      </View>

      {/* Rounds Section */}
      <View style={styles.roundsSection}>
        <Text style={styles.sectionTitle}>Recent Rounds</Text>
        {rounds.length > 0 ? (
          rounds.map((round) => (
            <View key={round.id} style={styles.roundItem}>
              <Text>Score: {round.score}</Text>
              <Text>Birdies: {round.birdies}</Text>
              <Text>Date: {new Date(round.datePlayed).toLocaleDateString()}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noRoundsText}>No rounds recorded</Text>
        )}
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBlock: {
    alignItems: 'center',
  },
  smallText: {
    fontSize: 12,
    color: '#666',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  roundsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roundItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noRoundsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
} as const;

// // If you need to handle round updates or deletions, you can add these methods:
// const handleUpdateRound = async (roundId: string, updatedData: Partial<Round>) => {
//   try {
//     await viewModel.updateRound(roundId, updatedData);
//   } catch (error) {
//     console.error('Error updating round:', error);
//     // Handle error appropriately
//   }
// };

// const handleDeleteRound = async (roundId: string) => {
//   try {
//     await viewModel.deleteRound(roundId);
//   } catch (error) {
//     console.error('Error deleting round:', error);
//     // Handle error appropriately
//   }
// };
