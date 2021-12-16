import axios from "axios"
import { useEffect, useReducer } from "react"
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

// Handles initial API setup, starting a WebSocket connection, setting state
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

  // Initial API call setup for populating data (in an Effect hook to prevent leaks)
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

  // Create the WebSocket connection once when the page is first rendered (cleanup on re-renders)
  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL)
    ws.onmessage = e => {
      // Parse the server response we receive
      const data = JSON.parse(e.data)
      // dispatch data when receiving a server response (on PUT/DELETE requests)
      // This happens when ANY connected user makes a request
      if (data.type === SET_INTERVIEW) dispatch(data)
    }
    // Clean up by closing WS connection
    return () => ws.close()
  }, [])

  async function bookInterview(id, interview) {
    await axios.put(`/api/appointments/${id}`, { interview });
    dispatch({ type: SET_INTERVIEW, id, interview })
  }

  // Even though it's not neccessary to dispatch after making an API request,
  // (since the WebSocket connection dispatches for us) I'm intentionally dispatching
  // here (and on deleteInterview) so that I can test component funcationality
  // through Integration Testing using Jest (so state is not fully reliant on WS)
 
  async function deleteInterview(id) {
    await axios.delete(`/api/appointments/${id}`);
    dispatch({ type: SET_INTERVIEW, id, interview: null })
  }

  return { state, setDay, bookInterview, deleteInterview }
}