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
      .eq('status', 'Open')
      .order('created_at')

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

// Employee GET tickets assigned to himself
const myTickets = async (req, res) => {
  try {
    const { id } = req.query
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('assigned_employee_id', id)
      .throwOnError()

    res.json(data)
  }
  catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Employee Update Status of a Ticket
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

// Employee Assigns the ticket to himself
const assignTicket = async (req, res) => {
  try {
    const { id, user_id } = req.body;

    // 1. Fetch the current ticket to check the existing assignment
    const { data: currentTicket, error: fetchError } = await supabase
      .from('tickets')
      .select('assigned_employee_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!currentTicket) return res.status(404).json({ error: 'Ticket not found' });

    // 2. Check if the employee is already assigned
    if (currentTicket.assigned_employee_id === user_id) {
      return res.status(400).json({
        error: 'Employee is already assigned to this ticket.'
      });
    }

    // 3. Perform the update only if they are different
    const { data: updatedTicket, error: updateError } = await supabase
      .from('tickets')
      .update({ assigned_employee_id: user_id, status: 'In-progress' })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) throw updateError;

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
    const { id } = req.query
    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .throwOnError() // Automatically throws on error

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No tickets found' })
    }

    res.json({ tickets: data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = { allTickets, updateTicketStatus, createTicket, getUserTickets, assignTicket, myTickets }
