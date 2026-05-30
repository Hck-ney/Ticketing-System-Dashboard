import { API_URL } from '../config/config'

export const registerUser = async (data: {
  name: string
  email: string
  password: string
  age: string
  gender: string
}) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const loginUser = async (data: {
  email: string
  password: string
}) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}