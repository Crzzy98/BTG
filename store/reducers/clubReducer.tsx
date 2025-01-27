// store/reducers/clubReducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Club, Player } from '../types';

interface ClubState {
  clubs: Club[];
  selectedClub: Club | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClubState = {
  clubs: [],
  selectedClub: null,
  loading: false,
  error: null,
};

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    setClubs: (state, action: PayloadAction<Club[]>) => {
      state.clubs = action.payload;
    },
    addClub: (state, action: PayloadAction<Club>) => {
      state.clubs.push({
        ...action.payload,
        players: action.payload.players || [],
        admins: action.payload.admins || [],
        birdieWeight: action.payload.birdieWeight || 65,
        clubLimit: action.payload.clubLimit || 25,
      });
    },
    updateClub: (state, action: PayloadAction<Club>) => {
      const index = state.clubs.findIndex(club => club.id === action.payload.id);
      if (index !== -1) {
        state.clubs[index] = {
          ...state.clubs[index],
          ...action.payload,
        };
      }
    },
    deleteClub: (state, action: PayloadAction<string>) => {
      state.clubs = state.clubs.filter(club => club.id !== action.payload);
    },
    setSelectedClub: (state, action: PayloadAction<Club | null>) => {
      state.selectedClub = action.payload;
    },
    addPlayerToClub: (state, action: PayloadAction<{ clubId: string; player: Player }>) => {
      const club = state.clubs.find(club => club.id === action.payload.clubId);
      if (club) {
        if (!club.players) club.players = [];
        club.players.push(action.payload.player);
      }
    },
    addAdminToClub: (state, action: PayloadAction<{ clubId: string; adminId: string }>) => {
      const club = state.clubs.find(club => club.id === action.payload.clubId);
      if (club) {
        if (!club.admins) club.admins = [];
        if (!club.admins.includes(action.payload.adminId)) {
          club.admins.push(action.payload.adminId);
        }
      }
    },
    updateClubSettings: (state, action: PayloadAction<{ 
      clubId: string; 
      birdieWeight?: number;
      clubLimit?: number;
      passcode?: string;
    }>) => {
      const club = state.clubs.find(club => club.id === action.payload.clubId);
      if (club) {
        if (action.payload.birdieWeight !== undefined) {
          club.birdieWeight = action.payload.birdieWeight;
        }
        if (action.payload.clubLimit !== undefined) {
          club.clubLimit = action.payload.clubLimit;
        }
        if (action.payload.passcode !== undefined) {
          club.passcode = action.payload.passcode;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setClubs,
  addClub,
  updateClub,
  deleteClub,
  setSelectedClub,
  addPlayerToClub,
  addAdminToClub,
  updateClubSettings,
  setLoading,
  setError,
} = clubSlice.actions;

export default clubSlice.reducer;
