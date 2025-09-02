import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { floorToMultiple } from '../hooks/helpers';
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
  const [teamNames, setTeamNames] = useState<string[]>(['Équipe 1', 'Équipe 2']);
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
      <h1 className="title-1">
        Configuration
      </h1>

      {gameTypeParams.rules && (
        <Dropdown title="Règle deu jeu">
          <ClassicRules />
        </Dropdown>
      )}

      <form onSubmit={onSubmit} className="space-y-6 form-card ">
        {gameTypeParams.duration && (
          <div className="space-y-2">
            <label htmlFor="duration">
              Durée du tour
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
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
            <label htmlFor="teams">
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
            <label>
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
                  placeholder={`Équipes ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {gameTypeParams.nbCartes && (
          <div className="space-y-2">
            <label htmlFor="nbCartes">
              Nombre de cartes
            </label>
            <input
              id="nbCartes"
              type="number"
              min={teams}
              max={500}
              step={teams}
              value={floorToMultiple(Number(nbCartes), teams)}
              onChange={(e) => setNbCartes(Math.max(teams, floorToMultiple(Number(e.target.value), teams)))}
            />
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            className="btn-submit"
            onClick={() => setShowIntermission(true)}
          >
            Démarrer le jeu
          </button>
        </div>

        {showIntermission && (
          <IntermissionCard>
            <p className="mb-4 text-sm text-zinc-300">Équipe {teamNames[0]}</p>
            <button
              type="submit"
              className="btn-submit"
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
