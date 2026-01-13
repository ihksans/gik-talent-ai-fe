export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ChatState = {
  messages: Message[];
  streaming: boolean;
  sessionId: string | null;
  openingSession: false;
  refreshHistoryTick: number;
};
