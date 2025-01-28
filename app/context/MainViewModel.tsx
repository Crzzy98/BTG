import { useMain } from './context';

// Define interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
}

interface Round {
  id: string;
  playerID: string;
  score: number;
  birdies: number;
  datePlayed: string;
  eventId: string;
}

export const MainViewModel = () => {
  const { 
    user, 
    setUser, 
    isAuthenticated, 
    loading, 
    setLoading,
    rounds,
    setRounds
  } = useMain();

  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('your-api-endpoint/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setRounds([]); // Clear rounds on logout
  };

  const getPlayer = async (userId: string, callback: () => void) => {
    try {
      setLoading(true);
      const response = await fetch(`your-api-endpoint/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const userData = await response.json();
      setUser(userData);
      callback();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchRounds = async (userId?: string) => {
    try {
      setLoading(true);
      const endpoint = userId 
        ? `your-api-endpoint/rounds/${userId}`
        : 'your-api-endpoint/rounds';
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch rounds');
      
      const roundsData: Round[] = await response.json();
      setRounds(roundsData);
    } catch (error) {
      console.error('Error fetching rounds:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addRound = async (roundData: Omit<Round, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch('your-api-endpoint/rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roundData),
      });
      if (!response.ok) throw new Error('Failed to add round');
      
      const newRound: Round = await response.json();
      const updatedRounds = [...rounds, newRound];
      setRounds(updatedRounds);
      return newRound;
    } catch (error) {
      console.error('Error adding round:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRound = async (roundId: string, roundData: Partial<Round>) => {
    try {
      setLoading(true);
      const response = await fetch(`your-api-endpoint/rounds/${roundId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roundData),
      });
      if (!response.ok) throw new Error('Failed to update round');
      
      const updatedRound: Round = await response.json();
      const updatedRounds = rounds.map(round => 
        round.id === roundId ? updatedRound : round
      );
      setRounds(updatedRounds);
      return updatedRound;
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRound = async (roundId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`your-api-endpoint/rounds/${roundId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete round');
      
      const updatedRounds = rounds.filter(round => round.id !== roundId);
      setRounds(updatedRounds);
    } catch (error) {
      console.error('Error deleting round:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    loading,
    rounds,

    // User operations
    loginUser,
    logoutUser,
    getPlayer,

    // Round operations
    fetchRounds,
    addRound,
    updateRound,
    deleteRound,
  };
};
