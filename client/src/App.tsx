import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import MenuItem from './components/MenuItem';
import Home from './pages/Home';

import Proposal from './pages/Proposal';
import GameSetup from './pages/GameSetup';
import Game from './pages/Game';

import ClassicGame from './pages/ClassicGame';
import ChillGame from './pages/ChillGame';
import ClassicGameSetup from './pages/ClassicGameSetup';
import ChillGameSetup from './pages/ChillGameSetup';
import CustomGame from './pages/CustomGame';
import CustomGameSetup from './pages/CustomGameSetup';
import CustomCardsSetup from './pages/CustomCardsSetup';

function App() {
  return (
    <>
      <Menu>
        <MenuItem href="/">Accueil</MenuItem>
        <MenuItem href="/proposal">Propositions</MenuItem>
      </Menu>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/classic/setup" element={<ClassicGameSetup />} />
        <Route path="/game/chill/setup" element={<ChillGameSetup />} />
        <Route path="/game/custom/setup" element={<CustomGameSetup />} />
        <Route path="/game/custom/cards/setup" element={<CustomCardsSetup />} />
        <Route path="/game/classic" element={<ClassicGame />} />
        <Route path="/game/chill" element={<ChillGame />} />
        <Route path="/game/custom" element={<CustomGame />} />

        <Route path="/proposal" element={<Proposal />} />
        <Route path="/setup" element={<GameSetup />} />
        <Route path="/game" element={<Game />} />
        <Route path="/cards-setup" element={<CustomCardsSetup />} />
      </Routes>
    </>
  );
}

export default App;
