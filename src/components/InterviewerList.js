import React from "react";
import PropTypes from 'prop-types';

import "components/InterviewerList.scss"
import InterviewerListItem from "./InterviewerListItem";

export default function InterviewerList(props) {
  const { interviewers, onChange, value } = props
  const parsedInterviewers = interviewers.map(interview => <InterviewerListItem {...{
        key: interview.id,
        name: interview.name,
        avatar: interview.avatar, 
        setInterviewer: () => onChange(interview.id), 
        selected: interview.id === value
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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
}