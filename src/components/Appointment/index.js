import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "components/Appointment/styles.scss"
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY"
const SHOW = "SHOW"

export default function Appointment(props) {
  const { time, interview } = props
  const { transition, back, mode } = useVisualMode(interview ? SHOW : EMPTY)
  const handleClick = (e) => console.log(`Clicked ${e.target.alt}`);

  return (
    <article className="appointment">
      <Header {...{time}} />
      {
      mode === SHOW ? <Show {...{
        ...interview, 
        onEdit: handleClick,
        onDelete: handleClick
      }}/> : 
      mode === EMPTY ? <Empty onAdd={handleClick}/> : <></>
      }
    </article>
  )
}