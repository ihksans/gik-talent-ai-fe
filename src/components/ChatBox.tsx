import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { addUserMessage } from "../store/chatSlice";
import { streamChat } from "../api/chat";
import { LogOut } from "lucide-react";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

type Props = {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
};

export default function ChatBox({ onToggleSidebar }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, streaming } = useSelector((s: RootState) => s.chat);

  const [input, setInput] = useState("");
  const controllerRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const stop = () => {
    controllerRef.current?.abort();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    dispatch(addUserMessage(text));

    const controller = new AbortController();
    controllerRef.current = controller;

    await streamChat(text, dispatch, controller);
  };

  const templates = [
    "Siapa saja backend yang sedang idle?",
    "Buatkan tim proyek beranggotakan 6 orang berisikan pm, be, fe, qa",
    "Siapa saja frontend yang menguasai react?",
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="p-4 border-b bg-white flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="text-gray-600 hover:text-gray-900 text-xl"
          >
            ☰
          </button>
        </div>
        <span className="font-semibold text-gray-700">Talent AI</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm 
                    text-red-600 hover:text-red-700"
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
                onClick={() => sendMessage(text)}
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
              transition
              text-left
            "
              >
                {text}
              </button>
            ))}
          </div>
        )}

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
