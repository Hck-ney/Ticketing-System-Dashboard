const supabase = require('../config/supabase')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { name, email, password, age, gender, role } = req.body

  if (!name || !email || !password || !age || !gender) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    return res.status(400).json({ error: 'Email already in use' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Insert user
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword, age, gender, role}])
    .select('id, name, email, age, gender, role')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ message: 'User registered successfully', user: data })
}

const login = async (req, res) => {
  const { email, password, user_role } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  // Find user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  })
}

module.exports = { register, login }