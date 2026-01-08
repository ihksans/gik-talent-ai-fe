import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { resetChat } from "../store/chatSlice";

export default function Sidebar({ hidden }: { hidden?: boolean }) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <aside
      className={`h-full bg-gray-900 text-white flex flex-col
        ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}
        transition-opacity duration-200`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={() => dispatch(resetChat())}
          className="w-full bg-gray-800 hover:bg-gray-700 rounded px-3 py-2 text-sm"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <ChatItem title="Diskusi FastAPI" />
        <ChatItem title="Belajar ChatGPT API" />
        <ChatItem title="Puisi & Prosa" />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        Ihksan Setiawan
      </div>
    </aside>
  );
}

function ChatItem({ title }: { title: string }) {
  return (
    <div className="px-3 py-2 rounded hover:bg-gray-800 cursor-pointer truncate">
      {title}
    </div>
  );
}
