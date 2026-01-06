import { API_BASE_URL } from "../../config";
import type { AppDispatch } from "../store";
import { appendToken, startStreaming, stopStreaming } from "../store/chatSlice";

export async function streamChat(
  message: string,
  dispatch: AppDispatch,
  controller: AbortController,
) {
  dispatch(startStreaming());

  const res = await fetch(
    `${API_BASE_URL}/v1/chat/tokens?message=${encodeURIComponent(message)}`,
    {
      headers: { Accept: "text/event-stream" },
      signal: controller.signal,
    },
  );

  if (!res.body) {
    dispatch(stopStreaming());
    throw new Error("No streaming body");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  // micro-batching
  let tokenBuffer = "";
  let rafId: number | null = null;

  const flush = () => {
    if (tokenBuffer) {
      dispatch(appendToken(tokenBuffer));
      tokenBuffer = "";
    }
    rafId = null;
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done || controller.signal.aborted) break;

      buffer += decoder.decode(value, { stream: true });
      buffer = buffer.replace(/\r\n/g, "\n");

      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        let event = "";
        let data = "";

        for (const line of block.split("\n")) {
          if (line.startsWith("event:")) {
            event = line.replace("event:", "").trim();
          }
          if (line.startsWith("data:")) {
            data += line.replace("data:", "");
          }
        }

        data = data.trim();

        if (event === "done" || data === "[DONE]") {
          flush();
          controller.abort();
          return;
        }

        if (event === "delta" && data && data !== "{}") {
          tokenBuffer += data;
          if (!rafId) rafId = requestAnimationFrame(flush);
        }
      }
    }
  } catch (e) {
    if ((e as any)?.name !== "AbortError") {
      console.error(e);
    }
  } finally {
    try {
      reader.cancel();
    } catch {}
    reader.releaseLock();
    flush();
    dispatch(stopStreaming());
  }
}
