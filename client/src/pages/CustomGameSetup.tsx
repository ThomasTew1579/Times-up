
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONTAINER_KEY = "timesup:submissions";

export default function CustomGameSetup() {

    const navigate = useNavigate()
    const [duration, setDuration] = useState<number>(30)
    const [players, setPlayers] = useState<number>(4)
    const [playerNames, setPlayerNames] = useState<string[]>(['Joueur 1','Joueur 2'])
  
    useEffect(() => {
      setPlayerNames((prev) => {
        const next = prev.slice(0, players)
        while (next.length < players) next.push(`Joueur ${next.length + 1}`)
        return next
      })
    }, [players])
  
    function onSubmit(e: React.FormEvent) {
      e.preventDefault()
      const namesParam = encodeURIComponent(playerNames.join('|'))
      try {
        localStorage.removeItem(CONTAINER_KEY);
      } catch (e) {
        console.error("Erreur ", e);
      }
      navigate(`/game/custom/cards/setup?duration=${duration}&players=${players}&playerNames=${namesParam}`)
    }
  
    return (
      <main className="mx-auto container max-w-xl px-4 py-8">
        <h1 className="text-3xl font-bold font-secondary text-center text-white mb-6">Mode custom - Configuration</h1>
   
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="duree" className="block text-sm font-medium text-white font-primary">Durée du tour</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-primary-900 dark:text-white px-3 py-2 text-sm"
            >
              <option value={10}>10 secondes</option>
              <option value={20}>20 secondes</option>
              <option value={30}>30 secondes</option>
              <option value={60}>60 secondes</option>
            </select>
          </div>
  
          <div className="space-y-2">
            <label htmlFor="players" className="block text-sm font-medium text-white font-primary">Nombre de joueurs</label>
            <input
              id="players"
              type="range"
              min={2}
              max={6}
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-white">{players} joueurs</div>
          </div>
  
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white font-primary">Noms des joueurs</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {playerNames.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) => setPlayerNames((arr) => arr.map((n, i) => (i === idx ? e.target.value : n)))}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-primary-900 dark:text-white px-3 py-2 text-sm"
                  placeholder={`Team ${idx + 1}`}
                />
              ))}
            </div>
          </div>
  
          <div className="pt-2">
            <button
              type='submit'
              className="w-full rounded-md bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Ajoutez vos cartes !
            </button>
          </div>
        </form>
      </main>
    )
}