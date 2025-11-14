import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'gallery.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err)
  } else {
    console.log('Connected to SQLite database')
    initializeDatabase()
  }
})

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Photos table
    db.run(`
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        image TEXT NOT NULL,
        caption TEXT,
        song TEXT,
        songName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `)

    // Insert default users if they don't exist
    db.run(
      `INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)`,
      [uuidv4(), 'shruti', null]
    )
    db.run(
      `INSERT OR IGNORE INTO users (id, username, password) VALUES (?, ?, ?)`,
      [uuidv4(), 'gauransh', 'gauransh@123']
    )

    console.log('Database initialized successfully')
  })
}

// Routes

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({ error: 'Username is required' })
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' })
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Check password
    if (user.password !== null && user.password !== password) {
      return res.status(401).json({ error: 'Wrong password' })
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        isSpecialUser: user.password === null
      }
    })
  })
})

// Get all photos for a user
app.get('/api/photos/:userId', (req, res) => {
  const { userId } = req.params

  db.all(
    'SELECT * FROM photos WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, photos) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      res.json({ photos: photos || [] })
    }
  )
})

// Upload a new photo
app.post('/api/photos', (req, res) => {
  const { userId, image, caption, song, songName } = req.body

  if (!userId || !image) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const photoId = uuidv4()

  db.run(
    `INSERT INTO photos (id, userId, image, caption, song, songName, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [photoId, userId, image, caption || '', song || null, songName || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save photo' })
      }
      res.json({
        success: true,
        photo: {
          id: photoId,
          userId,
          image,
          caption,
          song,
          songName,
          createdAt: new Date()
        }
      })
    }
  )
})

// Delete a photo
app.delete('/api/photos/:photoId', (req, res) => {
  const { photoId } = req.params

  db.run('DELETE FROM photos WHERE id = ?', [photoId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete photo' })
    }
    res.json({ success: true, message: 'Photo deleted' })
  })
})

// Update a photo (caption and song only)
app.put('/api/photos/:photoId', (req, res) => {
  const { photoId } = req.params
  const { caption, song, songName } = req.body

  db.run(
    `UPDATE photos SET caption = ?, song = ?, songName = ? WHERE id = ?`,
    [caption || '', song || null, songName || null, photoId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update photo' })
      }
      res.json({ success: true, message: 'Photo updated' })
    }
  )
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🎀 Cute Photo Gallery Server running on http://localhost:${PORT}`)
  console.log('✨ Photos will be synced across all devices!')
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing database...')
  db.close(() => {
    console.log('Database closed')
    process.exit(0)
  })
})
