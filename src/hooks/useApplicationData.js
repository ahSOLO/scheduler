import React, {useReducer, useEffect} from 'react';
import axios from "axios";


export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.value[0].data, appointments: action.value[1].data, interviewers: action.value[2].data }
      case SET_INTERVIEW:
        return { ...state, appointments: action.value }
      case SET_SPOTS:
        return { ...state, days: action.value }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  // State
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

  // Functions
  function updateSpots(day) {
    if (state.days.length <= 0) return;
    // Get day index
    let dayIndex;
    state.days.some( (dayObj, i) => {
      if (dayObj.name === day) {
        dayIndex = i;
        return true;
      }
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
    daysCopy[dayIndex].spots = 5 - count;
    dispatch({type: SET_SPOTS, value: daysCopy});
  }

  useEffect( () => {
    updateSpots(state.day);
  }, [state.appointments])

  const setDay = day => dispatch({type: SET_DAY, value: day});

  function cancelInterview(id) {
    // const appointment = {
    //   ...state.appointments[id]
    // }
    // appointment.interview = null;

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // }

    return axios.delete(`/api/appointments/${id}`)
      // .then( () => dispatch({ type: SET_INTERVIEW, value: appointments }))
  }

  function bookInterview(id, interview) {
    const appointment = { 
      ...state.appointments[id],
      interview: { ...interview }
    }
    
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    return axios.put(`/api/appointments/${id}`, appointment)
      // .then( () => dispatch({ type: SET_INTERVIEW, value: appointments }))
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