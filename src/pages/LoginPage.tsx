import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/auth";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((s: RootState) => s.auth.token);

  const [login, { isLoading, isSuccess, data, isError }] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials(data));
      navigate("/chat", { replace: true });
    }
  }, [isSuccess, data, dispatch, navigate]);

  useEffect(() => {
    if (token) navigate("/chat", { replace: true });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl shadow w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Login</h1>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>

        {isError && (
          <p className="text-sm text-red-500 text-center">Login gagal</p>
        )}
      </form>
    </div>
  );
}
