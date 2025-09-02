import GameCard from '../components/GameCard';

function Home() {
  return (
    <main className="mx-auto relative container px-4 py-8">
      <h1 className="title-1">
        Modes de jeu
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 md:px-0">
        <GameCard href="/setup" title="Classique" gameType="classic" />
        <GameCard href="/setup" title="Custom"  gameType="custom" />
        <GameCard href="/setup" title="Chill" gameType="chill" />
      </div>
    </main>
  );
}

export default Home;
