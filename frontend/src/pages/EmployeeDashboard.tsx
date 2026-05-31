import { getTickets, getStats } from '../api/tickets'

// export default function Dashboard() {
//   const [tickets, setTickets] = useState([])
//   const [stats, setStats] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const ticketsData = await getTickets()
//         const statsData = await getStats()
//         setTickets(ticketsData)
//         setStats(statsData)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   if (loading) return <div>Loading...</div>

//   // Now use tickets and stats in your JSX
// }

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🎫', label: 'Tickets', id: 'tickets' },
  { icon: '👥', label: 'Users', id: 'users' },
  { icon: '📈', label: 'Analytics', id: 'analytics' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

// Stats are now fetched from the backend; initial placeholder removed

const recentTickets = [
  { id: '#1042', title: 'Cannot connect to Wi-Fi', status: 'pending', priority: 'high', user: 'Maria Santos', time: '10 mins ago' },
  { id: '#1041', title: 'Monitor not detected', status: 'in_progress', priority: 'medium', user: 'John Reyes', time: '1 hr ago' },
  { id: '#1040', title: 'Outlook not opening', status: 'resolved', priority: 'low', user: 'Ana Cruz', time: '2 hrs ago' },
  { id: '#1039', title: 'Printer offline', status: 'pending', priority: 'high', user: 'Carlo Lim', time: '3 hrs ago' },
  { id: '#1038', title: 'Account locked', status: 'in_progress', priority: 'medium', user: 'Rica Dela Cruz', time: '5 hrs ago' },
]

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 !text-yellow-700',
  in_progress: 'bg-blue-100 !text-blue-700',
  resolved: 'bg-green-100 !text-green-700',
  closed: 'bg-gray-100 !text-gray-600',
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 !text-red-600',
  medium: 'bg-orange-100 !text-orange-600',
  low: 'bg-gray-100 !text-gray-500',
}

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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    loading 
    const fetchData = async () => {
      try {
        const statsData = await getStats()
        const formattedStats = [
          {
            label: 'Total Tickets',
            value: (statsData.total ?? 0).toString(),
            change: '+12 this week',
            color: 'bg-blue-50 !text-blue-700',
            icon: '🎫',
          },
          {
            label: 'Pending',
            value: (statsData.pending ?? 0).toString(),
            change: '5 high priority',
            color: 'bg-yellow-50 !text-yellow-700',
            icon: '⏳',
          },
          {
            label: 'In Progress',
            value: (statsData.in_progress ?? 0).toString(),
            change: '8 assigned today',
            color: 'bg-purple-50 !text-purple-700',
            icon: '🔧',
          },
          {
            label: 'Resolved',
            value: (statsData.resolved ?? 0).toString(),
            change: '+8 since yesterday',
            color: 'bg-green-50 !text-green-700',
            icon: '✅',
          },
        ]
        setStats(formattedStats)
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
              <h1 className="text-lg font-medium !text-gray-900">Dashboard</h1>
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

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3 ${stat.color}`}>
                  {stat.icon}
                </div>
                <p className="text-2xl font-medium !text-gray-900">{stat.value}</p>
                <p className="text-xs !text-gray-500 mt-0.5">{stat.label}</p>
                <p className="text-xs !text-green-600 mt-1">{stat.change}</p>
              </div>
            ))}
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

          {/* Recent tickets table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium !text-gray-900">Recent Tickets</h2>
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
                  {recentTickets.map((ticket, i) => (
                    <tr key={ticket.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === recentTickets.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-5 py-3 text-xs font-medium !text-blue-700">{ticket.id}</td>
                      <td className="px-5 py-3 !text-gray-700 font-medium">{ticket.title}</td>
                      <td className="px-5 py-3 !text-gray-500 text-xs">{ticket.user}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[ticket.priority]}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[ticket.status]}`}>
                          {statusLabel[ticket.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs !text-gray-400">{ticket.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile ticket cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {recentTickets.map(ticket => (
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