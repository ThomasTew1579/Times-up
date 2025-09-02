import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import cardsList from '../assets/cards_list.json';
import GameCard from '../components/GameCard';
import IntermissionCard from '../components/IntermissionCard';
import GameHeader from '../components/GameHeader';
import GameControls from '../components/GameControls';
import Scoreboard from '../components/Scoreboard';
import RoundRecap from '../components/RoundRecap';
import FinalResults from '../components/FinalResults';
import { useGameInit } from '../hooks/useGameInit';
import { readContainerFromStorage } from '../hooks/helpers';

const CONTAINER_KEY = 'timesup:submissions';

function shuffle<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Game() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const container = readContainerFromStorage(CONTAINER_KEY);
  const customCards = container.submissions.flatMap((s) => s.items);
  const gameType = searchParams.get('gameType') as 'classic' | 'chill' | 'custom' | null;
  const currentCards = gameType === 'custom' ? customCards : cardsList;
  const cardsMemo = useMemo(() => currentCards, [currentCards]);
  const {
    gameTypeParams,
    duration: initDuration,
    players: initPlayers,
    teamNames: initTeamNames,
    deckIndices: initDeck,
    initialScores,
  } = useGameInit({ cards: cardsMemo, defaultPlayers: 4, defaultDuration: 60 });
  const [duration] = useState(initDuration);
  const [remaining, setRemaining] = useState(initDuration);
  const [players] = useState(initPlayers);
  const [teamNames] = useState(initTeamNames);
  const [scoresByRound, setScoresByRound] = useState<number[][]>(initialScores);
  const [pendingIndices, setPendingIndices] = useState<number[]>(initDeck);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRunning, setIsRunning] = useState(true);

  const [showIntermission, setShowIntermission] = useState(false);
  const [showEndgame, setShowEndgame] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showFinalRecap, setShowFinalRecap] = useState(false);
  const deckIndices = useMemo(() => {
    const total = cardsMemo.length;
    const requested = Number(searchParams.get('nbCartes'));
    const target = !Number.isNaN(requested) && requested > 0 ? Math.min(requested, total) : total;
    const equitable = gameTypeParams.teams
      ? Math.floor(target / Math.max(2, players)) * Math.max(2, players)
      : requested;
    const indices = Array.from({ length: total }, (_, i) => i);
    const shuffled = shuffle(indices);
    return shuffled.slice(0, equitable > 0 ? equitable : Math.max(2, players));
  }, [cardsMemo, players, searchParams, gameTypeParams.teams]);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, remaining]);

  function requeueCurrentCardAtRandom() {
    setPendingIndices((arr) => {
      if (arr.length <= 1) return arr;
      const current = arr[0];
      const rest = arr.slice(1);
      const n = rest.length;
      const insertIndex = 1 + Math.floor(Math.random() * n);
      return [...rest.slice(0, insertIndex), current, ...rest.slice(insertIndex)];
    });
  }

  useEffect(() => {
    if (remaining === 0 && isRunning) {
      setIsRunning(false);
      requeueCurrentCardAtRandom();
      setShowIntermission(true);
    }
  }, [remaining, isRunning]);

  useEffect(() => {
    if (!initialized) {
      setIsRunning(true);
      setInitialized(true);
    }
  }, [searchParams, deckIndices, initialized, players, scoresByRound.length]);

  const card = pendingIndices.length > 0 ? cardsMemo[pendingIndices[0]] : undefined;
  const totalCards = deckIndices.length;
  const validatedCount = totalCards - pendingIndices.length;
  const avancee = `${validatedCount}/${totalCards || '?'}`;

  function handleSkip() {
    if (pendingIndices.length <= 1) return;
    setPendingIndices((arr) => (arr.length <= 1 ? arr : [...arr.slice(1), arr[0]]));
  }

  function handleValidate() {
    setPendingIndices((arr) => (arr.length > 0 ? arr.slice(1) : arr));
    if (gameTypeParams.teams) {
      setScoresByRound((matrix) => {
        const copy = matrix.map((row) => row.slice());
        if (copy[currentRound - 1] && copy[currentRound - 1][currentPlayerIndex] != null) {
          copy[currentRound - 1][currentPlayerIndex] =
            (copy[currentRound - 1][currentPlayerIndex] || 0) + 1;
        }
        return copy;
      });
    } else {
      if (pendingIndices.length >= 2) {
        setShowIntermission(true);
      } else {
        setShowEndgame(true);
      }
    }
  }

  const [showRoundRecap, setShowRoundRecap] = useState(false);
  useEffect(() => {
    if (initialized && pendingIndices.length === 0) {
      setIsRunning(false);
      setShowIntermission(false);
      setShowRoundRecap(true);
    }
  }, [pendingIndices.length, initialized]);

  const finalRows = useMemo(() => {
    const rows = Array.from({ length: players }).map((_, idx) => {
      const r1 = scoresByRound[0]?.[idx] ?? 0;
      const r2 = scoresByRound[1]?.[idx] ?? 0;
      const r3 = scoresByRound[2]?.[idx] ?? 0;
      return { idx, r1, r2, r3, total: r1 + r2 + r3 };
    });
    rows.sort((a, b) => b.total - a.total);
    return rows;
  }, [players, scoresByRound]);
  const topTotal = finalRows[0]?.total ?? 0;
  return (
    <main className="mx-auto container max-w-3xl px-4 py-8">
      <GameHeader
        remaining={remaining}
        showTimer={gameTypeParams.duration}
        showTeams={gameTypeParams.teams}
        currentPlayerIndex={currentPlayerIndex}
        players={players}
        teamNames={teamNames}
        progress={avancee}
      />

      <section className="mb-6 flex justify-center">
        {card ? (
          <>
            <GameCard>
              <div className="text-2xl text-primary-900 text-center font-primary">{card.name}</div>
              <div className="desc text-xs">
                {card.description && <p className="text-white text-center">{card.description}</p>}
                {card.date && <p className=" text-white text-center">{card.date}</p>}
              </div>
            </GameCard>
          </>
        ) : (
          <div className="text-zinc-600 dark:text-zinc-300">Aucune carte disponible.</div>
        )}
      </section>

      <GameControls
        isRunning={isRunning}
        hasCard={!!card}
        showTeams={gameTypeParams.teams}
        currentRound={currentRound}
        currentPlayerIndex={currentPlayerIndex}
        scoresByRound={scoresByRound}
        onValidate={handleValidate}
        onSkip={handleSkip}
      />

      {showIntermission && (
        <IntermissionCard>
          <h2 className="text-xl font-semibold mb-2">
            {gameTypeParams.teams ? 'Équipes suivante' : 'Au suivant !'}
          </h2>
          {gameTypeParams.teams && (
            <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">
              {teamNames[(currentPlayerIndex + 1) % players] ??
                `Équipe ${((currentPlayerIndex + 1) % players) + 1}`}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <button
              className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => {
                setCurrentPlayerIndex((p) => (p + 1) % players);
                setRemaining(duration);
                setIsRunning(true);
                setShowIntermission(false);
              }}
            >
              Démarrer le tour
            </button>
          </div>
        </IntermissionCard>
      )}

      {gameTypeParams.teams && (
        <Scoreboard
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          teamNames={teamNames}
          scoresByRound={scoresByRound}
        />
      )}

      {showRoundRecap && gameTypeParams.teams && (
        <RoundRecap
          currentRound={currentRound}
          players={players}
          teamNames={teamNames}
          scoresByRound={scoresByRound}
          onNextRound={() => {
            setPendingIndices(shuffle(deckIndices));
            setCurrentRound((r) => r + 1);
            setRemaining(duration);
            setIsRunning(true);
            setShowRoundRecap(false);
            setShowIntermission(true);
          }}
          onShowFinalResults={() => {
            setShowRoundRecap(false);
            setShowFinalRecap(true);
          }}
        />
      )}
      {showFinalRecap && gameTypeParams.teams && (
        <FinalResults
          finalRows={finalRows}
          teamNames={teamNames}
          topTotal={topTotal}
          onPlayAgain={() => {
            setScoresByRound(Array.from({ length: 3 }, () => Array(players).fill(0)));
            setCurrentRound(1);
            setCurrentPlayerIndex(0);
            setPendingIndices(shuffle(deckIndices));
            setRemaining(duration);
            setIsRunning(true);
            setShowFinalRecap(false);
          }}
          onBackToHome={() => {
            setShowFinalRecap(false);
            navigate('/');
          }}
        />
      )}
      {showEndgame && (
        <IntermissionCard>
          <h2 className="text-xl font-semibold mb-2">Fin de la partie</h2>
          <div className="flex gap-2 justify-end">
            <button
              className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => {
                setPendingIndices(shuffle(deckIndices));
                setIsRunning(true);
                setShowEndgame(false);
              }}
            >
              Relancer une partie !
            </button>
            <button
              className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => {
                setShowEndgame(false);
                navigate('/');
              }}
            >
              Revenir au menu
            </button>
          </div>
        </IntermissionCard>
      )}
    </main>
  );
}

export default Game;
