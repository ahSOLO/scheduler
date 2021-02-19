import React, {useState} from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // do not change state directly - react needs to compare old with new
  // use functional setstate when you are using useEffect if you are unsure whether there is risk of a stale state

  const transition = function(newMode, replace = false) {
    setMode( (prevMode) => {
      setHistory( (prevHist) => {
        if (replace) {
          let prevHistCopy = [...prevHist];
          return [...prevHistCopy];
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