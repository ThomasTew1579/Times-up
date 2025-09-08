import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import gameReducer from './gameSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    game: gameReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
