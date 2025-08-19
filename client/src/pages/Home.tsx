import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Game modes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/game/classic/setup" className="block rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
          <h2 className="text-xl font-semibold">Classic</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">The standard mode to get started quickly.</p>
        </Link>
      </div>
    </main>
  )
}

export default Home


