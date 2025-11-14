// Dynamic wallpaper backgrounds
export const wallpapers = [
  // Pink gradients
  'linear-gradient(-45deg, #FFE5F0, #FFB6D9, #FFC0CB, #FFD1DC, #FFE5F0)',
  'linear-gradient(135deg, #FFB6D9 0%, #FF69B4 50%, #FFB6D9 100%)',
  'linear-gradient(45deg, #FFE5F0, #FFB6D9, #FFC0CB)',
  
  // Pastel gradients
  'linear-gradient(-45deg, #FFF0F5, #FFE4E1, #FFDAB9, #FFE4E1, #FFF0F5)',
  'linear-gradient(135deg, #FFE4E1 0%, #FFDAB9 50%, #FFE4E1 100%)',
  
  // Warm pastels
  'linear-gradient(-45deg, #FFEAA7, #FFCCB9, #FFB6B9, #FFCCB9, #FFEAA7)',
  'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 50%, #FFB6C1 100%)',
  
  // Cool pastels
  'linear-gradient(-45deg, #E0F7FA, #B2EBF2, #80DEEA, #B2EBF2, #E0F7FA)',
  'linear-gradient(135deg, #B2EBF2 0%, #80DEEA 50%, #B2EBF2 100%)',
  
  // Sunset vibes
  'linear-gradient(-45deg, #FFE5B4, #FFDAB9, #FFB6C1, #FFDAB9, #FFE5B4)',
  'linear-gradient(135deg, #FFCCCC 0%, #FFCCB6 50%, #FFCCCC 100%)',
  
  // Lavender dreams
  'linear-gradient(-45deg, #E6E6FA, #DDA0DD, #EE82EE, #DDA0DD, #E6E6FA)',
  'linear-gradient(135deg, #DDA0DD 0%, #EE82EE 50%, #DDA0DD 100%)',
  
  // Peach cream
  'linear-gradient(-45deg, #FFEFD5, #FFEBCD, #FFDAB9, #FFEBCD, #FFEFD5)',
  'linear-gradient(135deg, #FFEBCD 0%, #FFDAB9 50%, #FFEBCD 100%)',
]

export function getRandomWallpaper(): string {
  return wallpapers[Math.floor(Math.random() * wallpapers.length)]
}

export function getTimeBasedWallpaper(): string {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    // Morning - fresh and bright
    return wallpapers[0]
  } else if (hour >= 12 && hour < 17) {
    // Afternoon - warm pastels
    return wallpapers[5]
  } else if (hour >= 17 && hour < 21) {
    // Evening - sunset vibes
    return wallpapers[9]
  } else {
    // Night - cool pastels
    return wallpapers[7]
  }
}
