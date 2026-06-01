import { API_URL } from '../config/config'

// fetch tickets for a specific user
export const userTickets = async (user_id : number) => {
  const res = await fetch(`${API_URL}/tickets?user_id=${user_id}`)
  return res.json()
}

// create a new ticket
export const createTicket = async (data: {
  title: string
  description: string
  status: string
  priority: string
  user_id?: number | null;
}) => {
  const res = await fetch(`${API_URL}/tickets/newTicket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// fetch all tickets (for employees)
export const allTickets = async () => {
  const res = await fetch(`${API_URL}/allTickets`)
  return res.json()
}