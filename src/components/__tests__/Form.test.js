import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const student = "Lydia Miller-Jones"
  const interviewer = 1
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form {...{ interviewers }}/>)

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders without selected interviewer if not provided", () => {
    const { queryByText } = render(<Form {...{ interviewers }}/>)

    expect(queryByText("Sylvia Palmer")).not.toBeInTheDocument();
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(<Form {...{ interviewers, student }} />)

    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("renders with initial interviewer selected", () => {
    const { getByText } = render(<Form {...{ interviewers, interviewer }} />)

    expect(getByText("Sylvia Palmer")).toBeInTheDocument();
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn()
    const { getByText, queryByText } = render(<Form {...{ interviewers, interviewer, onSave }}/>)

    fireEvent.click(getByText("Save"))

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(queryByText(/please select an interviewer/i)).toBeNull();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer is not selected", () => {
    const onSave = jest.fn()
    const { getByText, queryByText } = render(<Form {...{ interviewers, student, onSave }}/>)

    fireEvent.click(getByText("Save"))

    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the name is not blank and interviewer is not selected at once", () => {
    const onSave = jest.fn()
    const { getByText } = render(<Form {...{ interviewers, onSave }}/>)

    fireEvent.click(getByText("Save"))

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
  
  it("calls onSave function when both the name and interviewer are defined", () => {
    const onSave = jest.fn()
    const { getByText, queryByText } = render(
      <Form {...{ interviewers, student, interviewer, onSave }}/>
    )
    
    fireEvent.click(getByText("Save"))
  
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/please select an interviewer/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });
  
});