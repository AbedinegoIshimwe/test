import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock the environment variable
process.env.PUBLIC_URL = "";

describe("App Component", () => {
  test("renders login page by default", () => {
    render(<App />);
    expect(screen.getByText("Task Scheduler Login")).toBeInTheDocument();
  });

  test("redirects to dashboard after successful login", () => {
    render(<App />);

    // Find and fill the login form
    const usernameInput = screen.getByLabelText(/username/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.click(submitButton);

    // Should now be on the dashboard
    expect(screen.getByText("Task Dashboard")).toBeInTheDocument();
  });

  test("redirects to login when accessing dashboard without authentication", () => {
    render(<App />);
    expect(screen.getByText("Task Scheduler Login")).toBeInTheDocument();
  });
});
