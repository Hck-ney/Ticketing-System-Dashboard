import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { allTickets } from '../api/tickets'


const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  Open:        { bg: '#FEF9C3', color: '#A16207', dot: '#FACC15' },
  'In-progress': { bg: '#DBEAFE', color: '#1D4ED8', dot: '#3B82F6' },
  resolved:    { bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' },
  closed:      { bg: '#F3F4F6', color: '#4B5563', dot: '#9CA3AF' },
}

const priorityStyles: Record<string, { bg: string; color: string }> = {
  high:   { bg: '#FEE2E2', color: '#DC2626' },
  medium: { bg: '#FFEDD5', color: '#EA580C' },
  low:    { bg: '#F3F4F6', color: '#6B7280' },
  High:   { bg: '#FEE2E2', color: '#DC2626' },
  Medium: { bg: '#FFEDD5', color: '#EA580C' },
  Low:    { bg: '#F3F4F6', color: '#6B7280' },
}

const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🎫', label: 'Tickets', id: 'tickets' },
  { icon: '👥', label: 'Users', id: 'users' },
  { icon: '📈', label: 'Analytics', id: 'analytics' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

// Stats are now fetched from the backend; initial placeholder removed

const activeTickets = [
  { id: '#1042', title: 'Cannot connect to Wi-Fi', status: 'pending', priority: 'high', user: 'Maria Santos', time: '10 mins ago' },
  { id: '#1041', title: 'Monitor not detected', status: 'in_progress', priority: 'medium', user: 'John Reyes', time: '1 hr ago' },
  { id: '#1040', title: 'Outlook not opening', status: 'resolved', priority: 'low', user: 'Ana Cruz', time: '2 hrs ago' },
  { id: '#1039', title: 'Printer offline', status: 'pending', priority: 'high', user: 'Carlo Lim', time: '3 hrs ago' },
  { id: '#1038', title: 'Account locked', status: 'in_progress', priority: 'medium', user: 'Rica Dela Cruz', time: '5 hrs ago' },
]

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export default function Employee_Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [ticketList, setTicketList] = useState<UserTicket[]>([])

  type UserTicket = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    created_at: string
    user_id: number
    users: {
      name: string
    }
  }
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    loading
    const fetchData = async () => {
      try {
        const statsData = await allTickets()
        setTicketList(statsData.tickets)
        console.log('Fetched stats:', statsData)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  
  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🖥</span>
          </div>
          <div>
            <p className="text-sm font-medium !text-gray-900">IT Support</p>
            <p className="text-xs !text-gray-400">Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${active === item.id
                ? 'bg-blue-50 !text-blue-700 font-medium'
                : '!text-gray-500 hover:bg-gray-50 hover:!text-gray-700'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium !text-gray-900 truncate">{user?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-sm !text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden !text-gray-500 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg font-medium !text-gray-900">IT Support Dashboard</h1>
              <p className="text-xs !text-gray-400 hidden sm:block">
                Welcome back, {user?.name} 👋
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 !text-gray-400 hover:!text-gray-600 cursor-pointer">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6 overflow-y-auto">

          

          

          {/* Recent tickets table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium !text-gray-900">Active Tickets</h2>
              <button className="text-xs !text-blue-700 hover:underline cursor-pointer">View all</button>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-medium !text-gray-400">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-medium !text-gray-400">Title</th>
                    <th className="text-left px-5 py-3 text-xs font-medium !text-gray-400">Submitted by</th>
                    <th className="text-left px-5 py-3 text-xs font-medium !text-gray-400">Priority</th>
                    <th className="text-left px-5 py-3 text-xs font-medium !text-gray-400">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium !text-gray-400">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketList.map((ticket, i) => (
                    <tr key={ticket.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === activeTickets.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-5 py-3 text-xs font-medium !text-blue-700">{ticket.id}</td>
                      <td className="px-5 py-3 !text-gray-700 font-medium">{ticket.title}</td>
                      <td className="px-5 py-3 !text-gray-500 text-xs">{ticket.users.name}</td>
                      
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[ticket.priority]}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      {/* <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[ticket.status]}`}>
                          {statusLabel[ticket.status]}
                        </span>
                      </td> */}
                      <td className="px-5 py-3 !text-gray-500 text-xs">{ticket.status}</td>
                      <td className="px-5 py-3 text-xs !text-gray-400">{ticket.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status bar chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium !text-gray-900">Ticket Status Overview</h2>
              <span className="text-xs !text-gray-400">Last 7 days</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Resolved', value: 66, total: 128, color: 'bg-green-500' },
                { label: 'Pending', value: 34, total: 128, color: 'bg-yellow-400' },
                { label: 'In Progress', value: 28, total: 128, color: 'bg-blue-500' },
              ].map(bar => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="text-xs !text-gray-500 w-20 shrink-0">{bar.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bar.color}`}
                      style={{ width: `${(bar.value / bar.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs !text-gray-500 w-6 text-right">{bar.value}</span>
                </div>
              ))}
            </div>
          </div>

            {/* Mobile ticket cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {activeTickets.map(ticket => (
                <div key={ticket.id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-medium !text-blue-700">{ticket.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[ticket.status]}`}>
                      {statusLabel[ticket.status]}
                    </span>
                  </div>
                  <p className="text-sm font-medium !text-gray-800 mb-1">{ticket.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs !text-gray-400">{ticket.user}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyles[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}