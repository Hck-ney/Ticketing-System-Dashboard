if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.debug = () => {}
}

require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()


const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API running' })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/', require('./routes/tickets'))

if (require.main === module) {
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

module.exports = app