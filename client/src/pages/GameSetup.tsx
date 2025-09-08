import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { floorToMultiple } from '../hooks/helpers';
import IntermissionCard from '../components/IntermissionCard';
import ClassicRules from '../components/ClassicRules';
import Dropdown from '../components/Dropdown';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  selectDuration,
  selectTeams,
  selectTeamNames,
  selectNbCartes,
  selectGameType,
} from '../store/selectors';
import { setDuration, setTeams, setTeamName, setNbCartes } from '../store/settingsSlice';

type GameParams = {
  rules: boolean;
  duration: boolean;
  teams: boolean;
  cardsCutom: boolean;
  nbCartes: boolean;
  namesParam: boolean;
};

function GameSetup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const duration = useAppSelector(selectDuration);
  const teams = useAppSelector(selectTeams);
  const teamNames = useAppSelector(selectTeamNames);
  const nbCartes = useAppSelector(selectNbCartes);
  const [showIntermission, setShowIntermission] = useState<boolean>(false);
  const gameType = useAppSelector(selectGameType);

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
          nbCartes: true,
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
    dispatch(setTeams(teams));
  }, [dispatch, teams]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/${gameTypeParams.cardsCutom ? 'cards-setup' : 'game'}`);
  }

  return (
    <main className="mx-auto container max-w-xl px-4 py-8">
      <h1 className="title-1">Configuration</h1>

      {gameTypeParams.rules && (
        <Dropdown title="Règle deu jeu">
          <ClassicRules />
        </Dropdown>
      )}

      <form onSubmit={onSubmit} className="space-y-6 form-card ">
        {gameTypeParams.duration && (
          <div className="space-y-2">
            <label htmlFor="duration">Durée du tour</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => dispatch(setDuration(Number(e.target.value)))}
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
            <label htmlFor="teams">Nombre d'équipes</label>
            <input
              id="teams"
              type="range"
              min={2}
              max={6}
              value={teams}
              onChange={(e) => dispatch(setTeams(Number(e.target.value)))}
              className="w-full"
            />
            <div className="text-sm text-white">{teams} équipes</div>
          </div>
        )}

        {gameTypeParams.namesParam && (
          <div className="space-y-2">
            <label>Noms des équipes</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teamNames.map((name: string, idx: number) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) => dispatch(setTeamName({ index: idx, name: e.target.value }))}
                  placeholder={`Équipes ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {gameTypeParams.nbCartes && (
          <div className="space-y-2">
            <label htmlFor="nbCartes">Nombre de cartes</label>
            <input
              id="nbCartes"
              type="number"
              min={teams}
              max={500}
              step={teams}
              value={floorToMultiple(Number(nbCartes), teams)}
              onChange={(e) =>
                dispatch(
                  setNbCartes(Math.max(teams, floorToMultiple(Number(e.target.value), teams)))
                )
              }
            />
          </div>
        )}

        <div className="pt-2">
          <button type="button" className="btn-submit" onClick={() => setShowIntermission(true)}>
            Démarrer le jeu
          </button>
        </div>

        {showIntermission && (
          <IntermissionCard>
            <p className="mb-4 text-sm text-zinc-300">Équipe {teamNames[0]}</p>
            <button type="submit" className="btn-submit">
              C'est parti !
            </button>
          </IntermissionCard>
        )}
      </form>
    </main>
  );
}

export default GameSetup;
