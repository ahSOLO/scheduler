export function getAppointmentsForDay(state, day) {
  const targetDay = state.days.find(d => d.name === day);
  const arr = (targetDay && targetDay.appointments) || [];

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
  const targetDay = state.days.find(d => d.name === day);
  const arr = (targetDay && targetDay.appointments) || [];

  let interviewers = [];
  for (const id of arr) {
    if (state.interviewers[id]) {
      interviewers.push(state.interviewers[id]);
    }
  }

  return interviewers;
}