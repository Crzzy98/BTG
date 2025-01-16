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
    setClubs: (state:any, action: PayloadAction<Club[]>) => {
      state.clubs = action.payload;
    },
    addClub: (state:any, action: PayloadAction<Club>) => {
      state.clubs.push(action.payload);
    },
    updateClub: (state:any, action: PayloadAction<Club>) => {
      const index = state.clubs.findIndex((club:any) => club.id === action.payload.id);
      if (index !== -1) {
        state.clubs[index] = action.payload;
      }
    },
    deleteClub: (state:any, action: PayloadAction<string>) => {
      state.clubs = state.clubs.filter((club:any) => club.id !== action.payload);
    },
    setSelectedClub: (state:any, action: PayloadAction<Club | null>) => {
      state.selectedClub = action.payload;
    },
    addPlayerToClub: (state:any, action: PayloadAction<{ clubId: string; player: Player }>) => {
      const club = state.clubs.find((club:any) => club.id === action.payload.clubId);
      if (club) {
        if (!club.players) club.players = [];
        club.players.push(action.payload.player);
      }
    },
    setLoading: (state:any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state:any, action: PayloadAction<string | null>) => {
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
  setLoading,
  setError,
} = clubSlice.actions;
export default clubSlice.reducer;
