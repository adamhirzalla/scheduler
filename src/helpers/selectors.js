/* 
Handles: Getting the appointments for a specific day and returns
an array of appointments
*/
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

/* 
Handles: Getting the interviewers for a specific day and returns
an array of interviewers
*/
export function getInterviewersForDay(state, name) {
  const [filtered] = state.days.filter(day => day.name === name)
  const interviewers = []
  if (filtered) {
    for (const interviewerId of filtered.interviewers) {
      interviewers.push(state.interviewers[interviewerId])
    }
  }
  return interviewers
}

/* 
Handles: Return an object with student name and
interview object (if there's no interview, return null)
*/
export function getInterview(state, interview) {
  if (!interview) return null
  const { student, interviewer } = interview
  return {
    student,
    interviewer: state.interviewers[interviewer] 
  }
}