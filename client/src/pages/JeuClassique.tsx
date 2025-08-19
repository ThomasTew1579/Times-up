import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import cartes from '../assets/liste_cartes.json'

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

function JeuClassique() {
  const cartesMemo: Carte[] = useMemo(() => cartes as Carte[], [])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isRunning, setIsRunning] = useState(false)
  const [duration, setDuration] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [joueurs, setJoueurs] = useState(4)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [scoresByRound, setScoresByRound] = useState<number[][]>([])
  const [teamNames, setTeamNames] = useState<string[]>([])
  const [showIntermission, setShowIntermission] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [showFinalRecap, setShowFinalRecap] = useState(false)
  const deckIndices = useMemo(() => {
    const total = cartesMemo.length
    const requested = Number(searchParams.get('nbCartes'))
    const target = !Number.isNaN(requested) && requested > 0 ? Math.min(requested, total) : total
    const equitable = Math.floor(target / Math.max(2, joueurs)) * Math.max(2, joueurs)
    const indices = Array.from({ length: total }, (_, i) => i)
    const shuffled = shuffle(indices)
    return shuffled.slice(0, equitable > 0 ? equitable : Math.max(2, joueurs))
  }, [cartesMemo, joueurs, searchParams])
  const [pendingIndices, setPendingIndices] = useState<number[]>([])

  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning, remaining])

  function requeueCurrentCardAtRandom() {
    setPendingIndices((arr) => {
      if (arr.length <= 1) return arr
      const current = arr[0]
      const rest = arr.slice(1)
      const n = rest.length
      const insertIndex = 1 + Math.floor(Math.random() * n)
      return [...rest.slice(0, insertIndex), current, ...rest.slice(insertIndex)]
    })
  }

  useEffect(() => {
    if (remaining === 0 && isRunning) {
      setIsRunning(false)
      requeueCurrentCardAtRandom()
      setShowIntermission(true)
    }
  }, [remaining, isRunning])

  useEffect(() => {
    const d = Number(searchParams.get('duree'))
    const j = Number(searchParams.get('teams') ?? searchParams.get('joueurs'))
    if (!Number.isNaN(d) && d > 0 && d <= 600) {
      setDuration(d)
      setRemaining(d)
    }
    if (!Number.isNaN(j) && j >= 2 && j <= 10) {
      setJoueurs(j)
    }
    const namesParam = searchParams.get('teamNames')
    if (namesParam) {
      const names = decodeURIComponent(namesParam).split('|').slice(0, Math.max(2, j || joueurs))
      setTeamNames(names.length ? names : Array.from({ length: Math.max(2, j || joueurs) }, (_, i) => `Team ${i + 1}`))
    } else {
      setTeamNames(Array.from({ length: Math.max(2, j || joueurs) }, (_, i) => `Team ${i + 1}`))
    }
    // reset deck position when params change
    setPendingIndices(deckIndices)
    setCurrentPlayerIndex(0)
    setCurrentRound(1)
    if (j && j >= 2 && j <= 10) {
      setScoresByRound(Array.from({ length: 3 }, () => Array(j).fill(0)))
    } else if (!scoresByRound.length) {
      setScoresByRound(Array.from({ length: 3 }, () => Array(4).fill(0)))
    }
    if (!initialized) {
      setIsRunning(true)
      setInitialized(true)
    }
  }, [searchParams, deckIndices])

  const carte = pendingIndices.length > 0 ? cartesMemo[pendingIndices[0]] : undefined
  const joueurActuel = currentPlayerIndex + 1
  const totalCartes = deckIndices.length
  const validatedCount = totalCartes - pendingIndices.length
  const avancee = `${validatedCount}/${totalCartes || '?'}`

  function nextCarte() {
    if (pendingIndices.length <= 1) return
    setPendingIndices((arr) => arr.length <= 1 ? arr : [...arr.slice(1), arr[0]])
  }

  function handleValidate() {
    setScoresByRound((matrix) => {
      const copy = matrix.map((row) => row.slice())
      if (copy[currentRound - 1] && copy[currentRound - 1][currentPlayerIndex] != null) {
        copy[currentRound - 1][currentPlayerIndex] = (copy[currentRound - 1][currentPlayerIndex] || 0) + 1
      }
      return copy
    })
    // remove current card from queue (validated)
    setPendingIndices((arr) => arr.length > 0 ? arr.slice(1) : arr)
  }

  function handleSkip() {
    // move current card to end
    nextCarte()
  }

  function resetTimer() {
    setRemaining(duration)
    setIsRunning(false)
  }

  function changeDuration(newVal: number) {
    setDuration(newVal)
    setRemaining(newVal)
  }

  // End of round detection (no more pending cards)
  const [showRoundRecap, setShowRoundRecap] = useState(false)
  useEffect(() => {
    if (initialized && pendingIndices.length === 0) {
      setIsRunning(false)
      setShowIntermission(false)
      setShowRoundRecap(true)
    }
  }, [pendingIndices.length])

  // Final results sorted by total (desc)
  const finalRows = useMemo(() => {
    const rows = Array.from({ length: joueurs }).map((_, idx) => {
      const r1 = scoresByRound[0]?.[idx] ?? 0
      const r2 = scoresByRound[1]?.[idx] ?? 0
      const r3 = scoresByRound[2]?.[idx] ?? 0
      return { idx, r1, r2, r3, total: r1 + r2 + r3 }
    })
    rows.sort((a, b) => b.total - a.total)
    return rows
  }, [joueurs, scoresByRound])
  const topTotal = finalRows[0]?.total ?? 0

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">

      <section className="mb-6 flex items-center gap-4">
        <div className="text-center">
          <div className="text-5xl font-bold tabular-nums">{remaining}s</div>
          <div className="text-xs text-zinc-500">Time remaining</div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-sm text-zinc-700 dark:text-zinc-200">
            Team <span className="font-semibold">{teamNames[currentPlayerIndex] ?? `Team ${joueurActuel}`}</span> ({joueurActuel}/{joueurs})
          </div>
          <div className="text-xs text-zinc-500">{avancee}</div>
        </div>
      </section>

      {/* sélecteur de durée retiré: la durée provient de l'URL (page setup) */}

      <section className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-5 shadow-sm">
        {carte ? (
          <>
            <div className="text-2xl font-semibold mb-2">{carte.nom}</div>
            {carte.description && (
              <p className="text-zinc-700 dark:text-zinc-300 mb-1">{carte.description}</p>
            )}
            {carte.date && (
              <p className="text-sm text-zinc-500">{carte.date}</p>
            )}
          </>
        ) : (
          <div className="text-zinc-600 dark:text-zinc-300">No card available.</div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-md bg-emerald-600 text-white px-3 py-2 text-sm font-medium hover:bg-emerald-700 active:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
          onClick={handleValidate}
          disabled={!isRunning || !carte}
        >
          Validate
        </button>
        <button
          className="rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-3 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
          onClick={handleSkip}
          disabled={!isRunning || !carte}
        >
          Skip
        </button>
        <div className="ml-auto text-sm text-zinc-600 dark:text-zinc-300">
          Round {currentRound} score: {scoresByRound[currentRound - 1]?.[currentPlayerIndex] ?? 0}
        </div>
      </section>

      {showIntermission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur px-4">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-2">Next team</h2>
            <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">{teamNames[(currentPlayerIndex + 1) % joueurs] ?? `Team ${(currentPlayerIndex + 1) % joueurs + 1}`}</p>
            <div className="flex gap-2 justify-end">
              <button
                className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                onClick={() => {
                  // advance player and restart timer
                  setCurrentPlayerIndex((p) => (p + 1) % joueurs)
                  setRemaining(duration)
                  setIsRunning(true)
                  setShowIntermission(false)
                }}
              >
                Start turn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="mt-8 sticky bottom-0 z-40 w-full bg-white/90 dark:bg-zinc-900/80 backdrop-blur border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl px-4 py-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: joueurs }).map((_, idx) => (
            <div
              key={idx}
              className={`rounded-md px-3 py-2 text-sm ${idx === currentPlayerIndex ? 'bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-inset ring-indigo-200 dark:ring-indigo-500/30' : 'bg-zinc-50 dark:bg-zinc-800'}`}
            >
              <div className="font-medium">{teamNames[idx] ?? `Team ${idx + 1}`}</div>
              <div className="text-zinc-600 dark:text-zinc-300">
                R1: {scoresByRound[0]?.[idx] ?? 0} · R2: {scoresByRound[1]?.[idx] ?? 0} · R3: {scoresByRound[2]?.[idx] ?? 0}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Total: {(scoresByRound[0]?.[idx] ?? 0) + (scoresByRound[1]?.[idx] ?? 0) + (scoresByRound[2]?.[idx] ?? 0)}</div>
            </div>
          ))}
        </div>
      </div>

      {showRoundRecap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur px-4">
          <div className="w-full max-w-lg rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Round {currentRound} summary</h2>
            <div className="space-y-2 mb-4">
              {Array.from({ length: joueurs }).map((_, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{teamNames[idx] ?? `Team ${idx + 1}`}</span>
                  <span>{scoresByRound[currentRound - 1]?.[idx] ?? 0} validated</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              {currentRound < 3 ? (
                <button
                  className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => {
                    // Next round: rebuild queue from the same deck, reshuffled
                    setPendingIndices(shuffle(deckIndices))
                    setCurrentRound((r) => r + 1)
                    setRemaining(duration)
                    setIsRunning(true)
                    setShowRoundRecap(false)
                  }}
                >
                  Start next round
                </button>
              ) : (
                <button
                  className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setShowRoundRecap(false)
                    setShowFinalRecap(true)
                  }}
                >
                  View final results
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {showFinalRecap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur px-4">
          <div className="w-full max-w-xl rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 dark:text-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Final results</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-600 dark:text-zinc-300">
                    <th className="py-1 pr-3">Team</th>
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
                        {teamNames[idx] ?? `Team ${idx + 1}`}
                        {total === topTotal && total > 0 && (
                          <span className="ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-emerald-600 text-white">Winner</span>
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
                onClick={() => {
                  // Restart with same parameters
                  setScoresByRound(Array.from({ length: 3 }, () => Array(joueurs).fill(0)))
                  setCurrentRound(1)
                  setCurrentPlayerIndex(0)
                  setPendingIndices(shuffle(deckIndices))
                  setRemaining(duration)
                  setIsRunning(true)
                  setShowFinalRecap(false)
                }}
              >
                Play again
              </button>
              <button
                className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                onClick={() => {
                  setShowFinalRecap(false)
                  navigate('/')
                }}
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default JeuClassique


