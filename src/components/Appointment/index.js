import useVisualMode from "hooks/useVisualMode";
import "components/Appointment/styles.scss"

import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

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
  const onCancel = () => back()
  const handleError = () => back()

  const onSave = (student, interviewer) => {
    transition(SAVING)
    bookInterview(id, { student, interviewer })
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true))
  }

  const destroy = () => {
    transition(DELETING, true)
    deleteInterview(id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true))
  } 

  return (
    <article className="appointment">
      <Header {...{time}} />
      {
        mode === SHOW ? <Show {...{
          ...interview, 
          onEdit,
          onDelete
        }}/> : 
        mode === EDIT ? <Form {...{
          interviewers,
          student: interview.student,
          interviewer: interview.interviewer.id,
          onSave,
          onCancel,
        }}/> :
        mode === CREATE ? <Form {...{
          interviewers,
          onSave,
          onCancel,
        }}/> :
        mode === SAVING ? <Status message={'Saving, please wait...'} /> :
        mode === DELETING ? <Status message={'Deleting, please wait...'} /> :
        mode === ERROR_SAVE ? <Error message={'Could not save!'} onClose={handleError}/> :
        mode === ERROR_DELETE ? <Error message={'Could not delete!'} onClose={handleError} /> :
        mode === CONFIRM ? <Confirm {...{
          message: 'Are you sure you want to delete?',
          onConfirm: destroy,
          onCancel
        }} /> :
        mode === EMPTY ? <Empty {...{onAdd}}/> : <></>
      }
    </article>
  )
}