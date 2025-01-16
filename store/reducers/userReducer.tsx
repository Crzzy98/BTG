import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Club } from '../types';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    updateProStatus: (state, action: PayloadAction<boolean>) => {
      if (state.currentUser) {
        state.currentUser.isPro = action.payload;
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, updateProStatus, logout } = userSlice.actions;
export default userSlice.reducer;
