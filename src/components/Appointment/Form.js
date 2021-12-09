import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  const { interviewers, onSave, onCancel } = props
  const [student, setStudent] = useState(props.student || "")
  const [interviewer, setInterviewer] = useState(props.interviewer || null)

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
    onSave(student, interviewer)
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
          />
        </form>
        <InterviewerList 
          {...{
            interviewers,
            value: interviewer,
            onChange: setInterviewer
          }}
        />
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