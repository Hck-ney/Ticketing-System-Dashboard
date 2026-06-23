import { useState, useEffect } from 'react'
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
} from "lucide-react"


const navItems = [
  { icon: '📊', label: 'Dashboard', id: 'dashboard' },
  { icon: '🎫', label: 'Tickets', id: 'tickets' },
  { icon: '⚙️', label: 'Settings', id: 'settings' },
]

export default function Employee_Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { darkToggle, toggleTheme } = useTheme();
  const [selectedPage, setSelectedPage] = useState('dashboard')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
              onClick={() => { setActive(item.id); setSidebarOpen(false); setSelectedPage(item.id)}}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${active === item.id
                ? 'font-medium dark:text-blue-100 dark:bg-blue-700 bg-blue-600'
                : 'dark:text-gray-300 hover:text-black text-gray-600 dark:hover:text-white'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className='px-3 py-3 border-t dark:border-t border-t border-slate-300'>
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
              <DropdownMenuTrigger
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className='text-black bg-white'>
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
        {selectedPage===('dashboard')? <Dashboard/>:<Ticket/>}
      </div>

      
    </div>
  )
  return employeeDashboard
}