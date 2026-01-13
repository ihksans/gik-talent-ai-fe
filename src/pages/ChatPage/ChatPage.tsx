import { useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import SideBar from "../../components/SideBar/SideBar";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { sessionId } = useParams();

  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 bg-gray-900 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <SideBar />
      </div>

      {/* Main area */}
      <div className="flex-1 relative">
        {/* Logout button */}
        <ChatBox
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
          initialSessionId={sessionId}
        />
      </div>
    </div>
  );
}
