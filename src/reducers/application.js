export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  const { day, days, appointments, interviewers, id, interview } = action
  switch (action.type) {
    case SET_DAY:
      return { ...state, day }
    case SET_APPLICATION_DATA:
      return { ...state, days, appointments, interviewers }
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[id],
        interview
      }
      const appointments = {
        ...state.appointments,
        [id]: appointment
      }
      const days = updateSpots(state, appointments, id)
      return { ...state, appointments, days }
    }
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function updateSpots(state, appointments, id) {
  const [newDay] = state.days.filter(day => day.appointments.includes(id));
  const spots = newDay.appointments.filter(appointment => !appointments[appointment].interview).length;
  const days = state.days.map(day => {
    if (day.id === newDay.id)
      return { ...newDay, spots };
    return day;
  });
  return days;
}