import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { allTickets } from '../api/tickets'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
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
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

export default function Employee_Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [ticketList, setTicketList] = useState<UserTicket[]>([])
  const [darkThemeToggle, setDarkThemeToggle] = useState(false)
  const darkThemeStyle = {
    background: 'bg-gray-900',
    grayText: 'text-gray-400',
    text: 'text-white'
  }
  const lightThemeStyle = {
    background: 'bg-white',
    text: 'text-black',
    textSlate: 'text-slate-400'
  }

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

  const log = () => {
    console.log(isDataLoading)
  }
  const fetchData = async () => {
      try {
        setIsDataLoading(true)
        const statsData = await allTickets()
        setIsDataLoading(false)
        setTicketList(statsData.tickets)
        console.log(isDataLoading)
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats([])
      } finally {
      }
    }

  useEffect(() => {
    fetchData()
  }, [])


  const employeeDashboard = (

    <div className='h-screen flex font-sans bg-slate-50 overflow-hidden'>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${darkThemeToggle ? `${darkThemeStyle.background}` : 'border-r border-slate-300 bg-white'}
    fixed top-0 left-0 h-full w-64 border-r  z-30 flex flex-col
    transition-transform duration-200 
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:z-auto
  `}>
        {/* Brand */}
        <div className={`flex items-center gap-3 px-6 py-5 ${darkThemeToggle ? `border-b` : `border-b border-slate-300`} `}>
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span>🖥</span>
          </div>
          <div>
            <p className={darkThemeToggle ? 'text-gray-100' : `${lightThemeStyle.text}`}>IT Support</p>
            <p className={darkThemeToggle ? `${darkThemeStyle.grayText}` : `${lightThemeStyle.textSlate}`}>Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-gray-700">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActive(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${active === item.id
                ? `{font-medium ${darkThemeToggle ? 'text-blue-100 bg-blue-950' : 'bg-blue-200'}`
                : `${darkThemeToggle ? `${darkThemeStyle.grayText} hover:text-gray-100` : ''}`
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className={`px-3 py-3 border-t ${darkThemeToggle ? `border-t` : `border-t border-slate-300`} `}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${darkThemeToggle ? `${darkThemeStyle.grayText}` : `${lightThemeStyle.text}`}`}>{user?.name}</p>
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
      <div className={`flex-1 flex flex-col min-w-0 min-h-0`}>

        {/* Top bar */}
        <header className={`px-4 lg:px-8 py-4 flex items-center justify-between  ${darkThemeToggle ? `border-b ${darkThemeStyle.background} ${darkThemeStyle.text}` : `border-b border-slate-300 ${lightThemeStyle.background} ${lightThemeStyle.text}`}`}>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden cursor-pointer dark:text-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <h1 className={`text-lg font-medium ${darkThemeToggle ? `${darkThemeStyle.text}` : `${lightThemeStyle.text}`}`}>IT Support Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            ☀️
            <Switch
              className="data-[state=unchecked]:bg-slate-200 border border-slate-500 [&>span]:border [&>span]:border-slate-300"
              checked={darkThemeToggle}
              onCheckedChange={(checked) => setDarkThemeToggle(checked)}
            />
            🌙
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {/* Main body */}
        <div className={`flex-1 flex flex-col min-h-0 ${darkThemeToggle? 'bg-gray-900':''}`}>

          <div className="mx-8 my-12 flex-1 flex flex-col rounded-xl border border-slate-500 overflow-auto">
            <div className={`${darkThemeToggle ? 'bg-gray-800' : 'bg-white'} flex items-center justify-between px-6 py-4 border-b`}>
              <p className={`${darkThemeToggle ? 'text-white' : 'text-slate-900'} text-base font-bold m-0`}>
                Active Tickets
              </p>
              <Button onClick={fetchData} variant={darkThemeToggle? 'default': 'secondary'}>
                Refresh
              </Button>
            </div>

            {isDataLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner className={`size-12 ${darkThemeToggle? 'text-white' : 'text-black'}`} /> 
                <span  className={`${darkThemeToggle? 'text-white' : 'text-black'}`}>Fetching all Active Tickets</span>
                
              </div>
            ) : (
              <Table className={`flex-1 overflow-auto w-full ${darkThemeToggle ? 'bg-gray-900' : 'bg-white'}`}>
                <TableHeader className={`border-b border-slate-100 ${darkThemeToggle ? 'bg-gray-800' : 'bg-slate-50'}`}>
                  <TableRow className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <TableHead className={`w-[100px] ${darkThemeToggle ? 'text-white' : 'text-black'}`}>ID</TableHead>
                    <TableHead className={`${darkThemeToggle ? 'text-white' : 'text-black'}`}>Title</TableHead>
                    <TableHead className={`${darkThemeToggle ? 'text-white' : 'text-black'}`}>Submitted By</TableHead>
                    <TableHead className={`${darkThemeToggle ? 'text-white' : 'text-black'}`}>Priority</TableHead>
                    <TableHead className={`${darkThemeToggle ? 'text-white' : 'text-black'}`}>Status</TableHead>
                    <TableHead className={`${darkThemeToggle ? 'text-white' : 'text-black'}`}>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='h-100'>
                  {ticketList.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      onClick={() => { setSelectedTicket(ticket); console.log(ticket); }}
                      className={`${darkThemeToggle ? `cursor-pointer hover:bg-muted  dark:text-gray-200` : `text-black border-b border-slate-300`}`}
                    >
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
            )}
          </div>
        </div>
      </div>

      {/* Dialog modal */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => { if (!open) setSelectedTicket(null) }}
        disablePointerDismissal
      >
        <DialogContent className={`sm:max-w-md ${darkThemeToggle ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-black'}`} >
          <DialogHeader>
            <DialogTitle>{selectedTicket?.title}</DialogTitle>
            <DialogDescription className={`${darkThemeToggle ? 'text-gray-400' : 'text-gray-700'}`}>Ticket #{selectedTicket?.id}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label className={`${darkThemeToggle ? 'text-gray-300' : 'text-black'}`}>Submitted By</Label>
              <Input className={`${darkThemeToggle ? 'text-gray-100 bg-gray-800' : 'bg-gray-800'}`} value={selectedTicket?.users.name ?? ''} readOnly />
            </div>
            <div className="grid gap-2">
              <Label className={`${darkThemeToggle ? 'text-gray-300' : 'text-black'}`}>Priority</Label>
              <Input value={selectedTicket?.priority ?? ''} readOnly className={`${darkThemeToggle ? 'text-gray-100 bg-gray-800' : ''}`} />
            </div>
            <div className="grid gap-2">
              <Label className={`${darkThemeToggle ? 'text-gray-300' : 'text-black'}`}>Created</Label>
              <Input value={selectedTicket?.created_at.replace("T", " ").split(".")[0] ?? ''} readOnly className={`${darkThemeToggle ? 'text-gray-100 bg-gray-800' : ''}`} />
            </div>
            <div className="grid gap-2">
              <Label className={`${darkThemeToggle ? 'text-gray-300' : 'text-gray-700'}`}>Description</Label>
              <Textarea
                value={selectedTicket?.description ?? ''}
                readOnly
                className={`${darkThemeToggle ? 'text-gray-100 bg-gray-800' : ''}`}
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
  return employeeDashboard
}