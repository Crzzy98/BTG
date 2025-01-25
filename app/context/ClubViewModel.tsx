import { useClub } from './context'; // Assuming the path to the context file

export const ClubViewModel = () => {
  const { selectedClub, setSelectedClub, clubs, setClubs, refreshClubs } = useClub();

  const leaveClubNetworkCall = async (clubId: string, userId: string, callback: (success: boolean) => void) => {
    try {
      // Example API call
      const response = await fetch(`your-api-endpoint/clubs/${clubId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to leave club');

      callback(true);
    } catch (error) {
      console.error('Error leaving club:', error);
      callback(false);
    }
  };

  const joinClubNetworkCall = async (clubId: string, userId: string, callback: (success: boolean) => void) => {
    try {
      // Example API call
      const response = await fetch(`your-api-endpoint/clubs/${clubId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to join club');

      callback(true);
    } catch (error) {
      console.error('Error joining club:', error);
      callback(false);
    }
  };

  const deleteInviteForClubNetworkCall = async (clubId: string, userId: string, callback: (success: boolean) => void) => {
    try {
      // Example API call
      const response = await fetch(`your-api-endpoint/clubs/${clubId}/invite`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to delete invite');

      callback(true);
    } catch (error) {
      console.error('Error deleting invite:', error);
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
  };
};
