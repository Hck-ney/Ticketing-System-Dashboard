import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createTicket, userTickets } from '../api/tickets'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Dialog } from '@/components/ui/dialog'

const navItems = [
  { icon: '📊', label: 'Overview', id: 'overview' },
  { icon: '🎫', label: 'My Tickets', id: 'tickets' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const Ticket = { title: '', description: '', priority: '', status: 'Open', user_id: user?.id }
  const [newTicket, setNewTicket] = useState(Ticket)
  const [isLoading, setIsLoading] = useState(false)
  const [isTicketListLoading, setIsTicketListLoading] = useState(true)
  const [userTicketList, setUserTicketList] = useState<UserTicket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)

  const handleLogout = () => { logout(); navigate('/login') }
  const CreateTicket = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.priority) {
      alert('Please fill in all fields and select a priority level.');
      return;
    }
    setIsLoading(true);
    try {
      await createTicket(newTicket)
      setShowNewModal(false)
      toast.success('Ticket submitted successfully!')
    }
    catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Error submitting ticket')
    }
    finally {
      setIsLoading(false);
    }
  }

  const fetchTickets = async () => {
    try {
      setIsTicketListLoading(true)
      const data = await userTickets(user?.id || 0)
      setUserTicketList(data.tickets)
      setIsTicketListLoading(false)
    }
    catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  }

  const stats = [
    { label: 'Total Submitted Tickets', value: userTicketList.length.toString(), bg: 'bg-blue-50', iconBg: 'bg-blue-100', color: 'text-blue-700', icon: '🎫' },
    { label: 'Active Tickets', value: userTicketList.filter(ticket => ticket.status !== 'Closed').length, bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', color: 'text-amber-700', icon: '⏳' },
    { label: 'In Progress', value: userTicketList.filter(ticket => ticket.status === 'In-progress').length, bg: 'bg-purple-50', iconBg: 'bg-purple-100', color: 'text-purple-700', icon: '🔧' },
    { label: 'Resolved', value: userTicketList.filter(ticket => ticket.status === 'Resolved').length, bg: 'bg-green-50', iconBg: 'bg-green-100', color: 'text-green-700', icon: '✅' },
  ]

  type UserTicket = {
    id: number
    title: string
    description: string
    status: string
    priority: string
    created_at: string
    user_id: number
    comment: string
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return (

    <div className="h-screen flex font-sans bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col lg:relative lg:translate-x-0 lg:z-auto transition-transform duration-200 w-60 bg-white border-r border-slate-100 shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-xl">🖥</span>
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 m-0">IT Support</p>
            <p className="text-xs text-slate-400 m-0">Help Center</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => {
                if (item.id === 'new') { setShowNewModal(true); setSidebarOpen(false) }
                else { setActive(item.id); setSidebarOpen(false) }
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-none cursor-pointer w-full text-left text-sm font-sans transition-all duration-150 ${active === item.id ? 'font-semibold' : 'font-normal'} ${item.id === 'new' || active === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'bg-transparent text-slate-500'
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 py-3.5 border-t border-slate-100">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 m-0 overflow-hidden text-ellipsis whitespace-nowrap">{user?.name}</p>
              <p className="text-xs text-slate-400 m-0">User</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full py-2 rounded-lg border-none bg-transparent text-red-500 text-sm font-semibold cursor-pointer font-sans">
            🚪 Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-7 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <button className="lg:hidden text-2xl bg-none border-none cursor-pointer text-slate-500" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <p className="text-lg font-bold text-slate-900 m-0 capitalize">
                {active === 'overview' ? 'My Dashboard' : active === 'tickets' ? 'My Tickets' : 'Settings'}
              </p>
              <p className="text-xs text-slate-400 m-0">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="relative bg-none border-none cursor-pointer text-2xl p-1.5">
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-7 py-6">

          {/* Welcome banner */}
          <div className="bg-blue-700 rounded-2xl px-7 py-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-white m-0 mb-1.5">
                Hi, {user?.name?.split(' ')[0]} 👋
              </p>
              <p className="text-sm text-white/70 m-0">
                Track your IT support requests and stay updated on their status.
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="hidden sm:block bg-white text-blue-700 border-none rounded-xl px-5 py-2.5 text-sm font-bold cursor-pointer shrink-0 font-sans"
            >
              + New Ticket
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4 mb-6">
            {stats.map(stat => (
              <div key={stat.label} className={`${stat.bg} rounded-xl px-5 py-4`}>
                <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center text-xl mb-3.5`}>
                  {stat.icon}
                </div>
                <p className="text-3xl font-extrabold text-slate-900 m-0 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500 m-0 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My Tickets */}
          <div className="bg-white rounded-xl border border-slate-500 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <p className="text-base font-bold text-slate-900 m-0">My Recent Tickets</p>
              <Button onClick={fetchTickets}>Refresh</Button>
            </div>

            {/* Tickets Table */}
            <Dialog>
              <div className="hidden sm:block overflow-x-auto h-120">
                {isTicketListLoading ? (<div className='flex flex-1 h-full items-center justify-center gap-2'><Spinner className='size-10' /><span>Fetching your tickets</span></div>) : (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['ID', 'Issue', 'Priority', 'Status', 'Time'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userTicketList.map((ticket) => (
                        <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="cursor-pointer border-b border-slate-100">
                          <td className="px-5 py-3 text-sm text-slate-900">{ticket.id}</td>
                          <td className="px-5 py-3 text-sm text-slate-900">{ticket.title}</td>
                          <td className="px-5 py-3 text-sm text-slate-900">{ticket.priority}</td>
                          <td className="px-5 py-3 text-sm text-slate-900">{ticket.status}</td>
                          <td className="px-5 py-3 text-sm text-slate-900">{ticket.created_at.replace("T", " ").split(".")[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}</div>
            </Dialog>

            {/* Mobile cards */}
          </div>
        </main>
      </div>


      {/* ── New Ticket Modal ── */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={() => setShowNewModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md px-8 py-7 box-border"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 m-0">Submit New Ticket</h2>
              <button onClick={() => setShowNewModal(false)}
                className="bg-slate-100 border-none rounded-lg w-8 h-8 text-base cursor-pointer flex items-center justify-center">
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Issue Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cannot connect to Wi-Fi"
                  value={newTicket.title}
                  onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none font-sans box-border focus:border-blue-700"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Description</label>
                <textarea
                  placeholder="Describe the issue in detail..."
                  value={newTicket.description}
                  onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none font-sans resize-none box-border leading-relaxed focus:border-blue-700"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'Low', label: 'Low', bg: 'bg-gray-100', color: 'text-gray-500', border: 'border-gray-500' },
                    { value: 'Medium', label: 'Medium', bg: 'bg-orange-100', color: 'text-orange-600', border: 'border-orange-600' },
                    { value: 'Critical', label: 'Critical', bg: 'bg-red-100', color: 'text-red-600', border: 'border-red-600' },
                  ].map(p => (
                    <button key={p.value}
                      onClick={() => setNewTicket({ ...newTicket, priority: p.value })}
                      className={`p-2.5 rounded-xl text-sm font-bold cursor-pointer font-sans transition-all duration-150 ${newTicket.priority === p.value
                        ? `border-2 ${p.border} ${p.bg} ${p.color}`
                        : 'border border-slate-200 bg-white text-slate-400'
                        }`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button onClick={() => setShowNewModal(false)}
                className="flex-1 h-11 bg-slate-100 border-none rounded-xl text-sm font-semibold text-slate-500 cursor-pointer font-sans">
                Cancel
              </button>
              <button
                onClick={CreateTicket}
                disabled={isLoading}
                className="flex-[2] h-11 bg-blue-700 border-none rounded-xl text-sm font-bold text-white cursor-pointer font-sans">
                {isLoading ? 'Submitting...' : 'Submit Ticket →'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        selectedTicket.status === 'Resolved' ? (

          /* ── Resolved Modal ── */
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md box-border flex flex-col border border-slate-200"
              style={{ maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-7 pt-6 pb-0 shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className="text-xs text-slate-400 font-medium">#{selectedTicket.id}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${selectedTicket.priority === 'Critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : selectedTicket.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                        {selectedTicket.priority}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                        ✓ Resolved
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 m-0 leading-snug">
                      {selectedTicket.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="bg-slate-100 border-none rounded-lg w-8 h-8 text-sm cursor-pointer flex items-center justify-center shrink-0 ml-3 text-slate-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="border-t border-slate-100" />
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto px-7 py-5 flex-1 flex flex-col gap-4">

                {/* Resolved banner */}
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 text-sm shrink-0">✓</div>
                  <div>
                    <p className="text-sm font-semibold text-green-800 m-0">Issue resolved</p>
                    <p className="text-xs text-green-600 m-0 mt-0.5">Marked resolved by IT support</p>
                  </div>
                </div>

                {/* Date */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 m-0">Submitted</p>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base shrink-0">🗓</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 m-0">{selectedTicket.created_at.replace('T', ' ').split('.')[0]}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 m-0">Description</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
                    <p className="text-sm text-slate-500 leading-relaxed m-0">{selectedTicket.description}</p>
                  </div>
                </div>

                {/* IT Support Notes */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 m-0">IT Support Notes</p>
                  {selectedTicket.comment ? (
                    <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3.5">
                      <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">IT</span>
                      </div>
                      <p className="text-sm text-blue-900 leading-relaxed m-0">{selectedTicket.comment}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl px-4 py-3.5">
                      <p className="text-sm text-slate-400 italic m-0">No notes from IT support yet.</p>
                    </div>
                  )}
                </div>

                {/* Add comment */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Add a comment</label>
                  <textarea
                    placeholder="Anything to add before closing?"
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none font-sans resize-none box-border leading-relaxed focus:border-blue-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-7 py-4 shrink-0 border-t border-slate-100 flex gap-2.5">
                <button
                  onClick={async () => {
                    setSelectedTicket(null)
                    toast.success('Ticket re-opened!')
                  }}
                  className="flex-1 h-11 bg-blue-50 border border-blue-200 rounded-xl text-sm font-semibold text-blue-700 cursor-pointer font-sans hover:bg-blue-100 transition-colors"
                >
                  ↩ Re-open
                </button>
                <button
                  onClick={async () => {
                    setSelectedTicket(null)
                    toast.success('Ticket closed!')
                  }}
                  className="flex-1 h-11 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-700 cursor-pointer font-sans hover:bg-green-100 transition-colors"
                >
                  ✓ Close ticket
                </button>
              </div>
            </div>
          </div>

        ) : (

          /* ── All Other Statuses (Open, In-progress, Closed) ── */
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedTicket(null)}
          >
            <div
              className="bg-white rounded-2xl w-full max-w-md box-border flex flex-col border border-slate-200"
              style={{ maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-7 pt-6 pb-0 shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className="text-xs text-slate-400 font-medium">#{selectedTicket.id}</span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${selectedTicket.priority === 'Critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : selectedTicket.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                        {selectedTicket.priority}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${selectedTicket.status === 'Open'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : selectedTicket.status === 'In-progress'
                            ? 'bg-violet-50 text-violet-700 border-violet-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                        {selectedTicket.status === 'In-progress' ? '● In-progress' : selectedTicket.status}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 m-0 leading-snug">
                      {selectedTicket.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="bg-slate-100 border-none rounded-lg w-8 h-8 text-sm cursor-pointer flex items-center justify-center shrink-0 ml-3 text-slate-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="border-t border-slate-100" />
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto px-7 py-5 flex-1 flex flex-col gap-4">

                {/* Date */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 m-0">Ticket created</p>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base shrink-0">🗓</div>
                    <p className="text-sm font-medium text-slate-800 m-0">{selectedTicket.created_at.replace('T', ' ').split('.')[0]}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 m-0">Description</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
                    <p className="text-sm text-slate-500 leading-relaxed m-0">{selectedTicket.description}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-7 py-4 shrink-0 border-t border-slate-100 flex gap-2.5">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 h-11 bg-slate-100 border-none rounded-xl text-sm font-semibold text-slate-500 cursor-pointer font-sans hover:bg-slate-200 transition-colors"
                >Close
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}