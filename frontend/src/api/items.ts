// src/api/items.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getItems = async () => {
  const res = await fetch(`${API_URL}/items`)
  return res.json()
}

export const createItem = async (data: { name: string; description: string }) => {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export const deleteItem = async (id: string) => {
  await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' })
}