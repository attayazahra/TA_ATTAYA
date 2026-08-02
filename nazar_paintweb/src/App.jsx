import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/User/DashboardPage'      // ← ini sudah jadi landing page
import KalkulatorPage from './pages/User/KalkulatorPage'
import WarnaPage from './pages/User/WarnaPage'
import RekomendasiPage from './pages/User/RekomendasiPage'
import AdminLogin from './pages/Admin/AdminLogin'        
import ResetPassword from './pages/Admin/ResetPassword'
import AdminDashboard from './pages/Admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Dashboard />} />
        
        <Route path="/kalkulator" element={<KalkulatorPage />} />
        <Route path="/warna" element={<WarnaPage />} />
        <Route path="/rekomendasi" element={<RekomendasiPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App