import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/auth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await loginUser({ email, password })
    setLoading(false)
    if (res.error) return setError(res.error)
    login(res.token, res.user)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-center w-[45%] bg-blue-700 px-12 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🖥</span>
          </div>
          <span className="!text-white font-medium">IT Support Dashboard</span>
        </div>
        <h1 className="text-3xl font-medium !text-white mb-3">Manage IT tickets with ease</h1>
        <p className="!text-blue-200 text-sm leading-relaxed mb-8">
          A centralized platform for tracking, assigning, and resolving IT issues across your organization.
        </p>
        {['Create and track support tickets', 'Role-based access for all staff', 'Analytics and performance reports', 'Real-time notifications'].map(f => (
          <div key={f} className="flex items-center gap-3 mb-4">
            <span className="!text-blue-300 text-sm">✓</span>
            <span className="!text-blue-100 text-sm">{f}</span>
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-white">
        {/* Mobile brand header */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🖥</span>
          </div>
          <span className="font-medium text-gray-800 text-sm">IT Support Dashboard</span>
        </div>

        <h2 className="text-2xl font-medium !text-blue-700 mb-1">Welcome back</h2>
        <p className="text-sm !text-gray-500 mb-8">Sign in to your account to continue</p>

        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium !text-gray-600 block mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div>
            <label className="text-sm font-medium !text-gray-600 block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-blue-700 hover:bg-blue-800 !text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {error && (
          <p className="!text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            {error}
          </p>
        )}
        
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs !text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm !text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="!text-blue-700 font-medium hover:underline cursor-pointer"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  )
}