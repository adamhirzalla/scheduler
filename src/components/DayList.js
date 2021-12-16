import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  /* 
  Props:
    days: (array) of day objects
    value: name of the day state (string)
    onChange: (function) to set day state when navigating days
  */
  const { days, value, onChange } = props
  const parsedDays = days.map(day => <DayListItem {...{
    key: day.id,
    name: day.name,
    spots: day.spots,
    selected: day.name === value,
    setDay: onChange
  }}/>)

  return (
    <ul>
      {parsedDays}
    </ul>
  )
}