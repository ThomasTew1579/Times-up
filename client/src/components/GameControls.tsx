import React from 'react';

interface GameControlsProps {
  isRunning: boolean;
  hasCard: boolean;
  showTeams: boolean;
  currentRound: number;
  currentPlayerIndex: number;
  scoresByRound: number[][];
  onValidate: () => void;
  onSkip: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isRunning,
  hasCard,
  showTeams,
  currentRound,
  currentPlayerIndex,
  scoresByRound,
  onValidate,
  onSkip,
}) => {
  return (
    <section className="flex flex-wrap items-center gap-2">
      <button
        className="rounded-md bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        onClick={onValidate}
        disabled={!isRunning || !hasCard}
      >
        Valider
      </button>
      {showTeams && (
        <button
          className="rounded-md text-white bg-red-500 px-3 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
          onClick={onSkip}
          disabled={!isRunning || !hasCard}
        >
          Skip
        </button>
      )}
      {showTeams && (
        <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-300">
          Round {currentRound} score: {scoresByRound[currentRound - 1]?.[currentPlayerIndex] ?? 0}
        </div>
      )}
    </section>
  );
};

export default GameControls;
