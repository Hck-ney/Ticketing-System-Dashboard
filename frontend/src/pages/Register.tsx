import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '', role: 'user' })
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

        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 14 }}>
          Get help from your IT support team
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 36 }}>
          Submit support requests, track progress, and stay updated on technical issues affecting your work.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
          {[
            { icon: '🔒', text: 'Secure role-based access' },
            { icon: '🎫', text: 'Submit and track support tickets' },
            { icon: '📊', text: 'View ticket status and updates' },
            { icon: '💬', text: 'Communicate directly with IT support' },
          ].map(f => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
              </div>
              <span style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.85)' }}>{f.text}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 18px', position: 'relative' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0 }}>
            By creating an account, you agree to the IT department's usage policy. Admin approval may be required for elevated roles.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#fff', overflowY: 'auto' }}>
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
            <span style={{ fontSize: 13 }}>✨</span>
            <span style={{ fontSize: 12, fontWeight: 700 }}>Create your account</span>
          </div>

          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Get started</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28 }}>Fill in your details to create an account</p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>⚠️</span>
              <p style={{ fontSize: 14, color: '#EF4444', margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <span style={{ fontSize: 14 }}>✅</span>
              <p style={{ fontSize: 14, color: '#15803D', margin: 0 }}>Account created! Redirecting to login...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Full name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 17 }}>👤</span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  style={{ width: '100%', height: 46, paddingLeft: 42, paddingRight: 14, border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', fontSize: 15, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  style={{ width: '100%', height: 46, paddingLeft: 42, paddingRight: 14, border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', fontSize: 15, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
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
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  style={{ width: '100%', height: 46, paddingLeft: 42, paddingRight: 14, border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', fontSize: 15, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Age + Gender */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>
                  Age
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  required
                  min={18}
                  style={{ width: '100%', height: 46, padding: '0 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', fontSize: 15, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  required
                  style={{ width: '100%', height: 46, padding: '0 14px', border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', fontSize: 15, color: form.gender ? '#0f172a' : '#94a3b8', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', appearance: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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
              {loading ? 'Creating account...' : '→ Create account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            <span style={{ fontSize: 12, color: '#cbd5e1' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{ fontSize: 14, fontWeight: 700, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Sign in
            </button>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 28, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 13 }}>🔐</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>256-bit SSL encrypted · Your data is safe</span>
          </div>

        </div>
      </div>
    </div>
  )
}