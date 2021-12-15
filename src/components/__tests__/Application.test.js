import React from "react";

import { render, cleanup } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("renders without crashing", () => {
  const ENV_VAR = process.env
  process.env.REACT_APP_WEBSOCKET_URL = 'ws://localhost:8001'
  render(<Application />);
});
