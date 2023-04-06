import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Duel from './components/Duel'
import { TDuel } from './types'

const example: TDuel = {
  comments: [],
  player1: {
    link: 'https://unsplash.it/900/1200',
    caption: "IMAGE 1"
  },
  player2: {
    link: 'https://unsplash.it/900/1201',
    caption: "IMAGE 2"
  },
  vote1: 1015,
  vote2: 942
}
function App() {
  const [duel, setDuel] = useState<TDuel>(example)
  return (
    <main>
      <Duel {...duel}/>
    </main>
  )
}

export default App
