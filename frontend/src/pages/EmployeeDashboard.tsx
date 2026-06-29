import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext';
import { Switch } from "@/components/ui/switch"
import Dashboard from './employee/dashboard';
import Ticket from './employee/tickets'
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
  LayoutDashboard,
  Ticket as TicketIcon,
  Settings,
  Monitor,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: TicketIcon,      label: 'Tickets',   id: 'tickets'   },
]

export default function Employee_Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { darkToggle, toggleTheme } = useTheme()
  const [selectedPage, setSelectedPage] = useState('dashboard')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='h-screen flex font-sans overflow-hidden bg-slate-50 dark:bg-gray-950'>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-white dark:bg-gray-900
        border-r border-slate-200 dark:border-slate-700/60
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-slate-700/60">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">IT Support</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Help Center</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActive(id); setSidebarOpen(false); setSelectedPage(id) }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 cursor-pointer text-left
                ${active === id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate leading-tight">
                {user?.name ?? 'User'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Employee</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">

        {/* Header */}
        <header className="
          shrink-0 h-16 px-6 flex items-center justify-between
          bg-white dark:bg-gray-900
          border-b border-slate-200 dark:border-slate-700/60
        ">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white">
                {active === 'dashboard' ? 'Dashboard' : active === 'tickets' ? 'Tickets' : 'Settings'}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <span className="text-sm">☀️</span>
              <Switch
                checked={darkToggle}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300"
              />
              <span className="text-sm">🌙</span>
            </div>

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Avatar className="w-9 h-9">
                  <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
                  <AvatarFallback className="text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-xl"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user?.name ?? 'User'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Employee</p>
                </div>
                <DropdownMenuGroup className="py-1">
                  <DropdownMenuItem className="mx-1 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                    <BadgeCheckIcon className="w-4 h-4 mr-2" />
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                <div className="py-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="mx-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-gray-950">
          {selectedPage === 'dashboard' ? <Dashboard /> : <Ticket />}
        </main>
      </div>
    </div>
  )
}