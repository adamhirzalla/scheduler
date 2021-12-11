export function getAppointmentsForDay(state, name) {
  const [filtered] = state.days.filter(day => day.name === name)
  const appointments = []
  if (filtered) {
    for (const appointmentId of filtered.appointments) {
    appointments.push(state.appointments[appointmentId])
    }
  }
  return appointments
}

export function getInterview(state, interview) {
  if (!interview) return null
  const { student, interviewer } = interview
  return {
    student,
    interviewer: state.interviewers[interviewer] 
  }
}