import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  deckIndices: number[];
  pendingIndices: number[];
  scoresByRound: number[][];
  currentPlayerIndex: number;
  currentRound: number;
  isRunning: boolean;
  showIntermission: boolean;
  showRoundRecap: boolean;
  showFinalRecap: boolean;
  showEndgame: boolean;
  remaining: number;
}

const initialState: GameState = {
  deckIndices: [],
  pendingIndices: [],
  scoresByRound: Array.from({ length: 3 }, () => []),
  currentPlayerIndex: 0,
  currentRound: 1,
  isRunning: true,
  showIntermission: false,
  showRoundRecap: false,
  showFinalRecap: false,
  showEndgame: false,
  remaining: 60,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setDeck(state, action: PayloadAction<number[]>) {
      state.deckIndices = action.payload;
      state.pendingIndices = action.payload.slice();
    },
    setPendingIndices(state, action: PayloadAction<number[]>) {
      state.pendingIndices = action.payload;
    },
    setScoresByRound(state, action: PayloadAction<number[][]>) {
      state.scoresByRound = action.payload;
    },
    setCurrentPlayerIndex(state, action: PayloadAction<number>) {
      state.currentPlayerIndex = action.payload;
    },
    setCurrentRound(state, action: PayloadAction<number>) {
      state.currentRound = action.payload;
    },
    setIsRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },
    setRemaining(state, action: PayloadAction<number>) {
      state.remaining = action.payload;
    },
    setShowIntermission(state, action: PayloadAction<boolean>) {
      state.showIntermission = action.payload;
    },
    setShowRoundRecap(state, action: PayloadAction<boolean>) {
      state.showRoundRecap = action.payload;
    },
    setShowFinalRecap(state, action: PayloadAction<boolean>) {
      state.showFinalRecap = action.payload;
    },
    setShowEndgame(state, action: PayloadAction<boolean>) {
      state.showEndgame = action.payload;
    },
    resetGame(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setDeck,
  setPendingIndices,
  setScoresByRound,
  setCurrentPlayerIndex,
  setCurrentRound,
  setIsRunning,
  setRemaining,
  setShowIntermission,
  setShowRoundRecap,
  setShowFinalRecap,
  setShowEndgame,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
