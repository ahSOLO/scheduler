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