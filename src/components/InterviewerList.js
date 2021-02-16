import React from "react";
import "components/InterviewerList.scss";
import InterviewerListItem from "components/InterviewerListItem";
export default function InterviewerList(props) {
  const items = props.interviewers.map( (interviewer, index) => {
    return (
      <InterviewerListItem 
        avatar = {interviewer.avatar}
        name = {interviewer.name}
        selected = {props.interviewer === index}
        setInterviewer ={() => props.setInterviewer(interviewer.id)}
        key = {index}
      />
    )
  })

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{items}</ul>
    </section>
  );
}