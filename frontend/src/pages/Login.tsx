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
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Left panel ── */}
      <div style={{
        width: '42%', background: '#185FA5', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '56px 48px', position: 'relative', overflow: 'hidden',
        flexShrink: 0
      }} className="hidden lg:flex">
        <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 44, position: 'relative' }}>
          <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>🖥</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 0.2 }}>IT Support Dashboard</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 14 }}>
          Resolve IT issues faster, together
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 36 }}>
          A centralized platform for tracking, assigning, and resolving IT issues across your organization.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {[
            { icon: '🎫', text: 'Create and track support tickets' },
            { icon: '👥', text: 'Role-based access for all staff' },
            { icon: '📈', text: 'Analytics and performance reports' },
            { icon: '🔔', text: 'Real-time notifications' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
              </div>
              <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.85)' }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 36, position: 'relative' }}>
          {[['98%', 'Resolution rate'], ['2.4h', 'Avg. response time']].map(([num, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile brand */}
          <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 34, height: 34, background: '#185FA5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16 }}>🖥</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>IT Support Dashboard</span>
          </div>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EBF3FF', color: '#185FA5', borderRadius: 20, padding: '5px 12px', marginBottom: 20 }}>
            <span style={{ fontSize: 13 }}>🔒</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Secure access</span>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Welcome back</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28 }}>Sign in to your account to continue</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <p style={{ fontSize: 14, color: '#EF4444' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 17 }}>✉️</span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', height: 46, paddingLeft: 42, paddingRight: 14,
                    border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc',
                    fontSize: 15, color: '#0f172a', outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 17 }}>🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', height: 46, paddingLeft: 42, paddingRight: 14,
                    border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc',
                    fontSize: 15, color: '#0f172a', outline: 'none', fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 48, background: loading ? '#93c5fd' : '#185FA5',
                color: '#fff', border: 'none', borderRadius: 12, fontSize: 16,
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'background 0.15s', marginTop: 4
              }}
            >
              {loading ? 'Signing in...' : '→ Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            <span style={{ fontSize: 12, color: '#cbd5e1' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              style={{ fontSize: 14, fontWeight: 700, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Create one
            </button>
          </p>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 13 }}>🔐</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>256-bit SSL encrypted · Your data is safe</span>
          </div>

        </div>
      </div>
    </div>
  )
}