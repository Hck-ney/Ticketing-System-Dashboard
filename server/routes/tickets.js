const express = require('express')
const supabase = require('../config/supabase')

const router = express.Router()

// GET all tickets
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data || [])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET stats (counts by status)
router.get('/stats', async (req, res) => {
  try {
    // fetch only status column to reduce payload
    const { data, error } = await supabase
      .from('tickets')
      .select('status')

    if (error) throw error

    const total = data ? data.length : 0
    const pending = data ? data.filter(t => t.status === 'pending').length : 0
    const in_progress = data ? data.filter(t => t.status === 'in_progress').length : 0
    const resolved = data ? data.filter(t => t.status === 'resolved').length : 0
    const closed = data ? data.filter(t => t.status === 'closed').length : 0

    res.json({ total, pending, in_progress, resolved, closed })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// CREATE a ticket
router.post('/newTicket', async (req, res) => {
  try {
    const { title, description, status, priority, closed_at, user_id, assigned_employee_id } = req.body

    if (!title || typeof title !== 'string' || !description || !status || !priority || !user_id || !assigned_employee_id) {
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

    // Validate employee exists 
    // if (employee_id) {
    //   const { data: empExists, error: empError } = await supabase
    //     .from('employee')
    //     .select('id')
    //     .eq('id', employee_id)
    //     .single()

    //   if (empError || !empExists) {
    //     return res.status(400).json({ error: 'Employee not found' })
    //   }
    // }

    const insertObj = {
      title,
      description,
      status,
      priority,
      user_id,
      assigned_employee_id,
      closed_at: closed_at ?? null,
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
})

module.exports = router
