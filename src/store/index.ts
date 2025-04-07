import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import habitsReducer from "./slices/habitsSlice";
import tasksReducer from "./slices/tasksSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitsReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
