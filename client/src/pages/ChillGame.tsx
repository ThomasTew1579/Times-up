import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import cartes from '../assets/liste_cartes.json'
import GameCard from '../components/GameCard'
import IntermissionCard from '../components/IntermissionCard'

type Carte = {
  nom: string
  description?: string
  date?: string
}

function shuffle<T>(array: T[]): T[] {
  const a = array.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function ChillGame() {
  const cartesMemo: Carte[] = useMemo(() => cartes as Carte[], [])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showIntermission, setShowIntermission] = useState(false)
  const [showEndgame, setShowEndgame] = useState(false)
  const deckIndices = useMemo(() => {
    const total = cartesMemo.length
    const requested = Number(searchParams.get('nbCartes'))
    const target = !Number.isNaN(requested) && requested > 0 ? Math.min(requested, total) : total
    const equitable = Math.floor(target / Math.max(2)) * Math.max(2)
    const indices = Array.from({ length: total }, (_, i) => i)
    const shuffled = shuffle(indices)
    return shuffled.slice(0, equitable > 0 ? equitable : Math.max(2))
  }, [cartesMemo, searchParams])
  const [pendingIndices, setPendingIndices] = useState<number[]>([])

  useEffect(() => {
    setPendingIndices(deckIndices)
  }, [searchParams, deckIndices])

  const carte = pendingIndices.length > 0 ? cartesMemo[pendingIndices[0]] : undefined
  const totalCartes = deckIndices.length
  const validatedCount = totalCartes - pendingIndices.length + 1;
  const avancee = `${validatedCount}/${totalCartes || '?'}`

  function handleValidate() {
    setPendingIndices((arr) => arr.length > 0 ? arr.slice(1) : arr)
    if(pendingIndices.length >= 2 ) {
      setShowIntermission(true)
    } else {
      setShowEndgame(true)
    }
  }

  return (
    <main className="mx-auto container max-w-3xl px-4 py-8">

      <section className="mb-6 flex items-center gap-4">
        <div className="ml-auto flex items-center text-white gap-3">
          <div className="text-xs ">{avancee}</div>
        </div>
      </section>

      <section className="mb-6 flex justify-center">
        {carte ? (
          <>
            <GameCard>
              <div className="text-2xl text-primary-900 text-center font-primary">{carte.nom}</div>
              <div className="desc text-xs">
                {carte.description && (
                  <p className="text-white text-center">{carte.description}</p>
                )}
                {carte.date && (
                  <p className=" text-white text-center">{carte.date}</p>
                )}
              </div>
            </GameCard>
          </>
        ) : (
          <div className="text-zinc-600 dark:text-zinc-300">No card available.</div>
        )}
      </section>

      <section className="flex flex-wrap justify-center items-center gap-2">
        <button
          className="rounded-md bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 focus-visible:outlinez focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          onClick={handleValidate}
          disabled={!carte}
        >
          Valider
        </button>
      </section>

      {showIntermission && (
        <IntermissionCard>
          <h2 className="text-xl font-semibold mb-2">Au suivant !</h2>
            <div className="flex gap-2 justify-end">
              <button
                className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                onClick={() => {
                  setShowIntermission(false)
                }}
              >
                Démarrer le tour
              </button>
            </div>
          </IntermissionCard>
      )}
      {showEndgame && (
        <IntermissionCard>
          <h2 className="text-xl font-semibold mb-2">Fin de la partie</h2>
            <div className="flex gap-2 justify-end">
            <button
                className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                onClick={() => {
                  setPendingIndices(shuffle(deckIndices))
                  setShowEndgame(false)
                }}
              >
                Relancer une partie !
              </button>
              <button
                className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                onClick={() => {
                  setShowEndgame(false)
                  navigate('/')
                }}
              >
                Revenir au menu
              </button>
            </div>
          </IntermissionCard>
      )}
    </main>
  )
}

export default ChillGame


