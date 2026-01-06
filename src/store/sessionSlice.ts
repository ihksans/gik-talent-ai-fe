import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface SessionState {
  sessions: Record<string, Message[]>;
  currentSessionId: string | null;
}

const initialState: SessionState = {
  sessions: {},
  currentSessionId: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    createSession(state) {
      const id = crypto.randomUUID();
      state.sessions[id] = [];
      state.currentSessionId = id;
    },
    addMessage(
      state,
      action: PayloadAction<{ sessionId: string; message: Message }>,
    ) {
      state.sessions[action.payload.sessionId].push(action.payload.message);
    },
  },
});

export const { createSession, addMessage } = sessionSlice.actions;
export default sessionSlice.reducer;
