import React, { createContext, useContext, useState, useEffect } from 'react';

// Context Types
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
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
}

interface ClubContextType {
  selectedClub: Club | null;
  setSelectedClub: (club: Club | null) => void;
  clubs: Club[];
  setClubs: React.Dispatch<React.SetStateAction<Club[]>>;
  refreshClubs: () => Promise<void>;
}

// Context Definitions
const MainContext = createContext<MainContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
  setLoading: () => {},
});

const ClubContext = createContext<ClubContextType>({
  selectedClub: null,
  setSelectedClub: () => {},
  clubs: [],
  setClubs: () => {},
  refreshClubs: async () => {},
});

// Provider components
export const MainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  //  Initialization logic 
  useEffect(() => {
    // Example: Check authentication status, fetch user data, etc.
    const initializeApp = async () => {
      try {
        // Add your initialization logic here
        // Example: const userData = await checkAuthStatus();
        // setUser(userData);
        // setIsAuthenticated(true);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);

  const refreshClubs = async () => {
    try {
      // Add your fetch logic here
      // Example:
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

// Custom hooks for using the contexts
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

// Combined provider for easier usage
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MainProvider>
      <ClubProvider>{children}</ClubProvider>
    </MainProvider>
  );
};

// Export contexts if needed directly
export { MainContext, ClubContext };
