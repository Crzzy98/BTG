export interface Player {
    id: string;
    name: string;
    // Add other player properties as needed
  }
  
  export interface Club {
    name: string;
    id?: string;
    superAdmin?: string;
    players?: Player[];
    admins?: string[];
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
  }
  