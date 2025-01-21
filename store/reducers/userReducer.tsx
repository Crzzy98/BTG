import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isPro: boolean;
  userName: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isPro: false,
  userName: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
      state.error = null;
    },
    setProStatus: (state, action: PayloadAction<boolean>) => {
      state.isPro = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.isPro = false;
      state.userName = null;
      state.error = null;
    },
  },
});

export const { 
  setUserName, 
  setProStatus, 
  setLoading, 
  setError, 
  logout 
} = userSlice.actions;

export default userSlice.reducer;
