import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "./DayList";
import Appointment from "./Appointment";

import "components/Application.scss";

export default function Application(props) {

  const dailyAppointments = []

  const parsedAppointments = dailyAppointments.map(appointment =>
    <Appointment {...{
      key: appointment.id,
      time: appointment.time,
      interview: appointment.interview
    }} />
  )

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  })

  const setDay = day => setState(prev => ({...prev, day}))
  const setDays = days => setState(prev => ({...prev, days}))
  const setAppointments = appointments => setState(prev => ({...prev, appointments}))


  useEffect(() => {
    axios.get(`api/days`).then(res => setDays(res.data))
    axios.get(`api/appointments`).then(res => setAppointments(res.data))
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList {...{days: state.days, value: state.day, onChange: setDay}}/>
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {parsedAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
