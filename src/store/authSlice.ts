import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  userId: localStorage.getItem("userId"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        userId: string;
        token: string;
        refreshToken: string;
      }>,
    ) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.refreshToken = null;

      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
