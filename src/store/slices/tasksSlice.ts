import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { TaskResponse, ErrorResponse } from "../../types";

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
>("tasks/fetchTasks", async (args = { limit: 10, skip: 0 }, { rejectWithValue }) => {
  const { limit = 10, skip = 0 } = args || {};
  
  try {
    const response = await api.get<TaskResponse>(
      `/tasks?limit=${limit}&skip=${skip}`
    );
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: "Failed to fetch tasks" });
  }
});

// export const createTask = createAsyncThunk<
//   TaskResponse,
//   { title: string; description?: string; dueDate?: string },
//   { rejectValue: ErrorResponse }
// >(
//   "tasks/createTask",
//   async ({ title, description, dueDate }, { rejectWithValue }) => {
//     try {
//       const response = await api.post<TaskResponse>("/tasks", {
//         title,
//         description,
//         dueDate,
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue({ message: "Failed to create task" });
//     }
//   }
// );

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
      });
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
