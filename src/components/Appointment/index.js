import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/styles.scss"

import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";

const EMPTY = "EMPTY"
const SHOW = "SHOW"
const CREATE = "CREATE"
const SAVING = "SAVING"
const DELETING = "DELETING"

export default function Appointment(props) {
  const { id, time, interview, interviewers, bookInterview, deleteInterview } = props
  const { transition, back, mode } = useVisualMode(interview ? SHOW : EMPTY)
  const handleClick = (e) => console.log(`Clicked ${e.target.alt}`);
  const onAdd = () => transition(CREATE)
  const onCancel = () => back()

  const onSave = (student, interviewer) => {
    const interview = {
      student,
      interviewer
    }
    transition(SAVING)
    bookInterview(id, interview)
    .then(() => transition(SHOW))
  }

  const onDelete = () => {
    transition(DELETING)
    deleteInterview(id)
    .then(() => transition(EMPTY))
  }

  return (
    <article className="appointment">
      <Header {...{time}} />
      {
        mode === SHOW ? <Show {...{
          ...interview, 
          onEdit: handleClick,
          onDelete
        }}/> : 
        mode === CREATE ? <Form {...{
          interviewers,
          onSave,
          onCancel,
        }}/> :
        mode === SAVING ? <Status message={'Saving, please wait...'} /> :
        mode === DELETING ? <Status message={'Deleting, please wait...'} /> :
        mode === EMPTY ? <Empty {...{onAdd}}/> : <></>
      }
    </article>
  )
}