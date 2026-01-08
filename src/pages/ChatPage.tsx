import { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/SideBar";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SideBar */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <SideBar hidden={!sidebarOpen} />
      </div>
      {/* Main Chat */}
      <div className="flex-1 relative">
        <ChatBox
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />
      </div>
    </div>
  );
}
