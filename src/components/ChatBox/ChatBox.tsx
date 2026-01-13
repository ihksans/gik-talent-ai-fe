import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  addUserMessage,
  setSessionId,
  setMessages,
} from "../../store/ChatSlice/chatSlice";
import { streamChat } from "../../api/chat";
import { LogOut } from "lucide-react";
import { logout } from "../../store/AuthSlice/authSlice";
import { useNavigate } from "react-router-dom";
import type { Props } from "./types";
import { getChatSession } from "../../api/chat";

export default function ChatBox({ onToggleSidebar, initialSessionId }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, streaming } = useSelector((s: RootState) => s.chat);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const sessionId = useSelector((s: RootState) => s.chat.sessionId);

  const [input, setInput] = useState("");
  const controllerRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (
      !initialSessionId ||
      (initialSessionId === sessionId && messages.length > 0)
    ) {
      return;
    }

    const loadSession = async () => {
      try {
        // Set loading state jika perlu
        const data = await getChatSession(initialSessionId);

        const mappedMessages = data.map((m: any) => ({
          role: m.role === "human" ? "user" : "assistant",
          content: m.content,
          date: m.date,
        }));

        dispatch(setSessionId(initialSessionId));
        dispatch(setMessages(mappedMessages));
      } catch (err) {
        console.error("Failed load session", err);
      }
    };

    loadSession();
  }, [initialSessionId, dispatch]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || streaming || !userId) return;

    let activeSessionId = sessionId;

    if (!activeSessionId) {
      activeSessionId = crypto.randomUUID();
      dispatch(setSessionId(activeSessionId));

      navigate(`/chat/${activeSessionId}`, { replace: true });
    }

    dispatch(addUserMessage(text));
    setInput("");

    const controller = new AbortController();
    controllerRef.current = controller;

    await streamChat(text, dispatch, controller, userId, activeSessionId);
  };

  const stop = () => {
    controllerRef.current?.abort();
  };

  const templates = [
    "Hi, dapatkah kamu membantu saya?",
    "Siapa saja backend yang sedang idle?",
    "Buatkan tim proyek beranggotakan 6 orang",
    "Siapa saja frontend yang menguasai react?",
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 hover:text-gray-900 text-xl"
        >
          ☰
        </button>

        <span className="font-semibold text-gray-700">Talent AI</span>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-end gap-3 mb-6">
            {templates.map((text, i) => (
              <button
                key={i}
                onClick={() => send(text)}
                className="
                  max-w-[75%]
                  px-4 py-3
                  rounded-2xl
                  border
                  bg-white
                  text-sm
                  text-gray-700
                  shadow
                  hover:bg-gray-50
                  text-left
                "
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => {
          const isAssistant = m.role === "assistant";
          const isStreamingAssistant =
            streaming && isAssistant && i === messages.length - 1;

          return (
            <div
              key={i}
              className={`flex ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`
                  max-w-[80%]
                  rounded-xl
                  px-4 py-2
                  text-sm
                  shadow
                  bg-white
                  ${isAssistant ? "text-gray-800" : "bg-blue-500"}
                `}
              >
                {/* STREAMING → TEXT */}
                {isStreamingAssistant ? (
                  <span className="whitespace-pre-wrap">
                    {m.content}
                    <span className="animate-pulse">▍</span>
                  </span>
                ) : (
                  <div
                    className="max-w-none"
                    dangerouslySetInnerHTML={{ __html: m.content }}
                  />
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />

        {!streaming ? (
          <button
            onClick={() => send(input)}
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
