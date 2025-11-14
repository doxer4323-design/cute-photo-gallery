# 🎀 Multi-Device Sync Feature - Setup Guide

## What's New? 🌟

Your cute photo gallery now supports **cross-device synchronization**!

- Upload a photo on your phone → **See it instantly on your laptop**
- Upload on your tablet → **See it on all devices where you're logged in**
- All devices with your login automatically share the same gallery
- **No special links needed** - just log in to sync!

## How It Works 🔄

### Before (Single Device)

```
Phone Storage (localStorage)
Computer Storage (localStorage)
↓ (Different photos on each device)
❌ No sync
```

### Now (Multi-Device Sync)

```
Phone ──┐
        ├── Backend Server (localhost:5000)
Computer┤  - SQLite Database
Tablet ──┘  - Photos stored centrally
     ↓ (All devices fetch from same database)
✅ Perfect Sync!
```

## Architecture 📐

### Backend (New!)

- **Express.js Server** (Port 5000)
- **SQLite3 Database** - Stores photos, captions, songs
- **RESTful API Endpoints**:
  - `POST /api/login` - Authenticate user
  - `GET /api/photos/:userId` - Fetch all photos for user
  - `POST /api/photos` - Upload new photo
  - `DELETE /api/photos/:photoId` - Delete photo
  - `GET /api/health` - Health check

### Frontend (Updated)

- **React + TypeScript** (Port 5175)
- **API Integration** - Replaces localStorage
- **Real-time Fetch** - Loads photos from backend when logging in
- **Session Management** - Stores userId for cross-device sync

## How to Set Up

### 1. Install Backend Dependencies

```bash
cd cute-photo-gallery/server
npm install
```

### 2. Start the Backend Server

```bash
npm run dev
# or
node server.js
```

You should see:

```
🎀 Cute Photo Gallery Server running on http://localhost:5000
✨ Photos will be synced across all devices!
Connected to SQLite database
Database initialized successfully
```

### 3. Start the Frontend (in a new terminal)

```bash
cd cute-photo-gallery
npm run dev
```

Frontend will be at `http://localhost:5175`

### 4. Test Cross-Device Sync

**Method 1: Same Computer, Different Browsers**

1. Open `http://localhost:5175` in Chrome
2. Login as gauransh / gauransh@123
3. Upload a photo
4. Open `http://localhost:5175` in Firefox
5. Login as gauransh / gauransh@123
6. **See the same photo!** ✨

**Method 2: Different Computers (Same Network)**

1. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On Computer A: Open `http://localhost:5175` and upload photo
3. On Computer B: Open `http://<YOUR_IP>:5175` and login
4. **See the same photo!** 📱💻

## Login Accounts

### Shruti (Special User 👑)

- Username: `shruti`
- Password: (none - leave blank!)
- Popup: "Madam Ji, You Don't Need Password! 👑"

### Gauransh (Regular User)

- Username: `gauransh`
- Password: `gauransh@123`
- Popup: "Welcome Gauransh! 💖"

## File Structure

```
cute-photo-gallery/
├── server/                    # NEW! Backend
│   ├── server.js             # Express app + API routes
│   ├── package.json          # Dependencies
│   └── gallery.db            # SQLite database (created on first run)
├── src/
│   ├── App.tsx              # UPDATED! Uses API instead of localStorage
│   ├── components/
│   │   ├── Login.tsx        # UPDATED! Calls /api/login
│   │   ├── PhotoUploader.tsx
│   │   └── PhotoCard.tsx
│   ├── types/
│   │   └── index.ts
│   ├── globals.css
│   └── main.tsx
└── index.html
```

## API Reference

### Login

```bash
POST /api/login
Content-Type: application/json

{
  "username": "gauransh",
  "password": "gauransh@123"
}

Response:
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "username": "gauransh",
    "isSpecialUser": false
  }
}
```

### Get Photos

```bash
GET /api/photos/:userId

Response:
{
  "photos": [
    {
      "id": "photo-uuid",
      "userId": "user-uuid",
      "image": "data:image/jpeg;base64,...",
      "caption": "Beautiful sunset",
      "song": "data:audio/mp3;base64,...",
      "songName": "relaxing-music.mp3",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Upload Photo

```bash
POST /api/photos
Content-Type: application/json

{
  "userId": "user-uuid",
  "image": "data:image/jpeg;base64,...",
  "caption": "Beautiful sunset 🌅",
  "song": "data:audio/mp3;base64,...",
  "songName": "relaxing-music.mp3"
}

Response:
{
  "success": true,
  "photo": {
    "id": "new-photo-uuid",
    "userId": "user-uuid",
    ...
  }
}
```

### Delete Photo

```bash
DELETE /api/photos/:photoId

Response:
{
  "success": true,
  "message": "Photo deleted"
}
```

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT,  -- null for shruti, hashed for gauransh
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Photos Table
CREATE TABLE photos (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  image TEXT NOT NULL,          -- Base64 encoded
  caption TEXT,
  song TEXT,                    -- Base64 encoded (optional)
  songName TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Troubleshooting

### "Cannot connect to server"

- Make sure backend is running: `node server.js` (should show port 5000)
- Check if port 5000 is available: `netstat -ano | findstr 5000`

### "Login successful but no photos show"

- Backend may not have fetched your photos yet
- Check browser console (F12) for errors
- Verify userId is being stored in localStorage

### Database Issues

- Delete `server/gallery.db` to reset (will lose all photos)
- Database auto-creates tables on first run

### CORS Errors

- Make sure both servers are running
- Frontend should be http://localhost:5175
- Backend should be http://localhost:5000

## Future Enhancements

- [ ] Cloud storage for larger file support
- [ ] End-to-end encryption for privacy
- [ ] Shared gallery links (invite-only galleries)
- [ ] Real-time sync with WebSocket
- [ ] Photo editing tools
- [ ] Album collections
- [ ] Collaborative galleries

## Stack

- **Frontend**: React 18.2 + TypeScript 5.2 + Vite 5.0 + Tailwind CSS
- **Backend**: Node.js + Express.js 4.18
- **Database**: SQLite3
- **UI**: Framer Motion (animations)

---

**Enjoy your cute photo gallery with cross-device sync!** 🎀✨
