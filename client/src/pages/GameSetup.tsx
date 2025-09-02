import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IntermissionCard from '../components/IntermissionCard';
import ClassicRules from '../components/ClassicRules';
import Dropdown from '../components/Dropdown';


type GameParams = {
  rules: boolean;
  duration: boolean;
  teams: boolean;
  cardsCutom: boolean;
  nbCartes: boolean;
  namesParam: boolean;
};

const CONTAINER_KEY = 'timesup:submissions';

function GameSetup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [duration, setDuration] = useState<number>(45);
  const [teams, setTeams] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['Équipes 1', 'Équipes 2']);
  const [nbCartes, setNbCartes] = useState<number>(40);
  const [showIntermission, setShowIntermission] = useState<boolean>(false);
  const gameType = searchParams.get('gameType');

  const gameTypeParams: GameParams = useMemo(() => {
    switch (gameType) {
      case 'classic':
        return {
          rules: true,
          duration: true,
          teams: true,
          cardsCutom: false,
          nbCartes: true,
          namesParam: true,
        };
      case 'chill':
        return {
          rules: false,
          duration: false,
          teams: false,
          cardsCutom: false,
          nbCartes: true,
          namesParam: false,
        };
      case 'custom':
        return {
          rules: false,
          duration: true,
          teams: true,
          cardsCutom: true,
          nbCartes: false,
          namesParam: true,
        };
      default:
        return {
          rules: false,
          duration: true,
          teams: true,
          cardsCutom: false,
          nbCartes: true,
          namesParam: true,
        };
    }
  }, [gameType]);

  useEffect(() => {
    setTeamNames((prev) => {
      const next = prev.slice(0, teams);
      while (next.length < teams) next.push(`Équipes ${next.length + 1}`);
      return next;
    });
  }, [teams]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const namesParam = encodeURIComponent(teamNames.join('|'));
    if (gameTypeParams.cardsCutom) {
      try {
        localStorage.removeItem(CONTAINER_KEY);
      } catch (e) {
        console.error('Erreur ', e);
      }
    }
    navigate(
      `/${gameTypeParams.cardsCutom ? 'cards-setup' : 'game'}?gameType=${gameType}${gameTypeParams.duration ? '&duration=' + duration : ''}${gameTypeParams.nbCartes ? '&nbCartes=' + nbCartes : ''}${gameTypeParams.teams ? '&teams=' + teams : ''}${gameTypeParams.namesParam ? '&namesParam=' + namesParam : ''}`
    );
  }

  return (
    <main className="mx-auto container max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold font-primary text-center text-white mb-6">
        Configuration
      </h1>

      {gameTypeParams.rules && (
        <Dropdown title="Règle deu jeu">
          <ClassicRules />
        </Dropdown>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {gameTypeParams.duration && (
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-white font-primary">
              Durée du tour
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-primary-900 dark:text-white px-3 py-2 text-sm"
            >
              <option value={20}>20 secondes 🔴</option>
              <option value={30}>30 secondes 🟠</option>
              <option value={45}>45 secondes 🟡</option>
              <option value={60}>60 secondes 🟢</option>
            </select>
          </div>
        )}

        {gameTypeParams.teams && (
          <div className="space-y-2">
            <label htmlFor="teams" className="block text-sm font-medium text-white font-primary">
              Nombre d'équipes
            </label>
            <input
              id="teams"
              type="range"
              min={2}
              max={6}
              value={teams}
              onChange={(e) => setTeams(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-white">{teams} équipes</div>
          </div>
        )}

        {gameTypeParams.namesParam && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white font-primary">
              Noms des équipes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teamNames.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setTeamNames((arr) => arr.map((n, i) => (i === idx ? e.target.value : n)))
                  }
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-primary-900 dark:text-white px-3 py-2 text-sm"
                  placeholder={`Team ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {gameTypeParams.nbCartes && (
          <div className="space-y-2">
            <label htmlFor="nbCartes" className="block text-sm font-medium text-white font-primary">
              Nombre de cartes
            </label>
            <input
              id="nbCartes"
              type="number"
              min={teams}
              max={500}
              step={teams}
              value={nbCartes}
              onChange={(e) => setNbCartes(Math.max(teams, Number(e.target.value)))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:text-white dark:bg-primary-900 px-3 py-2 text-sm"
            />
            <div className="text-sm text-white">
              {nbCartes} cartes (seront arrondies pour être réparties uniformément)
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            className="w-full rounded-md bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => setShowIntermission(true)}
          >
            Démarrer le jeu
          </button>
        </div>

        {showIntermission && (
          <IntermissionCard>
            <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">Équipe {teamNames[0]}</p>
            <button
              type="submit"
              className="w-full rounded-md bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              C'est parti !
            </button>
          </IntermissionCard>
        )}
      </form>
    </main>
  );
}

export default GameSetup;
