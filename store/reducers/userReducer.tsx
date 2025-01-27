import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface UpdateHandicapPayload {
  userId: string;
  handicap: number;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    updateHandicap: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.handicap = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { 
  setUser, 
  updateHandicap, 
  setLoading, 
  setError, 
  logout 
} = userSlice.actions;

export default userSlice.reducer;