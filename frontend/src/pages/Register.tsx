import { useState } from 'react'
import { registerUser } from '../api/auth'

const roles = [
  { value: 'employee', label: 'Employee', icon: '👤' },
  { value: 'technician', label: 'Technician', icon: '🔧' },
  { value: 'admin', label: 'Admin', icon: '🛡' },
]

export default function Register({ onSwitch }: { onSwitch: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' })
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
    setTimeout(() => onSwitch(), 1500)
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center w-[45%] bg-blue-700 px-12 py-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg">🖥</span>
          </div>
          <span className="text-white font-medium">IT Support Dashboard</span>
        </div>
        <h1 className="text-3xl font-medium text-white mb-3">Join your IT support team</h1>
        <p className="text-blue-200 text-sm leading-relaxed mb-8">
          Create your account and start managing IT issues across your organization today.
        </p>
        {['Secure role-based access', 'Track tickets in real time', 'Performance analytics', 'Internal notes and comments'].map(f => (
          <div key={f} className="flex items-center gap-3 mb-4">
            <span className="text-blue-300">✓</span>
            <span className="text-blue-100 text-sm">{f}</span>
          </div>
        ))}
        <div className="mt-8 p-4 bg-white/10 rounded-lg">
          <p className="text-xs text-blue-200 leading-relaxed">
            By creating an account, you agree to the IT department's usage policy. Admin approval may be required for elevated roles.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white overflow-y-auto">
        <h2 className="text-2xl font-medium text-gray-900 mb-1">Create an account</h2>
        <p className="text-sm text-gray-500 mb-8">Fill in your details to get started</p>
        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 bg-green-50 px-3 py-2 rounded-lg">Account created! Redirecting to login...</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Full name</label>
            <input type="text" placeholder="Ian Marquez" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Email address</label>
            <input type="email" placeholder="you@company.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Password</label>
            <input type="password" placeholder="Min. 8 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8}
              className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">Select your role</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button type="button" key={r.value}
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`border rounded-lg py-3 text-center transition-all ${form.role === r.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-blue-300'}`}>
                  <div className="text-xl mb-1">{r.icon}</div>
                  <div className="text-xs font-medium">{r.label}</div>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-blue-700 font-medium hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  )
}