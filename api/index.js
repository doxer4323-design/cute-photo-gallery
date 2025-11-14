import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

const app = express()

// In-memory database for Vercel (data persists per request cycle)
let usersDb = [
  { id: uuidv4(), username: 'shruti', password: null },
  { id: uuidv4(), username: 'gauransh', password: 'gauransh@123' }
]
let photosDb = []

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))


// API Routes
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body

    const user = usersDb.find(u => u.username === username)

    if (!user) {
      return res.status(401).json({ error: 'Invalid username' })
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    res.json({ userId: user.id, username: user.username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/photos/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const userPhotos = photosDb.filter(p => p.userId === userId).sort((a, b) => b.uploadedAt - a.uploadedAt)
    res.json({ photos: userPhotos })
  } catch (error) {
    console.error('Fetch photos error:', error)
    res.status(500).json({ error: 'Failed to fetch photos' })
  }
})

app.post('/api/photos', (req, res) => {
  try {
    const { userId, image, caption, song, songName } = req.body
    const photoId = uuidv4()
    const newPhoto = {
      id: photoId,
      userId,
      image,
      caption,
      song,
      songName,
      uploadedAt: Date.now()
    }
    photosDb.push(newPhoto)
    res.json({ id: photoId, message: 'Photo saved successfully' })
  } catch (error) {
    console.error('Save photo error:', error)
    res.status(500).json({ error: 'Failed to save photo' })
  }
})

app.put('/api/photos/:photoId', (req, res) => {
  try {
    const { photoId } = req.params
    const { caption, song, songName } = req.body
    const photo = photosDb.find(p => p.id === photoId)
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    photo.caption = caption
    photo.song = song
    photo.songName = songName
    res.json({ message: 'Photo updated successfully' })
  } catch (error) {
    console.error('Update photo error:', error)
    res.status(500).json({ error: 'Failed to update photo' })
  }
})

app.delete('/api/photos/:photoId', (req, res) => {
  try {
    const { photoId } = req.params
    const index = photosDb.findIndex(p => p.id === photoId)
    if (index === -1) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    photosDb.splice(index, 1)
    res.json({ message: 'Photo deleted successfully' })
  } catch (error) {
    console.error('Delete photo error:', error)
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' })
})


export default app
