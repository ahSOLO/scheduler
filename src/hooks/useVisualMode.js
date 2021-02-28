import React, {useState} from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setMode( (prevMode) => {
      setHistory( (prevHist) => {
        if (replace) {
          return prevHist;
        } else {
          return [...prevHist, prevMode];
        }
      });
      return newMode;
    });
  }

  const back = function() {
    if (history.length <= 1) return;
    setHistory( prev => {
      let prevCopy = [...prev];
      let prevMode = prevCopy.pop();
      setMode(prevMode);
      return prevCopy;
    });
  }

  return { mode, transition, back };
}