import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChillGameSetup() {
  const navigate = useNavigate();
  const [nbCartes, setNbCartes] = useState<number>(60);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/game/chill?&nbCartes=${nbCartes}`);
  }

  return (
    <main className="mx-auto container max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold font-secondary text-center text-white mb-6">
        Mode chill - Configuration
      </h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="nbCartes" className="block text-sm font-medium text-white font-primary">
            Nombre de cartes
          </label>
          <input
            id="nbCartes"
            type="number"
            min={2}
            max={500}
            step={2}
            value={nbCartes}
            onChange={(e) => setNbCartes(Math.max(2, Number(e.target.value)))}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:text-white dark:bg-primary-900 px-3 py-2 text-sm"
          />
          <div className="text-sm text-white">
            {nbCartes} cartes (seront arrondies pour être réparties uniformément)
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Démarrer le jeu
          </button>
        </div>
      </form>
    </main>
  );
}

export default ChillGameSetup;
