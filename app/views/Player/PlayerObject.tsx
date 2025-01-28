export interface Player {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
    getWeights?: () => any; // Optional if not all players need this
    clubId?: string;
    handicap?: number;
    profileImage?: string;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    role?: 'member' | 'admin' | 'guest';
}

export interface PlayerStats {
    averageScore?: number;
    totalRounds?: number;
    bestScore?: number;
    handicapHistory?: Array<{
        value: number;
        date: string;
    }>;
}

export interface PlayerPreferences {
    notifications?: boolean;
    privacy?: {
        showEmail?: boolean;
        showStats?: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
}
