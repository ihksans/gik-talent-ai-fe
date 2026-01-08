import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ChatState = {
  messages: Message[];
  streaming: boolean;
};

const initialState: ChatState = {
  messages: [],
  streaming: false,
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
  },
});

export const {
  addUserMessage,
  appendToken,
  startStreaming,
  stopStreaming,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
