import { AppRouter } from "./routes/appRouter.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Wajib dipanggil agar desain toast-nya muncul

export const App = () => {
  return (
    <>
      {/* AppRouter menangani semua halaman */}
      <AppRouter />

      {/* ToastContainer dipasang di sini agar bisa diakses dari halaman manapun */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};
