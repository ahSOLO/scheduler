export function getAppointmentsForDay(state, day) {
  let arr = [];
  state.days.some( (d) => {
    if (d.name === day) {
      return arr = d.appointments;
    }
  });

  let appointments = [];
  for (const id of arr) {
    if (state.appointments[id]) {
      appointments.push(state.appointments[id]);
    }
  }

  return appointments;
}

export function getInterview(state, interview) {
  return interview ? { ...interview, interviewer: state.interviewers[interview.interviewer] } : null ;
}

export function getInterviewersForDay(state, day) {
  let arr = [];
  state.days.some( (d) => {
    if (d.name === day) {
      return arr = d.interviewers;
    }
  });

  let interviewers = [];
  for (const id of arr) {
    if (state.interviewers[id]) {
      interviewers.push(state.interviewers[id]);
    }
  }

  return interviewers;
}