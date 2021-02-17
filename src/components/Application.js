import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Testy McTest",
      interviewer: {
        id: 1,
        name: "Horace Witherspoon",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  },
  {
    id: 5,
    time: "4pm",
  },
];

export default function Application(props) {
  const [state, setState] = useState({
    day:"Monday", 
    days:[]
  });
  
  const setDay = day => setState({...state, day:day});
  const setDays = days => setState(prev => ({...prev, days:days}));
  
  let {day, days} = state

  useEffect( () => {
    axios.get('/api/days')
      .then( (res) => {
        setDays(res.data);
      })
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={days}
            day={day} 
            setDay={() => setDay(days.name)}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointments.map( appointment => {
          return <Appointment {...appointment} key={appointment.id}/>
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
