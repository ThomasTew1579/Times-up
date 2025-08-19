import { Routes, Route } from 'react-router-dom'
import './App.css'
import Menu from './components/Menu'
import MenuItem from './components/MenuItem'
import Home from './pages/Home'
import Game from './pages/Game'
import Settings from './pages/Settings'
import Rules from './pages/Rules'
import ClassicGame from './pages/ClassicGame'
import ClassicGameSetup from './pages/ClassicGameSetup'

function App() {

  return (
    <>
      <Menu>
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/game">Game</MenuItem>
        <MenuItem href="/settings">Settings</MenuItem>
        <MenuItem href="/rules">Rules</MenuItem>
      </Menu>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/classic/setup" element={<ClassicGameSetup />} />
        <Route path="/game/classic" element={<ClassicGame />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/rules" element={<Rules />} />
      </Routes>
    </>
  )
}

export default App
