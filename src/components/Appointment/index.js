import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";

import "components/Appointment/styles.scss"
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY"
const SHOW = "SHOW"
const CREATE = "CREATE"
const EDIT = "EDIT"
const DELETE = "DELETE"

export default function Appointment(props) {
  const { id, time, interview, interviewers, bookInterview } = props
  const { transition, back, mode } = useVisualMode(interview ? SHOW : EMPTY)
  const handleClick = (e) => console.log(`Clicked ${e.target.alt}`);
  const onAdd = () => transition(CREATE)
  const onCancel = () => back()
  const onEdit = () => transition(EDIT)
  const onDelete = () => transition(DELETE)

  const onSave = (student, interviewer) => {
    const interview = {
      student,
      interviewer
    }
    bookInterview(id, interview)
    transition(SHOW)
  }

  return (
    <article className="appointment">
      <Header {...{time}} />
      {
        mode === SHOW ? <Show {...{
          ...interview, 
          onEdit: handleClick,
          onDelete: handleClick
        }}/> : 
        mode === CREATE ? <Form {...{
          interviewers,
          onSave,
          onCancel,
        }}/> :
        mode === EMPTY ? <Empty {...{onAdd}}/> : <></>
      }
    </article>
  )
}