export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface SessionState {
  sessions: Record<string, Message[]>;
  currentSessionId: string | null;
}
