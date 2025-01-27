import  store  from './store';

export interface Player {
    id: string;
    name: string;
    // Add other player properties as needed
  }
  
  export interface Club {
    name: string;
    passcode:string;
    id?: string;
    superAdmin?: string;
    players?: Player[];
    admins?: string[] | null;
    birdieWeight?: number;
    clubLimit?: number;
    password?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
    isPro: boolean;
    clubs?: Club[];
    handicap: number;
    firstName: string;
    lastName: string;
  }
  

  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
  }
  
  // Root state type
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;

