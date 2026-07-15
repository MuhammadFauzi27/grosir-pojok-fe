import axios from "axios";

// 1. Inisialisasi Axios Instance dengan Base URL Backend
const api = axios.create({
  baseURL: "https://grosir-pojok-be.vercel.app/v1", // URL backend lokal dari API Contract
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: Otomatis masukkan Token JWT ke Header
api.interceptors.request.use(
  (config) => {
    // Kita asumsikan token nanti disimpan di localStorage dengan nama 'token'
    const token = localStorage.getItem("token");

    // Jika token ada, sisipkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Response Interceptor: Otomatis tendang user ke Login kalau token mati/invalid
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Cek apakah error 401 dan pastikan BUKAN berasal dari request login
    // Ini agar saat skenario salah role/password, halaman tidak membalak me-refresh sendiri
    const isLoginRequest =
      error.config && error.config.url.includes("/auth/login");

    // Tangkap error 401 Unauthorized dari backend hanya untuk request SELAIN login
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      console.error("Session expired or unauthorized. Redirecting to login...");
      // Bersihkan sisa data lama
      localStorage.removeItem("token");
      localStorage.removeItem("pegawai");

      // Tendang paksa ke halaman login
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
