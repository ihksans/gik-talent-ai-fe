import { API_BASE_URL } from "../../config";
import type { AppDispatch } from "../store";
import {
  appendToken,
  startStreaming,
  stopStreaming,
  triggerHistoryRefresh,
} from "../store/ChatSlice/chatSlice";

export async function streamChat(
  message: string,
  dispatch: AppDispatch,
  controller: AbortController,
  userId: string | null,
  sessionId: string,
) {
  dispatch(startStreaming());

  const res = await fetch(`${API_BASE_URL}/v1/chat/stream`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      user_id: userId,
    }),
    signal: controller.signal,
  });

  if (!res.body) {
    dispatch(stopStreaming());
    throw new Error("No streaming body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done || controller.signal.aborted) break;

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");

      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        const lines = block.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.includes("data:")) continue;

          const raw = trimmed.replace(/data:\s*/g, "");

          if (raw === "[DONE]" || raw === "{}" || raw === "done") {
            dispatch(stopStreaming());
            dispatch(triggerHistoryRefresh());
            return;
          }

          try {
            const json = JSON.parse(raw);
            const delta = json?.choices?.[0]?.delta?.content;

            if (delta !== undefined) {
              dispatch(appendToken(delta));
            }
          } catch (err) {
            console.error("JSON parse error:", raw);
          }
        }
      }
    }
  } catch (e: any) {
    if (e?.name !== "AbortError") {
      console.error(e);
    }
  } finally {
    try {
      reader.cancel();
    } catch {}
    reader.releaseLock();
    dispatch(stopStreaming());
  }
}

export async function getChatSession(sessionId: string) {
  const res = await fetch(`${API_BASE_URL}/v1/chat/session/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load chat session");
  }

  return res.json();
}

export async function getChatHistory(userId: string) {
  const res = await fetch(`${API_BASE_URL}/v1/chat/history/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load chat history");
  }

  return res.json();
}
