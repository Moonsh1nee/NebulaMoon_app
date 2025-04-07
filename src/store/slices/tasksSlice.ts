import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { TaskResponse, ErrorResponse, Task } from "../../types";

interface TasksState {
  tasks: TaskResponse;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: {
    tasks: [],
    limit: 0,
    skip: 0,
    total: 0,
  },
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<
  TaskResponse,
  { limit?: number; skip?: number } | void,
  { rejectValue: ErrorResponse }
>(
  "tasks/fetchTasks",
  async (args = { limit: 10, skip: 0 }, { rejectWithValue }) => {
    const { limit = 10, skip = 0 } = args || {};

    try {
      const response = await api.get<TaskResponse>(
        `/tasks?limit=${limit}&skip=${skip}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({ message: "Failed to fetch tasks" });
    }
  }
);

export const createTask = createAsyncThunk<
  Task,
  { title: string; description?: string; dueDate?: string },
  { rejectValue: ErrorResponse }
>("tasks/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const response = await api.post<Task>("/tasks", {
      title: taskData.title,
      description: taskData.description || null,
      dueDate: taskData.dueDate || null,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to create task",
    });
  }
});

export const updateTask = createAsyncThunk<
  Task,
  {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    completed?: boolean;
  },
  { rejectValue: ErrorResponse }
>("tasks/updateTask", async (taskData, { rejectWithValue }) => {
  const { id, ...data } = taskData;
  try {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to update task",
    });
  }
});

export const deleteTask = createAsyncThunk<
  { id: string },
  string,
  { rejectValue: ErrorResponse }
>("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return { id };
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to delete task",
    });
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<TaskResponse>) {
      state.tasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "An error occurred";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.tasks.unshift(action.payload); // Добавляем в начало
        state.tasks.total += 1;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks.tasks = state.tasks.tasks.filter(
          (t) => t._id !== action.payload.id
        );
        state.tasks.total -= 1;
      });
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
