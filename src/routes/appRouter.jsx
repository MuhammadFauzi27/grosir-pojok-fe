import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { LandingPage } from "../pages/landing-page/index.jsx";
import { LoginPage } from '../pages/landing-page/login.jsx'
import { GudangPage } from '../pages/landing-page/gudang.jsx'
import { TambahBarangPage } from '../pages/landing-page/tambahBarang.jsx'
import { KasirPage } from '../pages/landing-page/kasir.jsx'
import { NotaKasirPage } from '../pages/landing-page/notaKasir.jsx'
import { RiwayatKasirPage } from '../pages/landing-page/riwayatkasir.jsx'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={< LoginPage />} />
        <Route path="/gudang" element={< GudangPage />} />
        <Route path="/tambah-barang" element={< TambahBarangPage />} />
        <Route path="/kasir" element={< KasirPage />} />
        <Route path="/nota-kasir/:no_nota" element={< NotaKasirPage />} />
        <Route path="/riwayat-kasir" element={< RiwayatKasirPage />} />
      </Routes>
    </BrowserRouter>
  )
}