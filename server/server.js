require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

// Routes
app.use('/api/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))