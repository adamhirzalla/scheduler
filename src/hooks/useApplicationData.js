import axios from "axios"
import { useEffect, useReducer } from "react"
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  function setDay(day) {
    return dispatch({ type: SET_DAY, day });
  }

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

  async function bookInterview(id, interview) {
    await axios.put(`/api/appointments/${id}`, { interview });
    dispatch({ type: SET_INTERVIEW, id, interview })
  }
 
  async function deleteInterview(id) {
    await axios.delete(`/api/appointments/${id}`);
    dispatch({ type: SET_INTERVIEW, id, interview: null })
  }

  return { state, setDay, bookInterview, deleteInterview }
}