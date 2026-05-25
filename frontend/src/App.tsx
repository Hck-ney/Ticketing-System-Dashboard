import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/AuthContext'

function AuthPages() {
  const [page, setPage] = useState<'login' | 'register'>('login')
  return page === 'login'
    ? <Login onSwitch={() => setPage('register')} />
    : <Register onSwitch={() => setPage('login')} />
}

function App() {
  const { token } = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPages />} />
        <Route path="/dashboard" element={token ? <div>Dashboard coming soon</div> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Navigate to="/register" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App