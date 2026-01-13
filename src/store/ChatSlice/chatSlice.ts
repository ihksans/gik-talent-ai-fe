import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatState } from "./types";

const initialState: ChatState = {
  messages: [],
  streaming: false,
  sessionId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({ role: "user", content: action.payload });
      state.messages.push({ role: "assistant", content: "" });
    },
    appendToken(state, action: PayloadAction<string>) {
      const last = state.messages[state.messages.length - 1];
      if (last && last.role === "assistant") {
        last.content += action.payload;
      }
    },
    startStreaming(state) {
      state.streaming = true;
    },
    stopStreaming(state) {
      state.streaming = false;
    },
    resetChat() {
      return initialState;
    },
    setSessionId(state, action: PayloadAction<string>) {
      state.sessionId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const {
  addUserMessage,
  appendToken,
  startStreaming,
  stopStreaming,
  resetChat,
  setSessionId,
  setMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
