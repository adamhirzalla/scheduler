import React from "react";

import DayListItem from "./DayListItem";

export default function DateList(props) {
  const { days, day, setDay } = props
  const parsedDays = days.map(dayObj => <DayListItem {...{
    key: dayObj.id,
    name: dayObj.name,
    spots: dayObj.spots,
    selected: dayObj.name === day,
    setDay
  }}/>)

  return (
    <ul>
      {parsedDays}
    </ul>
  )
}