import { useState } from 'react'
import ResearchAssistant from './assets/components/ResearchAssistant'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ResearchAssistant />
    </>
  )
}

export default App
