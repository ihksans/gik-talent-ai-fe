import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Talent AI</h1>
        <button
          onClick={() => navigate("/chat")}
          className="px-4 py-2 text-sm rounded-lg bg-white text-black hover:bg-gray-200 transition"
        >
          Start Chat
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Think. Ask. Create.
        </h2>

        <p className="text-gray-300 max-w-xl mb-8">
          Talent AI membantu mencari talenta yang sesuai dengan kebutuhan
          proyek. Dapatkan rekomendasi talenta terbaik dengan cepat dan mudah.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 rounded-xl bg-blue-500"
        >
          Mulai
        </button>
      </main>

      {/* Footer */}
      <footer className="p-4 text-sm text-gray-400 text-center">
        © {new Date().getFullYear()} Ihksan Setiawan - Attoriq Gerhana Firdaus.
        All rights reserved.
      </footer>
    </div>
  );
}
