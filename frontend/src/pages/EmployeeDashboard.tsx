import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { allTickets } from '../api/tickets'
import { useTheme } from '../context/ThemeContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
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
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  BadgeCheckIcon,
  LogOutIcon,
} from "lucide-react"


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
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [ticketList, setTicketList] = useState<UserTicket[]>([])
  const [darkThemeToggle, setDarkThemeToggle] = useState(false)
  const { darkToggle, toggleTheme } = useTheme();

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

    <div className='h-screen flex font-sans overflow-hidden'>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-white dark:bg-gray-900 dark:text-white
    fixed top-0 left-0 h-full w-64 border-r  z-30 flex flex-col
    transition-transform duration-200 
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:z-auto
  `}>
        {/* Brand */}
        <div className={`border-b border-slate-300 flex items-center gap-3 px-6 py-5 dark:border-b`}>
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span>🖥</span>
          </div>
          <div className='text-black dark:text-white'>
            <p>IT Support</p>
            <p className='text-gray-700'>Dashboard</p>
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

        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-0`}>

        {/* Top bar */}
        <header className={'px-4 lg:px-8 py-4 flex items-center justify-between text-black dark:border-border dark:border-b dark:bg-gray-900 dark:text-white bg-white border-b border-slate-300'}>
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className='lg:hidden cursor-pointer'
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div>
              <h1 className={`text-lg font-medium`}>IT Support Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            ☀️
            <Switch
              className="data-[state=unchecked]:bg-slate-200 border border-slate-500 [&>span]:border [&>span]:border-slate-300"
              checked={darkToggle}
              onCheckedChange={() => toggleTheme()}
            />
            🌙
            <DropdownMenu>
              {/* Remove asChild. Pass className directly to the Trigger component */}
              <DropdownMenuTrigger
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className={darkThemeToggle ? '' : 'text-black bg-white'}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheckIcon />
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} variant='destructive'>
                  <LogOutIcon />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main body */}
        <div className='flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800'>

          <div className='mx-8 my-12 flex-1 flex flex-col rounded-xl border border-slate-500 overflow-auto'>
            <div className='flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gray-900'>
              <p className='dark:text-white text-slate-900 text-base font-bold m-0'>
                Active Tickets
              </p>
              <Button onClick={fetchData}>
                Refresh
              </Button>
            </div>

            {isDataLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Spinner className='size-12 text-black dark:text-white' />
                <span className='text-black dark:text-white'>Fetching all Active Tickets</span>

              </div>
            ) : (
              <Table className='flex-1 overflow-auto w-full bg-white dark:bg-gray-900'>
                <TableHeader>
                  <TableRow className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <TableHead className='w-[100px] text-black dark:text-white'>ID</TableHead>
                    <TableHead className='text-black dark:text-white'>Title</TableHead>
                    <TableHead className='text-black dark:text-white'>Submitted By</TableHead>
                    <TableHead className='text-black dark:text-white'>Priority</TableHead>
                    <TableHead className='text-black dark:text-white'>Status</TableHead>
                    <TableHead className='text-black dark:text-white'>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className='h-100'>
                  {ticketList.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      onClick={() => { setSelectedTicket(ticket); console.log(ticket); }}
                      className='cursor-pointer hover:bg-muted dark:text-gray-200 text-black'
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