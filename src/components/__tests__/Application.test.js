import React from "react";
import axios from "__mocks__/axios";

import {
  render, cleanup, waitForElement, fireEvent, getByText, prettyDOM,
  getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText
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

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0]

    fireEvent.click(getByAltText(appointment, "Add"))
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"))
   
    getByText(appointment, /saving/i)

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones")); 
   
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument()
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"))
    getByText(appointment, /are you sure/i)
    fireEvent.click(queryByText(appointment, "Confirm"))
    getByText(appointment, /deleting/i)

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument()
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"))
    expect(queryByText(appointment, "Tori Malcolm")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(queryByText(appointment, "Save"))
    getByText(appointment, /saving/i)
    
    await waitForElement(() => getByText(appointment, "Archie Cohen"));
    
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument()
  });

  it("shows the save error when failing to save an appointment and can go back to form component", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"))
    expect(queryByText(appointment, "Tori Malcolm")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(queryByText(appointment, "Save"))
    getByText(appointment, /saving/i)

    await waitForElement(() => getByText(appointment, /could not save/i));

    getByAltText(appointment, "Close").click()
    getByText(appointment, "Tori Malcolm")
  })

  it("shows the delete error when failing to delete an existing appointment and can go back to show component", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"))
    expect(queryByText(appointment, /are you sure/i)).toBeInTheDocument();
    fireEvent.click(queryByText(appointment, "Confirm"))
    getByText(appointment, /deleting/i)

    await waitForElement(() => getByText(appointment, /could not delete/i));

    getByAltText(appointment, "Close").click()
    getByText(appointment, "Tori Malcolm")
  })
})

