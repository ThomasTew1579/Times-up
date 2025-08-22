import CardHome from '../components/CardHome'

function Home() {
  return (
    <main className="mx-auto container px-4 py-8">
      <h1 className="text-3xl text-center font-bold mb-6">Modes de jeu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardHome href="/game/classic/setup" >
          <h2 className="text-5xl text-primary-900 font-primary">Classique</h2>
        </CardHome>
      </div>
    </main>
  )
}

export default Home


