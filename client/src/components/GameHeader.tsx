import React from 'react';

interface GameHeaderProps {
  remaining: number;
  showTimer: boolean;
  showTeams: boolean;
  currentPlayerIndex: number;
  players: number;
  teamNames: string[];
  progress: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  remaining,
  showTimer,
  showTeams,
  currentPlayerIndex,
  players,
  teamNames,
  progress,
}) => {
  return (
    <section className="mb-6 flex items-center gap-4">
      {showTimer && (
        <div className="text-center">
          <div className="text-5xl font-bold font-primary text-white tabular-nums">
            {remaining}s
          </div>
          <div className="text-xs text-white">Temps restant</div>
        </div>
      )}
      <div className="ml-auto flex items-center text-white gap-3">
        {showTeams && (
          <div className="text-sm">
            {teamNames.length > 0 && teamNames[0].includes('Joueur') ? 'Joueur' : 'Équipe'}{' '}
            <span className="font-semibold">
              {teamNames[currentPlayerIndex] ??
                (teamNames.length > 0 && teamNames[0].includes('Joueur')
                  ? `Joueur ${currentPlayerIndex + 1}`
                  : `Équipe ${currentPlayerIndex + 1}`)}
            </span>{' '}
            ({currentPlayerIndex + 1}/{players})
          </div>
        )}
        <div className="text-xs">{progress}</div>
      </div>
    </section>
  );
};

export default GameHeader;
