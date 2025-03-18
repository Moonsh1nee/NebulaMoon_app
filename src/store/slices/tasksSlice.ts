import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { Task, ErrorResponse } from "../../types";
import { RootState } from "../index";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { state: RootState; rejectValue: ErrorResponse }
>("tasks/fetchTasks", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await api.get<Task[]>("/tasks", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: "Failed to fetch tasks" });
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
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
