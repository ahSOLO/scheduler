import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from"components/Appointment/Empty";

export default function Appointment(props) {
  const component = props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} onEdit={props.onEdit} onDelete={props.onDelete}/> : <Empty/>
  
  return (
    <>
      <Header time={props.time}/>
      <article className="appointment">{component}</article>
    </>
  );
}