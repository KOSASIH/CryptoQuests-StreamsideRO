// server.js

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

// Create Express app
const app = express()
app.use(express.json())
app.use(cors())

// Import routes
const authRoutes = require('./routes/auth')
const questsRoutes = require('./routes/quests')

// Setup routes
app.use('/api/auth', authRoutes)
app.use('/api/quests', questsRoutes)

// Global error handling
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  return res.status(status).json({ error: { status, message } })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
