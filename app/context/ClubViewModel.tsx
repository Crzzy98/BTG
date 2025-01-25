import { useState } from 'react';
import { useClub } from './context'; // Assuming the path to the context file

export const ClubViewModel = () => {
  const { selectedClub, setSelectedClub, clubs, setClubs, refreshClubs } = useClub();
  const [error, setError] = useState<string | null>(null); // Add error state

  const leaveClubNetworkCall = async (clubId: string, userId: string, callback: (success: boolean) => void) => {
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        console.log(`Attempting to leave club with ID: ${clubId}, User ID: ${userId}`);
        // Simulate successful operation
        callback(true);
        setError(null); // Reset error on success
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error leaving club:', error);
      setError('Failed to leave club'); // Set error message
      callback(false);
    }
  };

  const joinClubNetworkCall = async (clubId: string, userId: string, callback: (success: boolean) => void) => {
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        console.log(`Attempting to join club with ID: ${clubId}, User ID: ${userId}`);
        // Simulate successful operation
        callback(true);
        setError(null); // Reset error on success
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error joining club:', error);
      setError('Failed to join club'); // Set error message
      callback(false);
    }
  };

  const deleteInviteForClubNetworkCall = async (clubId: string, userId: string, callback: (success: boolean) => void) => {
    try {
      // Simulate API call with timeout
      setTimeout(() => {
        console.log(`Attempting to delete invite for club with ID: ${clubId}, User ID: ${userId}`);
        // Simulate successful operation
        callback(true);
        setError(null); // Reset error on success
      }, 2000); // 2-second delay
    } catch (error) {
      console.error('Error deleting invite:', error);
      setError('Failed to delete invite'); // Set error message
      callback(false);
    }
  };

  return {
    selectedClub,
    setSelectedClub,
    clubs,
    setClubs,
    refreshClubs,
    leaveClubNetworkCall,
    joinClubNetworkCall,
    deleteInviteForClubNetworkCall,
    error, // Return the error state
  };
};
