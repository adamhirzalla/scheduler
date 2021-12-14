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

  const bookInterview = async (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    await axios
      .put(`/api/appointments/${id}`, { interview });
    setState(prev => ({ ...prev, appointments }));
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
    await axios
      .delete(`/api/appointments/${id}`);
    setState(prev => ({ ...prev, appointments }));
  }

  return { state, setDay, bookInterview, deleteInterview }
}