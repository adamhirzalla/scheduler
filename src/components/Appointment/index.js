import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/styles.scss"

import React, { useEffect } from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

// VisualMode states (used for transitioning back and forth between components)
const EMPTY = "EMPTY"
const SHOW = "SHOW"
const CREATE = "CREATE"
const SAVING = "SAVING"
const DELETING = "DELETING"
const CONFIRM = "CONFIRM"
const EDIT = "EDIT"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment(props) {
  const { id, time, interview, interviewers, bookInterview, deleteInterview } = props
  const { transition, back, mode } = useVisualMode(interview ? SHOW : EMPTY)
  const onAdd = () => transition(CREATE)
  const onDelete = () => transition(CONFIRM)
  const onEdit = () => transition(EDIT)

  /* 
  Handles:
  - Transitioning to 'SAVING' status indicator
  - Making an Axios PUT request to the server
  - Transitioning to SHOW mode on success
  - Transitioning to Error mode on failure
  */
  const onSave = (student, interviewer) => {
    transition(SAVING)
    bookInterview(id, { student, interviewer })
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true))
  }

  /* 
  Handles:
  - Transitioning to 'DELETING' status indicator
  - Making an Axios DELETE request to the server
  - Transitioning to Empty mode on success
  - Transitioning to Error mode on failure
  */
  const destroy = () => {
    transition(DELETING, true)
    deleteInterview(id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true))
  } 
  /*
  Handles: updating components accordingly when changing state due to new
  WebSocket requests by the server (made by other connected clients)
  */
  useEffect(() => {
    if (mode === EMPTY && interview) transition(SHOW)
    if (mode === SHOW && !interview) transition(EMPTY)
  }, [interview, mode, transition])

  return (
    <article className="appointment" data-testid="appointment">
      <Header {...{time}} />
      {
        mode === SHOW && interview ? <Show {...{
          ...interview, 
          onEdit,
          onDelete
        }}/> : 
        mode === EDIT ? <Form {...{
          interviewers,
          student: interview.student,
          interviewer: interview.interviewer.id,
          onSave,
          onCancel: back,
        }}/> :
        mode === CREATE ? <Form {...{
          interviewers,
          onSave,
          onCancel: back,
        }}/> :
        mode === SAVING ? <Status message={'Saving, please wait...'} /> :
        mode === DELETING ? <Status message={'Deleting, please wait...'} /> :
        mode === ERROR_SAVE ? <Error message={'Could not save!'} onClose={back}/> :
        mode === ERROR_DELETE ? <Error message={'Could not delete!'} onClose={back} /> :
        mode === CONFIRM ? <Confirm {...{
          message: 'Are you sure you want to delete?',
          onConfirm: destroy,
          onCancel: back
        }} /> :
        mode === EMPTY ? <Empty {...{onAdd}}/> : <></>
      }
    </article>
  )
}