import React from "react";
import "components/InterviewerListItem.scss";
import classnames from "classnames";

export default function InterviewerListItem(props) {
  const listClass = classnames("interviewers__item", {"interviewers__item--selected":props.selected})
  const onListClick = props.setInterviewer;

  return (
    <li className={listClass} onClick={onListClick}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected ? props.name : ""}
    </li>
  );
}