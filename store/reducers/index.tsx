import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import clubReducer from './clubReducer';

const rootReducer = combineReducers({
  user: userReducer,
  clubs: clubReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
