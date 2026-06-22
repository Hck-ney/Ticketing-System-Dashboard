import { API_URL } from '../config/config'

// fetch tickets for a specific user
export const userTickets = async (user_id: number) => {
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
  const res = await fetch(`${API_URL}/createTicket`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || 'Request failed')
  }

  return result
}

// fetch all tickets (for employees)
export const allTickets = async () => {
  const res = await fetch(`${API_URL}/allTickets`)
  return res.json()
}

// assign a ticket to an employee
export const assignTicket = async (data: {
  id: number
  user_id: number;
}) => {
  const res = await fetch(`${API_URL}/assignTicket`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.error || `Server Error: ${res.status}`);
  }

  return result
}