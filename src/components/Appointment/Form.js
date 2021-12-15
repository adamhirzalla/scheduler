import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  const { interviewers, onSave, onCancel } = props
  const [student, setStudent] = useState(props.student || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null)
  const [error, setError] = useState({
    student: "",
    interviewer: ""
  })

  const handleStudent = (e) => setStudent(e.target.value)
  const reset = () => {
    setStudent('')
    setInterviewer(null)
  } 
  const cancel = () => {
    reset()
    onCancel()
  }

  const save = () => {
    if (student && interviewer) return onSave(student, interviewer)
    setError({
      ...error,
      student: student ? "" : "Student name cannot be blank",
      interviewer: interviewer ? "" : "Please select an Interviewer"
    })
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={handleStudent}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error.student}</section>
        <InterviewerList 
          {...{
            interviewers,
            value: interviewer,
            onChange: setInterviewer
          }}
        />
      <section className="appointment__validation">{error.interviewer}</section>
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={save}>Save</Button>
        </section>
      </section>
    </main>
  )
}