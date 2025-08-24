import { Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'
import MenuItem from './components/MenuItem'
import Home from './pages/Home'
import ClassicGame from './pages/ClassicGame'
import ChillGame from './pages/ChillGame'
import ClassicGameSetup from './pages/ClassicGameSetup'
import ChillGameSetup from './pages/ChillGameSetup'
import Proposal from './pages/Proposal'

function App() {

  return (
    <>
      <Menu>
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/proposal">Propositions</MenuItem>
      </Menu>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/classic/setup" element={<ClassicGameSetup />} />
        <Route path="/game/chill/setup" element={<ChillGameSetup />} />
        <Route path="/game/classic" element={<ClassicGame />} />
        <Route path="/game/chill" element={<ChillGame />} />
        <Route path="/proposal" element={<Proposal />} />
      </Routes>
    </>
  )
}

export default App
