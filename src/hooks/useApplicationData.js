import React, {useState, useEffect} from 'react';
import axios from "axios";

export default function useApplicationData() {
  // State
  const [state, setState] = useState({
    day:"Monday",
    days:[],
    appointments: {},
    interviewers: {}
  });

  useEffect( () => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then( (all) => {
      setState(prev => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}))
    })
  }, [])

  // Functions

  function updateSpots(day, num) {
    // Get day index
    let dayIndex;
    state.days.some( (dayObj, i) => {
      if (dayObj.name === day) {
        dayIndex = i;
        return true;
      }
    });
    // Change spots by num
    setState(prev => {
      const copy = {...prev, days: [...prev.days]};
      copy.days[dayIndex].spots += num;
      return copy;
    });
  }

  const setDay = day => setState({...state, day:day});

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id]
    }
    appointment.interview = null;

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
      .then( () => {
        setState({...state, appointments});
        updateSpots(state.day, 1);
      })
  }

  function bookInterview(id, interview) {
    const appointment = { 
      ...state.appointments[id],
      interview: { ...interview }
    }
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then( () => {
        setState({...state, appointments})
        updateSpots(state.day, -1);
      })
  }

  return {state, setDay, cancelInterview, bookInterview};
}