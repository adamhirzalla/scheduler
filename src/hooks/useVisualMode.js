import { useState } from "react";

export default function useVisualMode(initial) {
  // const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial])

  const transition = (newMode) => {
    setHistory(prev => [newMode, ...prev])
  }

  const back = () => {
    setHistory(prev => {
      if (prev.length <= 1) return prev
      return prev.slice(1)
    })
  }

  const mode = history[0]
  return { mode, transition, back }
}