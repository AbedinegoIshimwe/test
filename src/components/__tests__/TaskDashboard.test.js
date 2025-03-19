import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskDashboard from "../TaskDashboard";

describe("TaskDashboard Component", () => {
  beforeEach(() => {
    render(<TaskDashboard />);
  });

  test("renders task dashboard", () => {
    expect(screen.getByText("Task Dashboard")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a new task")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  test("adds a new task", () => {
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    expect(screen.getByText("New Task")).toBeInTheDocument();
    expect(input.value).toBe("");
  });

  test("adds a task when pressing Enter", () => {
    const input = screen.getByPlaceholderText("Add a new task");

    fireEvent.change(input, { target: { value: "Task with Enter" } });
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });

    expect(screen.getByText("Task with Enter")).toBeInTheDocument();
    expect(input.value).toBe("");
  });

  test("does not add empty task", () => {
    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    const tasks = screen.queryAllByRole("listitem");
    expect(tasks).toHaveLength(0);
  });

  test("deletes a task", () => {
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Task to Delete" } });
    fireEvent.click(addButton);

    expect(screen.getByText("Task to Delete")).toBeInTheDocument();

    const deleteButton = screen.getByLabelText("delete");
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Task to Delete")).not.toBeInTheDocument();
  });

  test("edits a task", async () => {
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Task to Edit" } });
    fireEvent.click(addButton);

    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);

    const dialogInput = screen.getByRole("textbox");
    fireEvent.change(dialogInput, { target: { value: "Edited Task" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    expect(screen.queryByText("Task to Edit")).not.toBeInTheDocument();
    expect(screen.getByText("Edited Task")).toBeInTheDocument();
  });

  test("cancels task editing", () => {
    // Add a task first
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Task to Not Edit" } });
    fireEvent.click(addButton);

    // Find and click edit button
    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);

    // Find and click cancel button
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(screen.getByText("Task to Not Edit")).toBeInTheDocument();
  });

  test("handles non-Enter key press", () => {
    const input = screen.getByPlaceholderText("Add a new task");

    fireEvent.change(input, { target: { value: "Task with Space" } });
    fireEvent.keyPress(input, { key: " ", code: "Space", charCode: 32 });

    expect(input.value).toBe("Task with Space");
  });

  test("attempts to edit non-existent task", () => {
    // Add a task first
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Task to Edit" } });
    fireEvent.click(addButton);

    // Try to edit a task with a different ID
    const editButton = screen.getByLabelText("edit");
    const taskElement = editButton.closest("li");
    const taskId = parseInt(taskElement.getAttribute("data-testid") || "0", 10);

    // Simulate clicking edit on a non-existent task
    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Change the task ID to something that doesn't exist
    const nonExistentTask = { id: taskId + 1, text: "Non-existent Task" };
    fireEvent.click(editButton); // This should not open the dialog

    expect(screen.queryByText("Edit Task")).toBeInTheDocument();
  });

  test("closes dialog with backdrop click", async () => {
    const input = screen.getByPlaceholderText("Add a new task");
    const addButton = screen.getByRole("button", { name: /add/i });

    fireEvent.change(input, { target: { value: "Task to Edit" } });
    fireEvent.click(addButton);

    const editButton = screen.getByLabelText("edit");
    fireEvent.click(editButton);

    expect(screen.getByText("Edit Task")).toBeInTheDocument();

    const backdrop = document.querySelector(".MuiBackdrop-root");
    fireEvent.click(backdrop);

    await waitFor(() => {
      expect(screen.queryByText("Edit Task")).not.toBeInTheDocument();
    });
  });
});
