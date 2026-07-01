export type Priority = 'Critical' | 'Medium' | 'Low'
export type Status = 'Open' | 'In-progress' | 'Resolved' | 'Closed' | 'Cancelled'

export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

export type UserTicket = {
    id: number
    title: string
    description: string
    status: Status
    priority: Priority
    created_at: string
    user_id: number
    users: {
        name: string
    }
}