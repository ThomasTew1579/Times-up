/**
 * Paramétrage dérivé du type de partie (URL ou configuration).
 *
 * @property cardsCutom  Indique si l'on utilise des cartes "custom" (issues des soumissions joueurs)
 *                       plutôt que la liste statique. ⚠️ Nom laissé tel quel pour compatibilité
 *                       (probable faute de frappe de "cardsCustom").
 * @property duration    Active/désactive l'usage d'un timer (affichage + logique).
 * @property teams       Active le mode équipes (scoreboard, rotation d'équipe, équité du deck).
 * @property nbCartes    Autorise la prise en compte du paramètre `nbCartes` (nombre de cartes).
 * @property namesParam  Autorise la prise en compte du paramètre `namesParam` (noms d'équipes).
 */
export type GameParams = {
  cardsCutom: boolean;
  duration: boolean;
  teams: boolean;
  nbCartes: boolean;
  namesParam: boolean;
};

/**
 * Conteneur persistant (localStorage) pour les soumissions de cartes par joueur.
 *
 * @property schemaVersion  Version du schéma (actuellement fixée à 1).
 * @property sessionId      Identifiant logique de session (libre d'usage).
 * @property submissions    Liste des soumissions par joueur.
 *
 * Exemple de structure :
 * {
 *   "schemaVersion": 1,
 *   "sessionId": "abc123",
 *   "submissions": [
 *     {
 *       "player": "Équipe 1",
 *       "items": [
 *         { "name": "Einstein", "description": "Physicien", "date": "1879" },
 *         { "name": "Pavarotti", "description": "Ténor" }
 *       ]
 *     }
 *   ]
 * }
 */
export type Container = {
  schemaVersion: 1;
  sessionId: string;
  submissions: Array<{
    player: string;
    items: Array<{ name: string; description: string; date?: string }>;
  }>;
};

/**
 * Lit un conteneur JSON depuis le localStorage et renvoie une valeur sûre par défaut en cas d'erreur.
 *
 * - Ne lève pas d'exception : toute erreur de parsing ou clé absente renvoie un conteneur vide.
 * - Sans effet de bord autre que l'accès lecture au localStorage.
 *
 * @param key Clé du localStorage sous laquelle est sérialisé le conteneur.
 * @returns   Un objet `Container` valide.
 *
 * @example
 * const container = readContainerFromStorage('timesup:submissions');
 * const allItems = container.submissions.flatMap(s => s.items);
 */
export function readContainerFromStorage(key: string): Container {
  try {
    const raw = localStorage.getItem(key);
    return raw
      ? (JSON.parse(raw) as Container)
      : { schemaVersion: 1, sessionId: '', submissions: [] };
  } catch {
    return { schemaVersion: 1, sessionId: '', submissions: [] };
  }
}


/**
 * Convertit un type de partie logique (`classic`, `chill`, `custom`) en flags `GameParams`.
 *
 * Règles :
 * - classic : cartes statiques, timer ON, équipes ON, nbCartes ON, namesParam ON
 * - chill   : cartes statiques, timer OFF, équipes OFF, nbCartes ON, namesParam OFF
 * - custom  : cartes custom,  timer ON, équipes ON,  nbCartes OFF, namesParam ON
 * - défaut  : identique à classic
 *
 * @param gameType Type de partie issu des query params ou null.
 * @returns        Les flags `GameParams` correspondants.
 *
 * @example
 * const p = parseGameTypeParams('chill'); // -> { cardsCutom:false, duration:false, teams:false, ... }
 */
export function parseGameTypeParams(gameType: 'classic' | 'chill' | 'custom' | null): GameParams {
  switch (gameType) {
    case 'classic':
      return { cardsCutom: false, duration: true, teams: true, nbCartes: true, namesParam: true };
    case 'chill':
      return {
        cardsCutom: false,
        duration: false,
        teams: false,
        nbCartes: true,
        namesParam: false,
      };
    case 'custom':
      return { cardsCutom: true, duration: true, teams: true, nbCartes: false, namesParam: true };
    default:
      return { cardsCutom: false, duration: true, teams: true, nbCartes: true, namesParam: true };
  }
}

/**
 * Contraint un nombre dans l'intervalle [min, max].
 *
 * @param n   Valeur à contraindre.
 * @param min Borne inférieure.
 * @param max Borne supérieure.
 * @returns   n recadré entre min et max.
 *
 * @example
 * clampNumber(12, 1, 10); // 10
 */
export function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Convertit une chaîne (souvent issue d'un query param) en nombre, ou `null` si invalide.
 *
 * - Gère `null` d'entrée.
 * - Retourne `null` si `Number(v)` est NaN.
 *
 * @param v Chaîne potentiellement numérique (ex. "60", "004", "3.14", null).
 * @returns Un nombre ou `null`.
 *
 * @example
 * coerceNumberParam("08")   // 8
 * coerceNumberParam("abc")  // null
 * coerceNumberParam(null)   // null
 */
export function coerceNumberParam(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}


/**
 * Construit une liste de noms d'équipe à partir d'une chaîne encodée (séparateur "|"),
 * ou génère des noms par défaut si absent/vide.
 *
 * - `raw` est d'abord décodé via `decodeURIComponent`.
 * - La liste est tronquée à `count`.
 * - Si la liste est vide après parsing, on génère "Équipe 1..N".
 *
 * @param raw   Chaîne encodée (ex. "Rouge|Bleu|Vert") ou null.
 * @param count Nombre d'équipes attendu (min 2 typiquement).
 * @returns     Tableau de noms d'équipes de longueur `count`.
 *
 * @example
 * deriveTeamNames("Alpha%7CBeta", 3) // ["Alpha","Beta","Équipe 3"]
 */
export function deriveTeamNames(raw: string | null, count: number): string[] {
  if (!raw) return Array.from({ length: count }, (_, i) => `Équipe ${i + 1}`);
  const names = decodeURIComponent(raw).split('|').slice(0, count);
  return names.length ? names : Array.from({ length: count }, (_, i) => `Équipe ${i + 1}`);
}

/**
 * Construit un sous-ensemble d'indices de cartes, mélangé, en respectant éventuellement une
 * contrainte d'équité par équipes :
 *
 * - `requested` : nombre de cartes souhaité (optionnel) — plafonné à `total`.
 * - Si `teams === true`, on arrondit le nombre final au multiple de `max(2, players)` (équité).
 * - Retourne au minimum `max(2, players)` cartes si le calcul donne 0.
 * - Mélange via Fisher-Yates (O(total)).
 *
 * @param total     Nombre total de cartes disponibles.
 * @param requested Nombre souhaité (peut être null).
 * @param teams     Mode équipes (équité activée).
 * @param players   Nombre de joueurs/équipes (min 2).
 * @returns         Tableau d'indices uniques, mélangés.
 *
 * @example
 * // total=100, requested=25, teams=true, players=4 -> 24 indices (multiple de 4)
 * const deck = buildDeckIndices(100, 25, true, 4);
 */
export function buildDeckIndices(
  total: number,
  requested: number | null,
  teams: boolean,
  players: number
): number[] {
  const target = requested && requested > 0 ? Math.min(requested, total) : total;
  const teamBase = Math.max(2, players);
  const equitable = teams ? Math.floor(target / teamBase) * teamBase : target;

  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, equitable > 0 ? equitable : teamBase);
}

/**
 * Initialise une matrice de scores (rounds × players) remplie de 0.
 *
 * @param rounds  Nombre de manches/rounds (ex. 3).
 * @param players Nombre de joueurs/équipes.
 * @returns       number[rounds][players] initialisée à 0.
 *
 * @example
 * initScoresMatrix(3, 4) // [[0,0,0,0],[0,0,0,0],[0,0,0,0]]
 */
export function initScoresMatrix(rounds: number, players: number): number[][] {
  return Array.from({ length: rounds }, () => Array(players).fill(0));
}

/**
 * Arrondit vers le bas (−∞) au multiple de `step` le plus proche (en valeur absolue).
 *
 * - Supporte les `step` négatifs (utilise |step|).
 * - Si `step === 0`, renvoie `value` (comportement neutre).
 * - Comportement sur nombres négatifs : suit `Math.floor`, donc `floorToMultiple(-5, 4) === -8`.
 *
 * @param value Valeur d'entrée.
 * @param step  Pas/multiple (≠ 0 recommandé).
 * @returns     Plus grand multiple de `step` ≤ `value`.
 *
 * @example
 * floorToMultiple(53, 8);   // 48
 * floorToMultiple(16, 8);   // 16
 * floorToMultiple(-5, 4);   // -8
 *
 * @remarks
 * Pour obtenir le multiple strictement inférieur (si la valeur est déjà multiple),
 * créez une variante : `r === value ? r - Math.abs(step) : r`.
 */
export function floorToMultiple(value: number, step: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(step)) {
    throw new TypeError("value et step doivent être des nombres finis");
  }
  if (step === 0) return value; 
  const m = Math.abs(step);     
  return Math.floor(value / m) * m;
}
