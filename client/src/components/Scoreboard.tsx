import React from 'react';

interface ScoreboardProps {
  players: number;
  currentPlayerIndex: number;
  teamNames: string[];
  scoresByRound: number[][];
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  currentPlayerIndex,
  teamNames,
  scoresByRound,
}) => {
  return (
    <div className="fixed bottom-0 left-0 p-4 z-40 w-full">
      <div className="mx-auto max-w-3xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
        {Array.from({ length: players }).map((_, idx) => (
          <div
            key={idx}
            className={`rounded-md pt-1 text-sm border ${
              idx === currentPlayerIndex
                ? 'bg-secondary-500 border-primary-900 text-primary-900'
                : 'bg-primary-900 text-white border-white'
            }`}
          >
            <div className="text-xs flex px-2 justify-between">
              {teamNames[idx] ??
                (teamNames.length > 0 && teamNames[0].includes('Joueur')
                  ? `Joueur ${idx + 1}`
                  : `Équipe ${idx + 1}`)}
              <div>
                Total :{' '}
                {(scoresByRound[0]?.[idx] ?? 0) +
                  (scoresByRound[1]?.[idx] ?? 0) +
                  (scoresByRound[2]?.[idx] ?? 0)}
              </div>
            </div>
            <div className="text-current grid grid-cols-3 *:text-center border-t border-current ">
              <span className="border-r">{scoresByRound[0]?.[idx] ?? 0}</span>
              <span className="border-r">{scoresByRound[1]?.[idx] ?? 0}</span>
              <span>{scoresByRound[2]?.[idx] ?? 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scoreboard;
