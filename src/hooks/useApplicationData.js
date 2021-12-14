import axios from "axios"
import { useEffect, useReducer } from "react"

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  function reducer(state, action) {
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
        const [newDay] = state.days.filter(day => day.appointments.includes(id))
        const spots = newDay.appointments.filter(appointment => !appointments[appointment].interview).length
        const days = state.days.map(day => {
          if (day.id === newDay.id) return {...newDay, spots}
          return day
        })
        return { ...state, appointments, days }
      }
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

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    ws.onmessage = e => {
      const data = JSON.parse(e.data)
      if (data.type === SET_INTERVIEW) dispatch(data)
    }
    return () => ws.close()
  }, [])

  const bookInterview = async (id, interview) => {
    await axios
      .put(`/api/appointments/${id}`, { interview })
  }
 
  const deleteInterview = async (id) => {
    await axios
      .delete(`/api/appointments/${id}`);
  }

  return { state, setDay, bookInterview, deleteInterview }
}