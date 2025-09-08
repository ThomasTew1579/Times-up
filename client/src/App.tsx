import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Menu from './components/Menu';
import MenuItem from './components/MenuItem';

const Home = lazy(() => import('./pages/Home'));
const Setup = lazy(() => import('./pages/GameSetup'));
const CardsSetup = lazy(() => import('./pages/CardsSetup'));
const Game = lazy(() => import('./pages/Game'));
const Proposal = lazy(() => import('./pages/Proposal'));

function Fallback() {
  return <div className="p-6 text-center text-white font-primary">Chargement…</div>; 
}

function App() {
  return (
    <>
      <Menu>
        <MenuItem href="/">Accueil</MenuItem>
        <MenuItem href="/proposal">Propositions</MenuItem>
      </Menu>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/cards-setup" element={<CardsSetup />} />
          <Route path="/game" element={<Game />} />
          <Route path="/proposal" element={<Proposal />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
