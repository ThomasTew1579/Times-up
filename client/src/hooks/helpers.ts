export type GameParams = {
  cardsCutom: boolean;
  duration: boolean;
  teams: boolean;
  nbCartes: boolean;
  namesParam: boolean;
};

export type Container = {
  schemaVersion: 1;
  sessionId: string;
  submissions: Array<{
    player: string;
    items: Array<{ name: string; description: string; date?: string }>;
  }>;
};

export function readContainerFromStorage(key: string): Container {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Container) : { schemaVersion: 1, sessionId: "", submissions: [] };
  } catch {
    return { schemaVersion: 1, sessionId: "", submissions: [] };
  }
}

export function parseGameTypeParams(gameType: 'classic'|'chill'|'custom'|null): GameParams {
  switch (gameType) {
    case 'classic': return { cardsCutom: false, duration: true,  teams: true,  nbCartes: true,  namesParam: true  };
    case 'chill':   return { cardsCutom: false, duration: false, teams: false, nbCartes: true,  namesParam: false };
    case 'custom':  return { cardsCutom: true,  duration: true,  teams: true,  nbCartes: false, namesParam: true  };
    default:        return { cardsCutom: false, duration: true,  teams: true,  nbCartes: true,  namesParam: true  };
  }
}

export function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function coerceNumberParam(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export function deriveTeamNames(raw: string | null, count: number): string[] {
  if (!raw) return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  const names = decodeURIComponent(raw).split('|').slice(0, count);
  return names.length ? names : Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
}

export function buildDeckIndices(total: number, requested: number | null, teams: boolean, players: number): number[] {
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

export function initScoresMatrix(rounds: number, players: number): number[][] {
  return Array.from({ length: rounds }, () => Array(players).fill(0));
}