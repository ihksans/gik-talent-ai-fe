import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./ChatSlice/chatSlice";
import authReducer from "./AuthSlice/authSlice";
import { api } from "../api/api";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
