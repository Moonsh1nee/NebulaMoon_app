import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse, LoginResponse, RegisterResponse } from "../../types";
import api from "../../api";

interface AuthState {
  user: { email: string} | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registerSuccess: false,
};

export const checkAuth = createAsyncThunk<
  { email: string }, // Предполагаем, что сервер вернет email пользователя
  void,
  { rejectValue: ErrorResponse }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ email: string }>("/auth/me");
    return response.data;
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Not authenticated",
    });
  }
});

export const register = createAsyncThunk<
  RegisterResponse,
  { email: string; password: string },
  { rejectValue: ErrorResponse }
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
  { rejectValue: ErrorResponse }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: "Invalid credentials" });
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorResponse }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout");
  } catch (error: any) {
    return rejectWithValue({
      message: error.response?.data?.message || "Logout failed",
    });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegisterSuccess(state) {
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(checkAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(checkAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { email: action.payload.email };
      state.isAuthenticated = true;
    })
    .addCase(checkAuth.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload?.message ?? "An error occurred";
    })
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { email: action.meta.arg.email };
      state.isAuthenticated = true;
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
    })
    .addCase(logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "An error occurred";
    });
  },
});

export const { resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
