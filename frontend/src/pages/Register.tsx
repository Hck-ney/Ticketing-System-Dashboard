import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await registerUser(form)
    setLoading(false)
    if (res.error) return setError(res.error)
    setSuccess(true)
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center w-[45%] bg-blue-700 px-12 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🖥</span>
          </div>
          <span className="!text-white font-medium">IT Support Dashboard</span>
        </div>
        <h1 className="text-3xl font-medium !text-white mb-3">Join your IT support team</h1>
        <p className="!text-blue-200 text-sm leading-relaxed mb-8">
          Create your account and start managing IT issues across your organization today.
        </p>
        {['Secure role-based access', 'Track tickets in real time', 'Performance analytics', 'Internal notes and comments'].map(f => (
          <div key={f} className="flex items-center gap-3 mb-4">
            <span className="!text-blue-300 text-sm">✓</span>
            <span className="!text-blue-100 text-sm">{f}</span>
          </div>
        ))}
        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <p className="text-xs !text-blue-200 leading-relaxed">
            By creating an account, you agree to the IT department's usage policy.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12 bg-white overflow-y-auto">
        {/* Mobile brand */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🖥</span>
          </div>
          <span className="font-medium !text-gray-800 text-sm">IT Support Dashboard</span>
        </div>

        <h2 className="text-2xl font-medium !text-blue-700 mb-1">Create an account</h2>
        <p className="text-sm !text-gray-500 mb-8">Fill in your details to get started</p>

        {error && (
          <p className="!text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
            {error}
          </p>
        )}
        {success && (
          <p className="!text-green-600 text-sm mb-4 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
            Account created! Redirecting to login...
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium !text-gray-600 block mb-1.5">Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div>
            <label className="text-sm font-medium !text-gray-600 block mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div>
            <label className="text-sm font-medium !text-gray-600 block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          
          {/* Age + Gender side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium !text-gray-600 block mb-1.5">Age</label>
              <input
                type="number"
                placeholder="25"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                required
                min={18}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
            <div>
              <label className="text-sm font-medium !text-gray-600 block mb-1.5">Gender</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                required
                className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-blue-700 hover:bg-blue-800 !text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs !text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-sm !text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="!text-blue-700 font-medium hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}