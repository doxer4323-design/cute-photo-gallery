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

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Database connection error:', err)
  } else {
    console.log('Connected to in-memory SQLite database')
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
        uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
      )
    `)

    // Insert default users
    db.run(`
      INSERT OR IGNORE INTO users (id, username, password)
      VALUES (?, ?, ?)
    `, [uuidv4(), 'shruti', null])

    db.run(`
      INSERT OR IGNORE INTO users (id, username, password)
      VALUES (?, ?, ?)
    `, [uuidv4(), 'gauransh', 'gauransh@123'])
  })
}

// API Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid username' })
      }

      if (user.password && user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' })
      }

      res.json({ userId: user.id, username: user.username })
    }
  )
})

app.get('/api/photos/:userId', (req, res) => {
  const { userId } = req.params

  db.all(
    'SELECT * FROM photos WHERE userId = ? ORDER BY uploadedAt DESC',
    [userId],
    (err, photos) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      res.json({ photos: photos || [] })
    }
  )
})

app.post('/api/photos', (req, res) => {
  const { userId, image, caption, song, songName } = req.body
  const photoId = uuidv4()

  db.run(
    `INSERT INTO photos (id, userId, image, caption, song, songName)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [photoId, userId, image, caption, song, songName],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save photo' })
      }
      res.json({ id: photoId, message: 'Photo saved successfully' })
    }
  )
})

app.put('/api/photos/:photoId', (req, res) => {
  const { photoId } = req.params
  const { caption, song, songName } = req.body

  db.run(
    'UPDATE photos SET caption = ?, song = ?, songName = ? WHERE id = ?',
    [caption, song, songName, photoId],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update photo' })
      }
      res.json({ message: 'Photo updated successfully' })
    }
  )
})

app.delete('/api/photos/:photoId', (req, res) => {
  const { photoId } = req.params

  db.run('DELETE FROM photos WHERE id = ?', [photoId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete photo' })
    }
    res.json({ message: 'Photo deleted successfully' })
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})

export default app
