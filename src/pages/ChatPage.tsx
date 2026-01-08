import { useState } from "react";
import ChatBox from "../components/ChatBox";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";

export default function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

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
