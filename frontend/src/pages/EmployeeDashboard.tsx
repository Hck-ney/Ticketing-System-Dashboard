import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { allTickets } from '../api/tickets'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"



const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🎫', label: 'Tickets', id: 'tickets' },
  { icon: '👥', label: 'Users', id: 'users' },
  { icon: '📈', label: 'Analytics', id: 'analytics' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

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
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
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
    <div className="min-h-screen flex bg-background text-foreground">

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 border-r border-gray-100 z-30 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 ">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🖥</span>
          </div>
          <div>
            <p className="">IT Support</p>
            <p className="">Dashboard</p>
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
          <Button
            onClick={handleLogout}
            className="justify-center"
          >
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <h1 className="text-lg font-medium">IT Support Dashboard</h1>
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


        <div className="px-8">
          <Table className="w-full overflow-hidden bg-background ">
            <TableCaption>A list of Active Tickets.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketList.map((ticket) => (
                <TableRow key={ticket.id} onClick={() => { setSelectedTicket(ticket); console.log(ticket); }}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>{ticket.users.name}</TableCell>
                  <TableCell>{ticket.priority}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>
                    {ticket.created_at.replace("T", " ").split(".")[0]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog modal */}
      <Dialog open={!!selectedTicket}>
        <DialogContent className="sm:max-w-md h-auto">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription>Ticket #{selectedTicket?.id}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Submitted By</Label>
              <Input value={selectedTicket?.users.name ?? ''} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Input value={selectedTicket?.priority ?? ''} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Created</Label>
              <Input value={selectedTicket?.created_at.replace("T", " ").split(".")[0] ?? ''} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={selectedTicket?.description ?? ''}
                readOnly
                className="h-40 resize-none overflow-y-auto"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white">
              Assign to Me
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}