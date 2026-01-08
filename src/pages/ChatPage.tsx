import { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/SideBar";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        />
      </div>
    </div>
  );
}
