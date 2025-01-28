import React, { createContext,useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading, logout } from '../../store/reducers/authReducer';
import { RootState } from '../../store/types';

interface User {
  id: string;
  name: string;
  email: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  members?: User[];
}

interface MainContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  setLoading: (value: boolean) => void;
  logout: () => void;
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

// Main Provider with Redux
export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));
        // Add your initialization logic here
        // Example: const userData = await checkAuthStatus();
        // dispatch(setUser(userData));
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeApp();
  }, [dispatch]);

  const value = {
    user,
    setUser: (user: User | null) => dispatch(setUser(user)),
    isAuthenticated,
    loading,
    setLoading: (value: boolean) => dispatch(setLoading(value)),
    logout: () => dispatch(logout()),
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

// Club Provider remains the same
export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);

  const refreshClubs = async () => {
    try {
      // Add your fetch logic here
      // const response = await fetch('your-api-endpoint');
      // const data = await response.json();
      // setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  useEffect(() => {
    refreshClubs();
  }, []);

  const value = {
    selectedClub,
    setSelectedClub,
    clubs,
    setClubs,
    refreshClubs,
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
};

// Custom hooks
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

// Combined provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MainProvider>
      <ClubProvider>{children}</ClubProvider>
    </MainProvider>
  );
};

export { MainContext, ClubContext };
