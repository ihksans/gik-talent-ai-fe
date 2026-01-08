import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/chat", element: <ChatPage /> }],
  },
]);
