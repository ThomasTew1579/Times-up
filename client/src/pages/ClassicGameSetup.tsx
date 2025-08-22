import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function JeuClassiqueSetup() {
  const navigate = useNavigate()
  const [duree, setDuree] = useState<number>(20)
  const [teams, setTeams] = useState<number>(4)
  const [teamNames, setTeamNames] = useState<string[]>(['Équipes 1','Équipes 2','Équipes 3','Équipes 4'])
  const [nbCartes, setNbCartes] = useState<number>(40)

  useEffect(() => {
    setTeamNames((prev) => {
      const next = prev.slice(0, teams)
      while (next.length < teams) next.push(`Équipes ${next.length + 1}`)
      return next
    })
  }, [teams])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const namesParam = encodeURIComponent(teamNames.join('|'))
    navigate(`/game/classic?duree=${duree}&teams=${teams}&nbCartes=${nbCartes}&teamNames=${namesParam}`)
  }

  return (
    <main className="mx-auto container max-w-xl px-4 py-8">
      <h1 className="text-3xl font-bold font-secondary text-center text-white mb-6">Mode classique - Configuration</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="duree" className="block text-sm font-medium text-white font-primary">Durée du tour</label>
          <select
            id="duree"
            value={duree}
            onChange={(e) => setDuree(Number(e.target.value))}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-primary-900 dark:text-white px-3 py-2 text-sm"
          >
            <option value={10}>10 secondes</option>
            <option value={20}>20 secondes</option>
            <option value={30}>30 secondes</option>
            <option value={60}>60 secondes</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="teams" className="block text-sm font-medium text-white font-primary">Nombre d'équipes</label>
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-white font-primary">Noms des équipes</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {teamNames.map((name, idx) => (
              <input
                key={idx}
                type="text"
                value={name}
                onChange={(e) => setTeamNames((arr) => arr.map((n, i) => (i === idx ? e.target.value : n)))}
                className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-primary-900 dark:text-white px-3 py-2 text-sm"
                placeholder={`Team ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="nbCartes" className="block text-sm font-medium text-white font-primary">Nombre de cartes</label>
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
          <div className="text-sm text-white">{nbCartes} cartes (seront arrondies pour être réparties uniformément)</div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-primary-900 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Start
          </button>
        </div>
      </form>
    </main>
  )
}

export default JeuClassiqueSetup


