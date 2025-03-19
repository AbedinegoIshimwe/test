import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Export for testing
export const createInitialState = () => ({
  tasks: [],
  newTask: "",
  editTask: null,
  openDialog: false,
});

function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditClick = (task) => {
    const taskToEdit = tasks.find((t) => t.id === task.id);
    if (taskToEdit) {
      setEditTask(taskToEdit);
      setOpenDialog(true);
    }
  };

  const handleEditSave = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editTask.id ? { ...task, text: editTask.text } : task
      )
    );
    setOpenDialog(false);
    setEditTask(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Dashboard
        </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Add
            </Button>
          </Box>
        </Paper>

        <Paper>
          <List>
            {tasks.map((task) => (
              <ListItem key={task.id} data-testid={task.id}>
                <ListItemText primary={task.text} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditClick(task)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>

        <Dialog
          open={!!editTask}
          onClose={() => setEditTask(null)}
          onBackdropClick={() => setEditTask(null)}
          data-testid="edit-dialog"
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task"
              type="text"
              fullWidth
              value={editTask ? editTask.text : ""}
              onChange={(e) =>
                setEditTask({ ...editTask, text: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditTask(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default TaskDashboard;
