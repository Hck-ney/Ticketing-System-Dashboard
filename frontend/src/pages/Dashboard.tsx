import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createTicket, userTickets } from '../api/tickets'
import { toast } from 'sonner'

const myTickets = [
  { id: '#1042', title: 'Cannot connect to Wi-Fi', status: 'pending', priority: 'high', created: 'May 28, 2026', updated: '10 mins ago', description: 'Wi-Fi adapter is not detecting any networks since this morning.' },
  { id: '#1039', title: 'Printer offline', status: 'pending', priority: 'high', created: 'May 27, 2026', updated: '3 hrs ago', description: 'Office printer on 3rd floor shows offline in Windows settings.' },
  { id: '#1035', title: 'Outlook not syncing', status: 'resolved', priority: 'medium', created: 'May 25, 2026', updated: 'May 26, 2026', description: 'Emails not syncing automatically, had to manually refresh.' },
  { id: '#1031', title: 'VPN connection drops', status: 'in_progress', priority: 'medium', created: 'May 24, 2026', updated: 'May 25, 2026', description: 'VPN disconnects every 10–15 minutes when working remotely.' },
  { id: '#1028', title: 'Monitor flickering', status: 'closed', priority: 'low', created: 'May 20, 2026', updated: 'May 22, 2026', description: 'Secondary monitor flickers intermittently during use.' },
]

const statusStyle: Record<string, { bg: string; color: string; dot: string }> = {
  pending: { bg: '#FEF9C3', color: '#A16207', dot: '#FACC15' },
  in_progress: { bg: '#DBEAFE', color: '#1D4ED8', dot: '#3B82F6' },
  resolved: { bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' },
  closed: { bg: '#F3F4F6', color: '#4B5563', dot: '#9CA3AF' },
}

const priorityStyle: Record<string, { bg: string; color: string }> = {
  high: { bg: '#FEE2E2', color: '#DC2626' },
  medium: { bg: '#FFEDD5', color: '#EA580C' },
  low: { bg: '#F3F4F6', color: '#6B7280' },
}

const statusLabel: Record<string, string> = {
  pending: 'Pending', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed',
}

const navItems = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '🎫', label: 'My Tickets', id: 'tickets' },
  { icon: '➕', label: 'New Ticket', id: 'new' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<typeof myTickets[0] | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const Ticket = { title: '', description: '', priority: '', status: 'Open', user_id: user?.id }
  const [newTicket, setNewTicket] = useState(Ticket)
  const [isLoading, setIsLoading] = useState(false)
  // const TicketList = {
  //   assigned_employee_id: '', closed_at: '', comment: '', created_at: "", description: "", id: 0, priority: "", status: "", title: "", user_id: 0
  // }
  const [userTicketList, setUserTicketList] = useState<UserTicket[]>([])
  const handleLogout = () => { logout(); navigate('/login') }


  const CreateTicket = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.priority) {
      alert('Please fill in all fields and select a priority level.');
      return;
    }
    //console.log(newTicket);
    setIsLoading(true);
    try {
      await createTicket(newTicket)
      setShowNewModal(false);
      toast.success('Ticket submitted successfully!');
    }
    catch (error) {
      console.error('Error creating ticket:', error);
      setShowNewModal(false);
    }
    finally {
      setIsLoading(false);
    }
  }

  const fetchTickets = async () => {
    try {
      const data = await userTickets(user?.id || 0)
      setUserTicketList(data.tickets)
    }
    catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  }

  ``
  const stats = [
    { label: 'Total Submitted Tickets', value: userTicketList.length.toString(), bg: '#EFF6FF', iconBg: '#DBEAFE', color: '#1D4ED8', icon: '🎫' },
    { label: 'Active Tickets', value: userTicketList.filter(ticket => ticket.status !== 'Closed').length, bg: '#FEFCE8', iconBg: '#FEF9C3', color: '#A16207', icon: '⏳' },
    { label: 'In Progress',  value: userTicketList.filter(ticket => ticket.status === 'In-progress').length, bg: '#FAF5FF', iconBg: '#F3E8FF', color: '#7E22CE', icon: '🔧' },
    { label: 'Resolved', value: userTicketList.filter(ticket => ticket.status === 'Resolved').length, bg: '#F0FDF4', iconBg: '#DCFCE7', color: '#15803D', icon: '✅' },
  ]

  type UserTicket = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  created_at: string
  user_id: number
}

  return (
    useEffect(() => {
      fetchTickets()
    }, []),
    console.log('asd',userTicketList.filter(ticket => ticket.status === 'In-progress').length.toString()),
    <div style={{ height: '100vh', display: 'flex', fontFamily: 'system-ui, sans-serif', background: '#F8FAFC', overflow: 'hidden' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col lg:relative lg:translate-x-0 lg:z-auto transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 240, background: '#fff', borderRight: '1px solid #F1F5F9', flexShrink: 0 }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ width: 38, height: 38, background: '#185FA5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20 }}>🖥</span>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>IT Support</p>
            <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>Help Center</p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => {
                if (item.id === 'new') { setShowNewModal(true); setSidebarOpen(false) }
                else { setActive(item.id); setSidebarOpen(false) }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer', width: '100%',
                textAlign: 'left', fontSize: 14, fontWeight: active === item.id ? 600 : 400,
                background: item.id === 'new' ? '#EFF6FF' : active === item.id ? '#EFF6FF' : 'transparent',
                color: item.id === 'new' ? '#185FA5' : active === item.id ? '#185FA5' : '#64748B',
                transition: 'all 0.15s', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '14px 12px', borderTop: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>User</p>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '8px', borderRadius: 8, border: 'none', background: 'transparent', color: '#EF4444', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            🚪 Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>

        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '1px solid #F1F5F9', padding: '0 28px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}
              style={{ fontSize: 22, background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>☰</button>
            <div>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0, textTransform: 'capitalize' }}>
                {active === 'overview' ? 'My Dashboard' : active === 'tickets' ? 'My Tickets' : 'Settings'}
              </p>
              <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: 6 }}>
              🔔
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: '#EF4444', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12, borderLeft: '1px solid #F1F5F9' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }} className="hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>

          {/* Welcome banner */}
          <div style={{ background: '#185FA5', borderRadius: 16, padding: '22px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 5px' }}>
                Hi, {user?.name?.split(' ')[0]} 👋
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                Track your IT support requests and stay updated on their status.
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              style={{ background: '#fff', color: '#185FA5', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}
              className="hidden sm:block"
            >
              + New Ticket
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ background: stat.bg, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ width: 38, height: 38, background: stat.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>
                  {stat.icon}
                </div>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '0 0 3px' }}>{stat.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My Tickets */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>My Recent Tickets</p>
              <button
                onClick={() => setShowNewModal(true)}
                style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', background: '#EFF6FF', border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                + New Ticket
              </button>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    {['ID', 'Issue', 'Priority', 'Status', 'Last Updated', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '13px 22px', fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myTickets.map(ticket => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #F8FAFC', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => setSelectedTicket(ticket)}>
                      <td style={{ padding: '15px 22px', fontSize: 13, fontWeight: 700, color: '#185FA5' }}>{ticket.id}</td>
                      <td style={{ padding: '15px 22px', fontSize: 14, fontWeight: 600, color: '#0F172A', maxWidth: 280 }}>
                        <p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.description}</p>
                      </td>
                      <td style={{ padding: '15px 22px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: priorityStyle[ticket.priority].bg, color: priorityStyle[ticket.priority].color }}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '15px 22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusStyle[ticket.status].dot, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: statusStyle[ticket.status].color }}>
                            {statusLabel[ticket.status]}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '15px 22px', fontSize: 12, color: '#94A3B8' }}>{ticket.updated}</td>
                      <td style={{ padding: '15px 22px' }}>
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedTicket(ticket) }}
                          style={{ fontSize: 12, fontWeight: 600, color: '#185FA5', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden">
              {myTickets.map(ticket => (
                <div key={ticket.id}
                  style={{ padding: '16px 20px', borderBottom: '1px solid #F8FAFC', cursor: 'pointer' }}
                  onClick={() => setSelectedTicket(ticket)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#185FA5' }}>{ticket.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: statusStyle[ticket.status].dot }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: statusStyle[ticket.status].color }}>
                        {statusLabel[ticket.status]}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: '0 0 4px' }}>{ticket.title}</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>Updated {ticket.updated}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: priorityStyle[ticket.priority].bg, color: priorityStyle[ticket.priority].color }}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── Ticket Detail Modal ── */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setSelectedTicket(null)}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, padding: '28px 32px', boxSizing: 'border-box' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', margin: '0 0 4px' }}>{selectedTicket.id}</p>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>{selectedTicket.title}</h2>
              </div>
              <button onClick={() => setSelectedTicket(null)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                ✕
              </button>
            </div>

            {/* Status banner */}
            <div style={{ background: statusStyle[selectedTicket.status].bg, borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: statusStyle[selectedTicket.status].dot }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: statusStyle[selectedTicket.status].color }}>
                {statusLabel[selectedTicket.status]}
              </span>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 5px' }}>Description</p>
                <p style={{ fontSize: 14, color: '#374151', margin: 0, lineHeight: 1.6 }}>{selectedTicket.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 5px' }}>Priority</p>
                  <span style={{ fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: priorityStyle[selectedTicket.priority].bg, color: priorityStyle[selectedTicket.priority].color }}>
                    {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 5px' }}>Date Created</p>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, fontWeight: 500 }}>{selectedTicket.created}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 5px' }}>Last Updated</p>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, fontWeight: 500 }}>{selectedTicket.updated}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedTicket(null)}
              style={{ width: '100%', height: 44, background: '#F1F5F9', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── New Ticket Modal ── */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={() => setShowNewModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 480, padding: '28px 32px', boxSizing: 'border-box' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>Submit New Ticket</h2>
              <button onClick={() => setShowNewModal(false)}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 8, width: 32, height: 32, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 7 }}>Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cannot connect to Wi-Fi"
                  value={newTicket.title}
                  onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                  style={{ width: '100%', height: 44, padding: '0 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#0F172A', background: '#F8FAFC', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 7 }}>Description</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={newTicket.description}
                  onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E2E8F0', borderRadius: 10, fontSize: 14, color: '#0F172A', background: '#F8FAFC', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#185FA5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 7 }}>Priority</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { value: 'low', label: 'Low', bg: '#F3F4F6', color: '#6B7280', activeBg: '#F3F4F6', activeColor: '#374151' },
                    { value: 'medium', label: 'Medium', bg: '#FFEDD5', color: '#EA580C', activeBg: '#FFEDD5', activeColor: '#EA580C' },
                    { value: 'high', label: 'Critical', bg: '#FEE2E2', color: '#DC2626', activeBg: '#FEE2E2', activeColor: '#DC2626' },
                  ].map(p => (
                    <button key={p.value}
                      onClick={() => setNewTicket({ ...newTicket, priority: p.value })}
                      style={{
                        padding: '10px', borderRadius: 10, border: newTicket.priority === p.value ? `2px solid ${p.color}` : '1.5px solid #E2E8F0',
                        background: newTicket.priority === p.value ? p.bg : '#fff',
                        color: newTicket.priority === p.value ? p.color : '#94A3B8',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s'
                      }}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowNewModal(false)}
                style={{ flex: 1, height: 44, background: '#F1F5F9', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button
                onClick={CreateTicket}
                disabled={isLoading}
                style={{ flex: 2, height: 44, background: '#185FA5', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                {isLoading ? 'Submitting...' : 'Submit Ticket →'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}