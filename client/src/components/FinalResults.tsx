import React from 'react';

interface FinalResultRow {
  idx: number;
  r1: number;
  r2: number;
  r3: number;
  total: number;
}

interface FinalResultsProps {
  finalRows: FinalResultRow[];
  teamNames: string[];
  topTotal: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

const FinalResults: React.FC<FinalResultsProps> = ({
  finalRows,
  teamNames,
  topTotal,
  onPlayAgain,
  onBackToHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur px-4">
      <div className="w-full max-w-xl rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Résultats finaux</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-600 dark:text-zinc-300">
                <th className="py-1 pr-3">
                  {teamNames.length > 0 && teamNames[0].includes('Joueur') ? 'Joueur' : 'Équipe'}
                </th>
                <th className="py-1 pr-3">R1</th>
                <th className="py-1 pr-3">R2</th>
                <th className="py-1 pr-3">R3</th>
                <th className="py-1 pr-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {finalRows.map(({ idx, r1, r2, r3, total }) => (
                <tr key={idx} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-1 pr-3">
                    {teamNames[idx] ??
                      (teamNames.length > 0 && teamNames[0].includes('Joueur')
                        ? `Joueur ${idx + 1}`
                        : `Équipe ${idx + 1}`)}
                    {total === topTotal && total > 0 && (
                      <span className="ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-emerald-600 text-white">
                        Vainqueur
                      </span>
                    )}
                  </td>
                  <td className="py-1 pr-3">{r1}</td>
                  <td className="py-1 pr-3">{r2}</td>
                  <td className="py-1 pr-3">{r3}</td>
                  <td className="py-1 pr-3 font-medium">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
            onClick={onPlayAgain}
          >
            Rejouer
          </button>
          <button
            className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
            onClick={onBackToHome}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalResults;
