import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type GameType = 'classic' | 'custom' | 'chill' | null;

export type CustomCard = { name: string; description?: string; date?: string };

export interface SettingsState {
  gameType: GameType;
  duration: number;
  teams: number;
  teamNames: string[];
  nbCartes: number;
  customCards: CustomCard[];
}

const initialState: SettingsState = {
  gameType: null,
  duration: 60,
  teams: 2,
  teamNames: ['Équipe 1', 'Équipe 2'],
  nbCartes: 40,
  customCards: [],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setGameType(state, action: PayloadAction<GameType>) {
      state.gameType = action.payload;
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    setTeams(state, action: PayloadAction<number>) {
      state.teams = action.payload;
      if (state.teamNames.length > state.teams) {
        state.teamNames = state.teamNames.slice(0, state.teams);
      } else {
        while (state.teamNames.length < state.teams) {
          state.teamNames.push(`Équipe ${state.teamNames.length + 1}`);
        }
      }
    },
    setTeamName(state, action: PayloadAction<{ index: number; name: string }>) {
      const { index, name } = action.payload;
      if (index >= 0 && index < state.teamNames.length) {
        state.teamNames[index] = name;
      }
    },
    setTeamNames(state, action: PayloadAction<string[]>) {
      state.teamNames = action.payload.slice(0, Math.max(2, state.teams));
      while (state.teamNames.length < state.teams) {
        state.teamNames.push(`Équipe ${state.teamNames.length + 1}`);
      }
    },
    setNbCartes(state, action: PayloadAction<number>) {
      state.nbCartes = action.payload;
    },
    setCustomCards(state, action: PayloadAction<CustomCard[]>) {
      state.customCards = action.payload ?? [];
    },
    resetSettings(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setGameType,
  setDuration,
  setTeams,
  setTeamName,
  setTeamNames,
  setNbCartes,
  setCustomCards,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
