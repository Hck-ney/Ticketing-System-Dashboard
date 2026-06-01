const express = require('express')
const supabase = require('../config/supabase')

const router = express.Router()

// EMPLOYEE

// Employee GET all tickets
const allTickets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
    *,
    users (
      name
    )
  `)
      .neq('status', 'Closed')
      .order('created_at', { ascending: false })


    if (error) throw error

    const total = data.length
    const pending = data.filter(t => t.status === 'Open').length
    const in_progress = data.filter(t => t.status === 'In-progress').length
    const resolved = data.filter(t => t.status === 'resolved').length
    const closed = data.filter(t => t.status === 'closed').length

    res.json({ total, pending, in_progress, tickets: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Employee Update a Ticket Status
const updateTicketStatus = async (req, res) => {
  try {
    const { id, status } = req.body
    // fetch only status column to reduce payload
    const { data, error } = await supabase
      .from('tickets')
      .update({ status: status })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    res.json(data || null)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// USER

// User CREATE a ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, status, priority, user_id } = req.body

    if (!title || typeof title !== 'string' || !description || !status || !priority || !user_id) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    // Validate user exists
    const { data: userExists, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single()

    if (userError || !userExists) {
      return res.status(400).json({ error: 'User not found' })
    }

    const insertObj = {
      title,
      description,
      status,
      priority,
      user_id,
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([insertObj])
      .select('*')
      .single()

    if (error) throw error

    res.status(201).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Fetch tickets of User
const getUserTickets = async (req, res) => {
  try {
    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' })
    }
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', user_id)

    if (error) throw error
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No tickets found for this user' })
    }
    res.json({ tickets: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { allTickets, updateTicketStatus, createTicket, getUserTickets }
