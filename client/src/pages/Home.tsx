import GameCard from '../components/GameCard'

function Home() {
  return (
    <main className="mx-auto container px-4 py-8">
      <h1 className="text-3xl text-white text-center font-secondary font-bold mb-6">Modes de jeu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GameCard href="/game/classic/setup" >
          <h2 className="text-5xl text-stroke font-primary">Classique</h2>
        </GameCard>
      </div>
    </main>
  )
}

export default Home


