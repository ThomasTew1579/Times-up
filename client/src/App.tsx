import { Routes, Route } from 'react-router-dom'
import './App.css'
import Menu from './components/Menu'
import MenuItem from './components/MenuItem'
import Home from './pages/Home'
import ClassicGame from './pages/ClassicGame'
import ClassicGameSetup from './pages/ClassicGameSetup'

function App() {

  return (
    <>
      <Menu>
        <MenuItem href="/">Home</MenuItem>
      </Menu>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/classic/setup" element={<ClassicGameSetup />} />
        <Route path="/game/classic" element={<ClassicGame />} />
      </Routes>
    </>
  )
}

export default App
