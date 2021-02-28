import {useReducer, useEffect} from 'react';
import axios from "axios";
import reducer, {SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW, SET_SPOTS} from "../reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
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
      dispatch({type: SET_APPLICATION_DATA, value: all})
    })
  }, [])

  function updateSpots(day) {
    if (state.days.length <= 0) return;
    // Get day index
    let dayIndex;
    // .some used to break out of iteration early
    state.days.some( (dayObj, i) => {
      if (dayObj.name === day) {
        dayIndex = i;
        return true;
      }
      return false;
    });
    // Create a deep copy of the days array with respect to the spots in question
    const daysCopy = [...state.days];
    daysCopy.splice(dayIndex, 1, { ...state.days[dayIndex] });
    // Count number of appointments filled and set spots to 5 - that amount
    let count = 0;
    state.days[dayIndex].appointments.forEach( ele => {
      if (state.appointments[ele].interview) {
        count++;
      } 
    })
    daysCopy[dayIndex].spots = daysCopy[dayIndex].appointments.length - count;
    dispatch({type: SET_SPOTS, value: daysCopy});
  }

  useEffect( () => {
    updateSpots(state.day);
  }, [state.appointments])

  const setDay = day => dispatch({type: SET_DAY, value: day});

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
  }

  function bookInterview(id, interview) {
    const appointment = { 
      ...state.appointments[id],
      interview: { ...interview }
    }
    return axios.put(`/api/appointments/${id}`, appointment)
  }

  // Websockets
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    useEffect( () => {
      ws.onmessage = event => {
        const data = JSON.parse(event.data);
        console.log("DATA", data);
        if (data.type === SET_INTERVIEW) {
          const appointment = { 
            ...state.appointments[data.id],
            interview: data.interview
          }
          const appointments = {
            ...state.appointments,
            [data.id]: appointment
          };
          dispatch({type: SET_INTERVIEW, value: appointments })
        }
      }
  
      return () => ws.onmessage = null;
    }, [state.appointments]);

  return {state, setDay, cancelInterview, bookInterview};
}