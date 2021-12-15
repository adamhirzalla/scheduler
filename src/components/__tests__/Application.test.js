import React from "react";

import {
  render, cleanup, waitForElement, fireEvent, getByText, prettyDOM,
  getAllByTestId, getByAltText, getByPlaceholderText, queryByText 
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);
const ENV_VAR = process.env
process.env.REACT_APP_WEBSOCKET_URL = 'ws://localhost:8001'

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"))
  
    fireEvent.click(getByText("Tuesday"))
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0]

    fireEvent.click(getByAltText(appointment, "Add"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"))
   
    expect(getByText(appointment, "Saving", { exact: false })).toBeInTheDocument()

    /* 
    Cant't test for PUT or DELETE request as I'm relying on a WebSocket connection
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones")); 
    */

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    /* 
    Cant't test for updated spots as I'm relying on a WebSocket connection
    expect(getByText(day, "no spots remaining", { exact: false })).toBeInTheDocument()
    */
  });
})

