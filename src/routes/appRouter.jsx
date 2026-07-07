import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { LandingPage } from "../pages/landing-page/index.jsx";
import { LoginPage } from '../pages/landing-page/login.jsx'
import { GudangPage } from '../pages/landing-page/gudang.jsx'
import { TambahBarangPage } from '../pages/landing-page/tambahBarang.jsx'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={< LoginPage />} />
        <Route path="/gudang" element={< GudangPage />} />
        <Route path="/tambah-barang" element={< TambahBarangPage />} />
      </Routes>
    </BrowserRouter>
  )
}