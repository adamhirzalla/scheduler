import React from "react";

import "components/InterviewerList.scss"
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const { interviewers, setInterviewer, interviewer } = props
  const parsedInterviewers = interviewers.map(obj => <InterviewerListItem {...{
        key: obj.id,
        ...obj, 
        setInterviewer, 
        selected: obj.id === interviewer
      }}/>
    )

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {parsedInterviewers}
      </ul>
    </section>
  )
}