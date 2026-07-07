import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { LandingPage } from "../pages/landing-page/index.jsx";
import { LoginPage } from '../pages/landing-page/login.jsx'

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={< LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}