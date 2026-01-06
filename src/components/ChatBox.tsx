import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { addUserMessage } from "../store/chatSlice";
import { streamChat } from "../api/chat";

export default function ChatBox() {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, streaming } = useSelector((s: RootState) => s.chat);

  const [input, setInput] = useState("");
  const controllerRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;

    dispatch(addUserMessage(input));
    setInput("");

    const controller = new AbortController();
    controllerRef.current = controller;

    await streamChat(input, dispatch, controller);
  };

  const stop = () => {
    controllerRef.current?.abort();
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-100">
      {/* Header */}
      <div className="p-4 border-b bg-white font-semibold text-gray-700">
        💬 AI Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed shadow
                ${
                  m.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
            >
              {m.content || <span className="opacity-40 italic">...</span>}
            </div>
          </div>
        ))}

        {streaming && (
          <div className="text-sm text-gray-400 italic">AI is typing…</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />

        {!streaming ? (
          <button
            onClick={send}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        ) : (
          <button
            onClick={stop}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
