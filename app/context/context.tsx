import React, { createContext, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, logout } from '../../store/reducers/authReducer';
import { RootState } from '../../store/types';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Round {
  id: string;
  playerID: string;
  score: number;
  birdies: number;
  datePlayed: string;
  eventId: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  members?: User[];
  foundedDate?: string;
  manager?: string;
  address?: string;
  isActive?: boolean;
  logoUrl?: string;
  registrationNumber?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

interface MainContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
  rounds: Round[];
  setRounds: (rounds: Round[]) => void;
  roundsLoaded: boolean;
  fetchRounds: () => Promise<void>;
  fetchClubScores: (clubId: string) => Promise<number[]>;
}

interface ClubContextType {
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  refreshClubs: () => Promise<void>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);
const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundsLoaded, setRoundsLoaded] = useState(false);

  const fetchRounds = async () => {
    try {
      setRoundsLoaded(false);
      // Replace with actual API call to fetch rounds
      const fetchedRounds: Round[] = [
        { 
          id: '1', 
          playerID: '123',
          score: 85, 
          birdies: 2,
          datePlayed: '2024-01-01',
          eventId: 'event1'
        },
        { 
          id: '2', 
          playerID: '123',
          score: 90, 
          birdies: 1,
          datePlayed: '2024-02-01',
          eventId: 'event2'
        },
      ];
      setRounds(fetchedRounds);
      setRoundsLoaded(true);
    } catch (error) {
      console.error('Error fetching rounds:', error);
    }
  };

  const fetchClubScores = async (clubId: string) => {
    try {
      // Replace with actual API call to fetch club scores
      const scores = [85, 90, 88];
      return scores;
    } catch (error) {
      console.error('Error fetching club scores:', error);
      return [];
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));
        await fetchRounds();
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeApp();
  }, [dispatch]);

  const value: MainContextType = {
    user,
    setUser: (user: User | null) => dispatch(setUser(user)),
    isAuthenticated,
    loading,
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    logout: () => dispatch(logout()),
    rounds,
    setRounds,
    roundsLoaded,
    fetchRounds,
    fetchClubScores,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);

  const refreshClubs = async () => {
    try {
      // Add your fetch logic here
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  useEffect(() => {
    refreshClubs();
  }, []);

  const value: ClubContextType = {
    selectedClub,
    setSelectedClub,
    clubs,
    setClubs,
    refreshClubs,
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
};

export const useMain = () => {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error('useMain must be used within a MainProvider');
  }
  return context;
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MainProvider>
      <ClubProvider>{children}</ClubProvider>
    </MainProvider>
  );
};

export { MainContext, ClubContext };
