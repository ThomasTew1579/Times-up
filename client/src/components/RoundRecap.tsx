import React from 'react';

interface RoundRecapProps {
  currentRound: number;
  players: number;
  teamNames: string[];
  scoresByRound: number[][];
  onNextRound: () => void;
  onShowFinalResults: () => void;
}

const RoundRecap: React.FC<RoundRecapProps> = ({
  currentRound,
  players,
  teamNames,
  scoresByRound,
  onNextRound,
  onShowFinalResults,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur px-4">
      <div className="w-full max-w-lg rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif de la manche {currentRound}</h2>
        <div className="space-y-2 mb-4">
          {Array.from({ length: players }).map((_, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {teamNames[idx] ??
                  (teamNames.length > 0 && teamNames[0].includes('Joueur')
                    ? `Joueur ${idx + 1}`
                    : `Équipe ${idx + 1}`)}
              </span>
              <span>{scoresByRound[currentRound - 1]?.[idx] ?? 0} validées</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          {currentRound < 3 ? (
            <button
              className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={onNextRound}
            >
              Tour suivant
            </button>
          ) : (
            <button
              className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={onShowFinalResults}
            >
              Voir les résultats
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundRecap;
