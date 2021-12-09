import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  const { days, value, onChange } = props
  const parsedDays = days.map(dayObj => <DayListItem {...{
    key: dayObj.id,
    name: dayObj.name,
    spots: dayObj.spots,
    selected: dayObj.name === value,
    onChange
  }}/>)

  return (
    <ul>
      {parsedDays}
    </ul>
  )
}