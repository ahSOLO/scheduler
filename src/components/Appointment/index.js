import React, { useEffect, useState } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const initial = props.interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initial);
  const [saveDelay, setSaveDelay] = useState(false);
  
  function save(name, interviewer) {
    // Minimum delay is put on save action to prevent edits from instantly moving to the show screen
    setSaveDelay(true);
    setTimeout(() => {
      setSaveDelay(false);
    }, 1000);

    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      // .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  function del() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      // .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  // Transition from Saving to Show and Deleting to Empty when a response is received from websocket connection.
  useEffect( () => {
    if (props.interview && (mode === EMPTY || (mode === SAVING && saveDelay === false))) {
      transition(SHOW);
    } else if ((!props.interview) && (mode === SHOW || mode === DELETING)) {
      transition(EMPTY);
    }
  }, [mode, saveDelay, transition, props.interview]);
  
  return (
    <>
      <Header time={props.time}/>
      <article className="appointment" data-testid="appointment">
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && props.interview && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CREATE && (
          <Form 
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === SAVING && (
          <Status message="Saving..."/>
        )}
        {mode === CONFIRM && (
          <Confirm onCancel={() => transition(SHOW)} onConfirm={del} message="Are you sure?" />
        )}
        {mode === DELETING && (
          <Status message="Deleting..."/>
        )}
        {mode === EDIT && (
          <Form 
            name = {props.interview.student}
            interviewer = {props.interview.interviewer.id}
            interviewers={props.interviewers}
            onCancel={back}
            onSave={save}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error message="Could not save appointment" onClose={back}/>
        )}
        {mode === ERROR_DELETE && (
          <Error message="Could not cancel appointment" onClose={back}/>
        )}
      </article>
    </>
  );
}