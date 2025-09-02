import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import MenuItem from './components/MenuItem';
import Home from './pages/Home';

import Proposal from './pages/Proposal';
import GameSetup from './pages/GameSetup';
import CustomCardsSetup from './pages/CustomCardsSetup';
import Game from './pages/Game';

function App() {
  return (
    <>
      <Menu>
        <MenuItem href="/">Accueil</MenuItem>
        <MenuItem href="/proposal">Propositions</MenuItem>
      </Menu>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/proposal" element={<Proposal />} />
        <Route path="/setup" element={<GameSetup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/cards-setup" element={<CustomCardsSetup />} />
      </Routes>
    </>
  );
}

export default App;
