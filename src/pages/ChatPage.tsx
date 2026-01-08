import ChatBox from "../components/ChatBox";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative h-screen">
      {/* Logout button */}
      <button
        onClick={onLogout}
        className="absolute top-4 right-4 flex items-center gap-2 
                   bg-red-500 hover:bg-red-600 text-white 
                   px-4 py-2 rounded-lg shadow"
      >
        <LogOut size={18} />
        Logout
      </button>

      {/* Chat */}
      <ChatBox />
    </div>
  );
}
