import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from "../pages/landing-page/index.jsx";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}