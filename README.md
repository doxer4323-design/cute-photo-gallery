# 🎀 Cute Photo Gallery 🎀

A beautiful, adorable photo gallery application where you can upload photos, add cute captions, and attach songs to your memories!

## ✨ Features

### 🔐 Cute Login System

- **Username-based login** with special user privileges
- **Two user accounts**:

  - **Shruti** (Special User! 👑)
    - No password needed
    - Gets special "Madam Ji" popup message
    - Direct access to gallery
  - **Gauransh** (Regular User)
    - Password: `gauransh@123`
    - Gets personalized welcome message
    - Full gallery access

- **Cute Login Features**:
  - Beautiful animated login form
  - Password visibility toggle (👁️ eye icon)
  - Helpful hints for usernames
  - Smooth transitions and animations
- **Cute Popup Messages**:
  - 👑 **"Madam Ji, You Don't Need Password!"** for Shruti (Special popup with crown animation)
  - ✨ **"Welcome Gauransh! 💖"** for Gauransh (Welcome popup)
  - ❌ **Error messages** for wrong passwords or unknown users
- Once logged in, session is saved in your browser
- Easy logout button in the gallery header

### � Photo Upload

- Easy drag-and-drop or click to upload photos
- Preview before uploading
- Support for all common image formats (JPG, PNG, GIF, WebP)

### 💭 Cute Captions

- Add personalized captions to each photo (up to 200 characters)
- Character counter to track caption length
- Beautiful display with your photos

### 🎵 Music Integration

- Attach songs to any photo
- Built-in audio player for each photo
- Play/pause controls
- Support for MP3, WAV, OGG, M4A formats

### 🎨 Beautiful UI Design

- Light pink animated gradient background
- Cute emojis throughout (pandas 🐼, hearts 💖, ribbons 🎀)
- Smooth animations with Framer Motion
- Responsive design for all devices
- Floating animations and heartbeat effects

### 💾 Local Storage

- All photos and songs are saved to your browser's local storage
- Persists data even after closing the page
- No server needed - your data stays private!

### 🗑️ Easy Management

- Delete photos with one click
- Hover to see delete button
- Clean, organized gallery layout

## 🚀 How to Use

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The app will open automatically at `http://localhost:5175`

### Login to Your Gallery

**Option 1: Login as Shruti (Special User! 👑)**

1. Enter username: **shruti**
2. Password field will disappear automatically
3. See cute popup: **"Madam Ji, You Don't Need Password! 👑"**
4. ✨ Get instant access to your gallery!

**Option 2: Login as Gauransh**

1. Enter username: **gauransh**
2. Enter password: **gauransh@123**
3. See personalized welcome popup: **"Welcome Gauransh! 💖"**
4. 🎉 Access your beautiful gallery!

**Login Features**:

- Click the 👁️ eye icon to toggle password visibility
- Helpful hints show available usernames
- Beautiful animated popups for each login state
- Session is automatically saved

### Adding Photos

1. **Click the "✨ Add Photo ✨" card** on the left side
2. **Upload a photo** by clicking the dashed box or dragging an image
3. **Write a caption** in the text field (optional but recommended!)
4. **Add a song** by clicking the music box (optional)
5. **Click "💖 Upload & Share"** button

### Browsing Your Gallery

- View all your photos in a responsive grid
- Hover over photos to delete them
- Click the music note (🎵) on photos with songs to play them
- Photos are displayed newest first

## 📁 Project Structure

```
cute-photo-gallery/
├── src/
│   ├── components/
│   │   ├── PhotoUploader.tsx    # Photo upload form
│   │   └── PhotoCard.tsx        # Individual photo card display
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── globals.css             # Global styles & animations
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.cjs          # PostCSS configuration
└── package.json                # Dependencies
```

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **LocalStorage API** - Data persistence

## 🎨 Design Features

### Color Palette

- **Light Pink**: `#FFE5F0`
- **Cute Pink**: `#FFB6D9`
- **Dark Pink**: `#FF69B4`
- **Heart Red**: `#FF1493`

### Animations

- 🎀 Floating pandas and ribbons
- 💖 Heartbeat animation for hearts
- ✨ Smooth card hover effects
- 🌸 Bouncing footer elements
- 🎨 Animated gradient background

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 💾 Data Storage

All your photos and songs are stored in your browser's **LocalStorage**:

- Up to 5-10MB storage depending on browser
- Data persists between sessions
- Completely private - no uploads to server
- Clear browser cache to remove data

## 🎯 Tips & Tricks

### For Best Results

- Use high-quality photos for beautiful display
- Keep captions short and sweet (200 chars max)
- Pair upbeat songs with happy photos
- Organize by theme or date

### Performance

- Works smoothly with 50+ photos
- Mobile-friendly and responsive
- Animations are hardware-accelerated

## 🚀 Future Enhancements

- 📥 Import/Export photos as ZIP
- 🏷️ Add tags and categories
- 🔍 Search and filter photos
- 💬 Add comments to photos
- 👥 Share gallery links
- 🌈 Custom themes
- 📊 Photo statistics
- 🎬 Create slideshows

## 🐛 Troubleshooting

### Photos not saving?

- Check browser's LocalStorage is enabled
- Try clearing browser cache if you have old data
- Use a modern browser (Chrome, Firefox, Safari, Edge)

### Songs not playing?

- Ensure audio file is in supported format (MP3, WAV, OGG, M4A)
- Check browser volume is not muted
- Reload the page and try again

### Photo upload failing?

- Check file size (should be under 5MB)
- Ensure file is a valid image format
- Try a different browser if issues persist

## 📄 License

MIT License - Feel free to use and modify!

## 🎀 Credits

Created with lots of 💖 for everyone who loves cute things!

Made with ✨ emojis and animations 🎀🐼💖

---

**Enjoy creating your cute photo gallery! 🎀✨**
