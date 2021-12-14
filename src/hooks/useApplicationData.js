import axios from "axios"
import { useEffect, useReducer } from "react"

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  function reducer(state, action) {
    const { day, days, appointments, interviewers } = action
    switch (action.type) {
      case SET_DAY:
        return { ...state, day }
      case SET_APPLICATION_DATA:
        return { ...state, days, appointments, interviewers }
      case SET_INTERVIEW:
        return { ...state, appointments, days }
    
      default:
        throw new Error(`Unsupported action type: ${action.type}`)
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => dispatch({ type: SET_DAY, day })

  useEffect(() => {
    Promise.all([
      axios.get(`api/days`),
      axios.get(`api/appointments`),
      axios.get(`api/interviewers`)
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data, 
        appointments: all[1].data,
        interviewers: all[2].data
      })
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
    dispatch({ type: SET_INTERVIEW, appointments, days })
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
    dispatch({ type: SET_INTERVIEW, appointments, days })
  }

  return { state, setDay, bookInterview, deleteInterview }
}