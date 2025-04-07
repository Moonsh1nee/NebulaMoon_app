import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api";
import { Habit, ErrorResponse } from "../../types";

interface HabitsState {
  habits: Habit[];
  loading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
};

export const fetchHabits = createAsyncThunk<
  Habit[],
  void,
  { rejectValue: ErrorResponse }
>("habits/fetchHabits", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Habit[]>("/habits");
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: "Failed to fetch habits" });
  }
});

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setHabits(state, action: PayloadAction<Habit[]>) {
      state.habits = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? "An error occurred";
      });
  },
});

export const { setHabits } = habitsSlice.actions;
export default habitsSlice.reducer;
