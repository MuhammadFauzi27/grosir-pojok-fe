import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify"; // 1. Import toast

export const LoginPage = () => {
  const navigate = useNavigate();

  // State UI (kasir / gudang)
  const [role, setRole] = useState("kasir");

  // State Form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // State Loading untuk UX
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Kirim username, password, DAN role sesuai kontrak API
      const response = await api.post("/auth/login", {
        username,
        password,
        role, // 'kasir' atau 'gudang'
      });

      const { token, pegawai } = response.data;

      // 3. Simpan token dan data user ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("pegawai", JSON.stringify(pegawai));

      // Tampilkan toast sukses
      toast.success(`Selamat datang, ${pegawai.nama}!`);

      // 4. Redirect berdasarkan role
      if (pegawai.role === "kasir") {
        navigate("/kasir");
      } else if (pegawai.role === "gudang") {
        navigate("/gudang");
      }
    } catch (error) {
      // 5. Tangkap error dari backend menggunakan toast
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Ini akan menangani status 401 ketika username/password benar tapi ROLE-nya salah
        toast.error(error.response.data.message);
      } else {
        toast.error("Terjadi kesalahan koneksi ke server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-sm overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
        <div className="h-2 bg-[#0b2154] w-full"></div>

        <div className="p-6 sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#0b2154] mb-1">
              Grosir Pojok
            </h1>
            <p className="text-sm text-gray-500">Sistem Informasi Internal</p>
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-xs font-bold tracking-wider text-gray-800 uppercase">
              Pilih Peran
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole("kasir")}
                className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-md border-2 transition-all ${
                  role === "kasir"
                    ? "border-[#0b2154] bg-blue-50/50 text-[#0b2154]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <line x1="8" x2="16" y1="6" y2="6" />
                  <line x1="16" x2="16" y1="14" y2="18" />
                  <path d="M16 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                </svg>
                <span className="text-sm font-semibold">Kasir</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("gudang")}
                className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-md border-2 transition-all ${
                  role === "gudang"
                    ? "border-[#0b2154] bg-blue-50/50 text-[#0b2154]"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
                <span className="text-sm font-semibold leading-tight text-center">
                  Pegawai Gudang
                </span>
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider text-gray-800 uppercase">
                ID Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan ID Anda"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold tracking-wider text-gray-800 uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2154] focus:border-[#0b2154] text-sm transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3.5 rounded-md font-semibold mt-2 flex items-center justify-center gap-2 transition-colors shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0b2154] hover:bg-blue-900"
              }`}
            >
              {loading ? "Memproses..." : "Masuk Sistem"}
              {!loading && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Versi 2.4.1 •{" "}
              <span className="font-bold text-[#0b2154] cursor-pointer hover:underline">
                Bantuan Teknis
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
