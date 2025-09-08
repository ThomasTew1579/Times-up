import type { RootState } from './index';

export const selectSettings = (state: RootState) => state.settings;
export const selectGameType = (state: RootState) => state.settings.gameType;
export const selectDuration = (state: RootState) => state.settings.duration;
export const selectTeams = (state: RootState) => state.settings.teams;
export const selectTeamNames = (state: RootState) => state.settings.teamNames;
export const selectNbCartes = (state: RootState) => state.settings.nbCartes;
export const selectCustomCards = (state: RootState) => state.settings.customCards;

export const selectGame = (state: RootState) => state.game;
