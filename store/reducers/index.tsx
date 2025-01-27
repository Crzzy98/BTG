import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import clubReducer from './clubReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  user: userReducer,
  clubs: clubReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
