import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  parseGameTypeParams,
  coerceNumberParam,
  clampNumber,
  deriveTeamNames,
  buildDeckIndices,
  initScoresMatrix,
  type GameParams
} from './helpers';

type Card = { name: string; description?: string; date?: string; };

type UseGameInitInput = {
  cards: Card[];
  defaultPlayers?: number;
  defaultDuration?: number;
};

export function useGameInit({ cards, defaultPlayers = 4, defaultDuration = 60 }: UseGameInitInput) {
  const [searchParams] = useSearchParams();

  const gameType = searchParams.get('gameType') as 'classic'|'chill'|'custom'|null;
  const gameTypeParams: GameParams = useMemo(() => parseGameTypeParams(gameType), [gameType]);

  const durationParam = coerceNumberParam(searchParams.get('duration'));
  const playersParam  = coerceNumberParam(searchParams.get('teams') ?? searchParams.get('players'));
  const nbCartesParam = coerceNumberParam(searchParams.get('nbCartes'));
  const teamNamesParam = searchParams.get('teamNames');

  const duration = useMemo(
    () => (durationParam ? clampNumber(durationParam, 1, 600) : defaultDuration),
    [durationParam, defaultDuration]
  );

  const players = useMemo(
    () => (playersParam ? clampNumber(playersParam, 2, 10) : defaultPlayers),
    [playersParam, defaultPlayers]
  );

  const teamNames = useMemo(
    () => deriveTeamNames(teamNamesParam, Math.max(2, players)),
    [teamNamesParam, players]
  );

  const deckIndices = useMemo(
    () => buildDeckIndices(cards.length, nbCartesParam, gameTypeParams.teams, players),
    [cards.length, nbCartesParam, gameTypeParams.teams, players]
  );

  const initialScores = useMemo(
    () => initScoresMatrix(3, Math.max(2, players)),
    [players]
  );

  return {
    gameType,
    gameTypeParams,
    duration,
    players,
    teamNames,
    deckIndices,
    initialScores,
  };
}