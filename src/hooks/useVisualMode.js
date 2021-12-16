import { useState } from "react";

/* 
Custom hook: used for managing mode state, which handles mode transitions. 
This is done by having an array of modes representing history. Most recent mode is 
always on top of the stack (array). On every transition, unshift the 
mode to the array without mutating state, which utilizes the spread operator
*/
export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial])
  const transition = (newMode, replace = false) => {
    setHistory(prev => {
      if (replace) return [newMode, ...prev.slice(1)]
      return [newMode, ...prev]
    })
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