import React from 'react';
import Icon from './Icon';

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
    <section className="flex flex-wrap justify-center items-center gap-2">
      {showTeams && (
        <div className="mr-auto text-sm text-zinc-600 dark:text-zinc-300">
          Score manche {currentRound} : {scoresByRound[currentRound - 1]?.[currentPlayerIndex] ?? 0}
        </div>
      )}
        {showTeams && (
          <button
            className="rounded-full border-white border-2 aspect-square text-white bg-red-500 px-3 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
            onClick={onSkip}
            disabled={!isRunning || !hasCard}
          >
            <Icon name="forward" size={20} className="fill-current " />
          </button>
        )}
      <button
        className="rounded-full border-white border-4 aspect-square bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        onClick={onValidate}
        disabled={!isRunning || !hasCard}
      >
         <Icon name="check" size={60} className="fill-current " />
      </button>
    </section>
  );
};

export default GameControls;
