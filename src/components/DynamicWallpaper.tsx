import React from 'react'

interface DynamicWallpaperProps {
  children: React.ReactNode
}

const emojis = ['💖', '🐼', '🎀', '💕', '✨', '🌸']

export default function DynamicWallpaper({ children }: DynamicWallpaperProps) {
  const [floatingEmojis, setFloatingEmojis] = React.useState<
    Array<{ id: number; emoji: string; left: number; delay: number }>
  >([])

  React.useEffect(() => {
    // Generate floating emojis
    const emojisArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 5
    }))
    setFloatingEmojis(emojisArray)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(-45deg, #FFE5F0, #FFB6D9, #FFC0CB, #FFD1DC, #FF69B4, #FFE5F0)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      />

      {/* Floating emojis */}
      {floatingEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-pulse"
          style={{
            left: `${item.left}%`,
            top: '-50px',
            animation: `float 12s infinite linear`,
            animationDelay: `${item.delay}s`,
            opacity: 0.6,
            zIndex: 0
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
            transform: translateY(50vh) translateX(30px);
          }
          100% {
            transform: translateY(100vh) translateX(-30px);
            opacity: 0;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}
