import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse, LoginResponse, RegisterResponse } from "../../types";
import api from "../../api";
import { RootState } from "../index";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  registerSuccess: false,
};

export const register = createAsyncThunk<
  RegisterResponse,
  { email: string; password: string },
  { state: RootState; rejectValue: ErrorResponse }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<RegisterResponse>("/auth/register", credentials);
    return response.data;
  } catch (error: any) {
    return rejectWithValue({ 
      message: error.response?.data?.message || "Registration failed" 
    });
  }
});

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
    clearToken(state) {
      state.token = null;
    },
    resetRegisterSuccess(state) {
      state.registerSuccess = false;
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
      localStorage.setItem("token", action.payload.token);
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "An error occurred";
    })
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registerSuccess = false;
    })
    .addCase(register.fulfilled, (state) => {
      state.loading = false;
      state.registerSuccess = true;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "An error occurred";
    });
  },
});

export const { clearToken, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
