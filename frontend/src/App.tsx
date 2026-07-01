import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Employee_Dashboard from './pages/EmployeeDashboard'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/useAuth'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const { token, user } = useAuth()
  return (
    <>
      <Toaster position="top-right" richColors />

      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={
              !token ? <Login /> :
                user?.role === 'user'
                  ? <Navigate to="/dashboard" />
                  : <Navigate to="/employee-dashboard" />
            } />
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/employee-dashboard" />} />
            <Route path="/employee-dashboard" element={user?.role === 'employee' && token ? <Employee_Dashboard /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={user?.role === 'user' && token ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App