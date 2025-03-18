import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ErrorResponse, LoginResponse } from "../../types";
import api from "../../api";
import { RootState } from "../index";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { state: RootState; rejectValue: ErrorResponse }
>("auth/login", async (credentials, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await api.post<LoginResponse>("/auth/login", credentials, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: "Invalid credentials" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "An error occurred";
    });
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
