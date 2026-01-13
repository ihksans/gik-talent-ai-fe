import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  resetChat,
  setSessionId,
  setOpeningSession,
} from "../../store/ChatSlice/chatSlice";
import { getChatHistory } from "../../api/chat";
import ChatItem from "./ChatItem";

type ChatHistoryItem = {
  id: string;
  title: string;
  date: string;
};

export default function SideBar({ hidden }: { hidden?: boolean }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const userId = useSelector((s: RootState) => s.auth.userId);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Load chat history
  useEffect(() => {
    if (!userId) return;

    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await getChatHistory(userId);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [userId]);

  // New Chat
  const onNewChat = () => {
    dispatch(resetChat());
    navigate("/chat");
  };

  // Open existing chat
  const openChat = (sessionId: string) => {
    dispatch(setOpeningSession(true));
    dispatch(setSessionId(sessionId));
    navigate(`/chat/${sessionId}`);
  };

  return (
    <aside
      className={`h-full bg-gray-900 text-white flex flex-col
        ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}
        transition-opacity duration-200`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading && (
          <div className="text-xs text-gray-400 px-3 py-2">Loading...</div>
        )}

        {!loading && history.length === 0 && (
          <div className="text-xs text-gray-500 px-3 py-2">No chats yet</div>
        )}

        {history.map((item) => (
          <ChatItem
            key={item.id}
            title={item.title}
            date={item.date}
            onClick={() => openChat(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}
