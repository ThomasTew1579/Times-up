import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  parseGameTypeParams,
  coerceNumberParam,
  clampNumber,
  deriveTeamNames,
  buildDeckIndices,
  initScoresMatrix,
  type GameParams,
} from './helpers';

/**
 * Carte jouable (source: JSON statique ou cartes custom saisies par les joueurs).
 */
type Card = { name: string; description?: string; date?: string };

/**
 * Paramètres d'entrée pour initialiser la partie via l'URL.
 *
 * @property cards            Liste effective des cartes (déjà choisie: custom vs statique).
 * @property defaultPlayers   Valeur par défaut si aucun param valide n’est fourni (min conseillé: 2). Défaut: 4.
 * @property defaultDuration  Durée par défaut (secondes) si aucun param valide n’est fourni. Défaut: 60.
 */
type UseGameInitInput = {
  cards: Card[];
  defaultPlayers?: number;
  defaultDuration?: number;
};


/**
 * Hook d'initialisation de partie basé sur les query params.
 *
 * Lit et interprète:
 * - `gameType` ∈ {"classic","chill","custom"} → flags {@link GameParams}
 * - `duration` (secondes) → bornée à [1, 600]
 * - `teams` ou `players` (entier) → borné à [2, 10]
 * - `nbCartes` (entier) → plafonné à `cards.length`, arrondi équitable par équipes si `teams=true`
 * - `namesParam` (ou `teamNames` si tu modifies) → noms d’équipe encodés et séparés par "|"
 *
 * Ne lance **pas** le timer, ne gère **pas** la progression du jeu: ce hook ne fait que **fournir
 * des valeurs initiales et dérivées** prêtes à être utilisées pour amorcer une partie.
 *
 * ### Réactivité
 * - Recalcule quand les `searchParams` changent (via `useSearchParams`) ou lorsque `cards.length` / `players` évoluent.
 * - `deckIndices` est mélangé (Fisher–Yates) et tronqué en respectant l’équité par équipes.
 *
 * ### Contrats
 * - `players` est **au minimum 2** (équipes/joueurs).
 * - `duration` est bornée à [1, 600] secondes.
 * - `initialScores` est une matrice `3 × max(2, players)` remplie de 0.
 *
 * @param input Voir {@link UseGameInitInput}.
 * @returns Objet de valeurs initiales:
 *  - `gameType` : type brut de l’URL
 *  - `gameTypeParams` : flags dérivés du type
 *  - `duration` : durée effective en secondes
 *  - `players` : nombre de joueurs/équipes
 *  - `teamNames` : noms d’équipes (dérivés ou par défaut "Équipe 1..N")
 *  - `deckIndices` : indices de cartes mélangés et ajustés
 *  - `initialScores` : matrice de scores initialisée
 *
 * @example
 * const {
 *   gameTypeParams, duration, players, teamNames, deckIndices, initialScores
 * } = useGameInit({ cards, defaultPlayers: 4, defaultDuration: 60 });
 *
 * // Puis dans ton composant:
 * const [remaining, setRemaining] = useState(duration);
 * const [scores, setScores] = useState(initialScores);
 * const [pending, setPending] = useState(deckIndices);
 */
export function useGameInit({ cards, defaultPlayers = 4, defaultDuration = 60 }: UseGameInitInput) {
  const [searchParams] = useSearchParams();

  const gameType = searchParams.get('gameType') as 'classic' | 'chill' | 'custom' | null;
  const gameTypeParams: GameParams = useMemo(() => parseGameTypeParams(gameType), [gameType]);

  const durationParam = coerceNumberParam(searchParams.get('duration'));
  const playersParam = coerceNumberParam(searchParams.get('teams') ?? searchParams.get('players'));
  const nbCartesParam = coerceNumberParam(searchParams.get('nbCartes'));
  const teamNamesParam = searchParams.get('namesParam');

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

  const initialScores = useMemo(() => initScoresMatrix(3, Math.max(2, players)), [players]);

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
