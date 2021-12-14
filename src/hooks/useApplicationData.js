import axios from "axios"
import { useEffect, useState } from "react"

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState(prev => ({...prev, day}))

  useEffect(() => {
    Promise.all([
      axios.get(`api/days`),
      axios.get(`api/appointments`),
      axios.get(`api/interviewers`)
    ]).then(all => {
      setState(prev => ({
        ...prev, 
        days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    })
  }, [])

  const updateSpots = (id, increment) => {
    const [day] = state.days.filter(day => day.appointments.includes(id))
    if (increment) day.spots++
    else if (!state.appointments[id].interview) day.spots--
    return day
  }

  const bookInterview = async (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    const newDay = updateSpots(id, false)
    const days = state.days.map(day => {
      if (day.id === newDay.id) return newDay
      return day
    })
    await axios
      .put(`/api/appointments/${id}`, { interview })
    setState(prev => ({ ...prev, appointments, days }))
  }

  const deleteInterview = async (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    const newDay = updateSpots(id, true)
    const days = state.days.map(day => {
      if (day.id === newDay.id) return newDay
      return day
    })
    await axios
      .delete(`/api/appointments/${id}`);
    setState(prev => ({ ...prev, appointments, days }));
  }

  return { state, setDay, bookInterview, deleteInterview }
}