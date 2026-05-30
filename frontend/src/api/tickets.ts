import { API_URL } from '../config/config'


export const getTickets = async () => {
  const res = await fetch(`${API_URL}/tickets`)
  return res.json()
}

export const getStats = async () => {
  const res = await fetch(`${API_URL}/tickets/stats`)
  return res.json()
}

export const createTicket = async (data: {
  title: string
  description: string
  status: string
  priority: string
  closed_at: Date
  user_id: number
  assigned_employee_id: number
}) => {
  const res = await fetch(`${API_URL}/api/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}