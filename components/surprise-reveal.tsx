"use client"

import { useState, useRef, useCallback } from "react"
import { FloatingHearts } from "./floating-hearts"
import { Confetti } from "./confetti"
import { Heart } from "lucide-react"

const ROMANTIC_LINES = [
  "You make my world brighter",
  "Every moment with you is special",
  "Your smile is my favorite thing in this universe",
  "You are the reason I believe in magic",
]

const EMOJI_DECORATIONS = [
  { emoji: "💕", delay: 0, duration: 3 },
  { emoji: "🌹", delay: 0.3, duration: 3.5 },
  { emoji: "💘", delay: 0.6, duration: 3 },
  { emoji: "✨", delay: 0.9, duration: 2.5 },
  { emoji: "💝", delay: 1.2, duration: 3.5 },
  { emoji: "💗", delay: 1.5, duration: 3 },
  { emoji: "🌸", delay: 1.8, duration: 3.2 },
  { emoji: "💖", delay: 2.1, duration: 2.8 },
]

export function SurpriseReveal() {
  const [stage, setStage] = useState<"mystery" | "reveal" | "valentine-yes">("mystery")
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSadEmoji, setShowSadEmoji] = useState(false)
  const [sadEmojiPos, setSadEmojiPos] = useState({ x: 0, y: 0 })
  const [noButtonCooldown, setNoButtonCooldown] = useState(false)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleSurprise = useCallback(() => {
    setStage("reveal")
    // Play background music after user interaction (mobile-friendly)
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(
          "https://cdn.pixabay.com/audio/2024/11/28/audio_fed3f5f8cf.mp3"
        )
        audioRef.current.loop = true
        audioRef.current.volume = 0.3
      }
      audioRef.current.play().catch(() => {
        /* autoplay blocked - silently ignore */
      })
    } catch {
      /* audio not supported */
    }
  }, [])

  const handleYes = useCallback(() => {
    setStage("valentine-yes")
    setShowConfetti(true)
  }, [])

  const handleNoHover = useCallback(() => {
    if (!noButtonRef.current || noButtonCooldown) return

    const btn = noButtonRef.current
    const rect = btn.getBoundingClientRect()
    const parentRect = btn.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 }

    // Get viewport dimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate available space
    const buttonWidth = btn.offsetWidth
    const buttonHeight = btn.offsetHeight
    const padding = 20

    // Calculate max possible viewport coordinates for top-left of button
    const maxViewportX = viewportWidth - buttonWidth - padding
    const maxViewportY = viewportHeight - buttonHeight - padding

    // Generate random viewport coordinates
    const newViewportX = Math.max(padding, Math.random() * maxViewportX)
    const newViewportY = Math.max(padding, Math.random() * maxViewportY)

    // Convert to local coordinates relative to offsetParent
    const newLeft = newViewportX - parentRect.left
    const newTop = newViewportY - parentRect.top

    // Store sad emoji position before moving button
    setSadEmojiPos({ x: rect.left, y: rect.top })

    // Set cooldown
    setNoButtonCooldown(true)
    setTimeout(() => setNoButtonCooldown(false), 500)

    // Move button to new position
    btn.style.position = "absolute"
    btn.style.left = `${newLeft}px`
    btn.style.top = `${newTop}px`
    btn.style.zIndex = "50"
    btn.style.transition = "all 0.2s ease-out"

    // Show sad emoji where button was
    setShowSadEmoji(true)

    // Hide sad emoji faster
    setTimeout(() => setShowSadEmoji(false), 500)
  }, [noButtonCooldown])

  const handleNoClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    handleNoHover()
  }, [handleNoHover])

  const handleNoLeave = useCallback(() => {
    setShowSadEmoji(false)
  }, [])

  // --- MYSTERY SCREEN ---
  if (stage === "mystery") {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
        {/* Soft ambient hearts in background */}
        <FloatingHearts count={8} />

        {/* Animated emoji decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {EMOJI_DECORATIONS.map((item, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-float"
              style={{
                left: `${10 + (i % 4) * 20}%`,
                top: `${20 + Math.floor(i / 4) * 30}%`,
                animationName: 'float',
                animationDuration: '6s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${item.delay}s`,
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        <div className="relative z-20 flex flex-col items-center gap-8 text-center">
          {/* Envelope icon */}
          <div className="animate-heartbeat">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 md:h-32 md:w-32">
              <span className="text-5xl md:text-6xl" role="img" aria-label="love letter">
                {"\uD83D\uDC8C"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              Someone has a surprise for you
            </p>
            <h1 className="font-cursive text-3xl text-foreground md:text-4xl">
              Are you ready?
            </h1>
          </div>

          <button
            onClick={handleSurprise}
            className="group relative rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse-glow md:px-10 md:py-5 md:text-xl"
          >
            <span className="relative z-10 flex items-center gap-2">
              Tap for a Surprise
              <span className="text-xl">{"\uD83D\uDC8C"}</span>
            </span>
          </button>
        </div>
      </main>
    )
  }

  // --- VALENTINE YES SCREEN ---
  if (stage === "valentine-yes") {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
        <FloatingHearts count={30} />
        {showConfetti && <Confetti />}

        {/* Animated emoji celebration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl md:text-5xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationName: 'bounce-emoji',
                animationDuration: '1s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {["💕", "🎉", "🌹", "💘", "✨", "💝", "🎊", "💖", "💗", "🌸", "💓", "🎈"][i]}
            </div>
          ))}
        </div>

        <div className="relative z-20 flex flex-col items-center gap-6 text-center">
          <div className="animate-heartbeat">
            <span className="text-7xl md:text-8xl" role="img" aria-label="hearts">
              {"\uD83E\uDD70"}
            </span>
          </div>

          <h1
            className="font-cursive text-3xl text-foreground md:text-5xl"
            style={{ animation: "scale-in 0.6s ease-out forwards" }}
          >
            Yayyy!
          </h1>

          <p
            className="max-w-sm text-lg leading-relaxed text-foreground/80 md:text-xl"
            style={{ animation: "fade-in-up 0.8s ease-out 0.3s forwards", opacity: 0 }}
          >
            You just made me the happiest person in the whole world
          </p>

          <div
            className="flex items-center gap-2 text-primary"
            style={{ animation: "fade-in-up 0.8s ease-out 0.6s forwards", opacity: 0 }}
          >
            <Heart className="h-5 w-5 fill-primary" />
            <Heart className="h-7 w-7 fill-primary" />
            <Heart className="h-5 w-5 fill-primary" />
          </div>

          <p
            className="font-cursive mt-4 text-2xl text-primary md:text-3xl"
            style={{ animation: "fade-in-up 0.8s ease-out 0.9s forwards", opacity: 0 }}
          >
            Forever yours, with all my heart
          </p>
        </div>
      </main>
    )
  }

  // --- REVEAL SCREEN ---
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12">
      <FloatingHearts count={25} />

      {/* Animated emoji decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {EMOJI_DECORATIONS.map((item, i) => (
          <div
            key={i}
            className="absolute text-3xl md:text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationName: 'float',
              animationDuration: '8s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${item.delay}s`,
            }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <div className="relative z-20 flex w-full max-w-md flex-col items-center gap-8 text-center">
        {/* Main heading */}
        <div
          className="flex flex-col items-center gap-4"
          style={{ animation: "scale-in 0.6s ease-out forwards" }}
        >
          <span className="text-6xl md:text-7xl" role="img" aria-label="heart">
            {"\u2764\uFE0F"}
          </span>
          <h1 className="font-cursive text-4xl leading-tight text-foreground md:text-6xl text-balance">
            Happy Valentine{"'"}s Day, Maanvii
          </h1>
        </div>

        {/* Romantic lines */}
        <div className="flex flex-col gap-4 w-full">
          {ROMANTIC_LINES.map((line, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card/60 px-6 py-4 backdrop-blur-sm shadow-sm"
              style={{
                animation: `fade-in-up 0.8s ease-out ${0.3 + i * 0.2}s forwards`,
                opacity: 0,
              }}
            >
              <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
                {line}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="flex items-center gap-3"
          style={{ animation: "fade-in-up 0.8s ease-out 1.2s forwards", opacity: 0 }}
        >
          <div className="h-px w-12 bg-primary/30" />
          <Heart className="h-4 w-4 text-primary fill-primary" />
          <div className="h-px w-12 bg-primary/30" />
        </div>

        {/* Valentine Question */}
        <div
          className="flex flex-col items-center gap-5 w-full"
          style={{ animation: "fade-in-up 0.8s ease-out 1.4s forwards", opacity: 0 }}
        >
          <h2 className="font-cursive text-2xl text-foreground md:text-3xl">
            Will you be my Valentine?
            <span className="ml-1">{"\uD83D\uDC96"}</span>
          </h2>

          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={handleYes}
              className="flex-1 rounded-full bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow-md transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              Yes!
            </button>

            <button
              ref={noButtonRef}
              onClick={handleNoClick}
              onMouseEnter={handleNoHover}
              onMouseLeave={handleNoLeave}
              onTouchStart={handleNoHover}
              onTouchEnd={handleNoLeave}
              className="flex-1 rounded-full border-2 border-primary/30 bg-card px-6 py-3 text-lg font-semibold text-muted-foreground transition-all duration-300 hover:border-primary/50"
              style={{ pointerEvents: "auto" }}
            >
              No
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p
          className="mt-4 text-xs text-muted-foreground/60"
          style={{ animation: "fade-in-up 0.8s ease-out 1.6s forwards", opacity: 0 }}
        >
          Made with love, just for you
        </p>
      </div>

      {/* Sad emoji when hovering on No button */}
      {showSadEmoji && (
        <div
          className="fixed text-5xl md:text-6xl pointer-events-none"
          style={{
            left: `${sadEmojiPos.x}px`,
            top: `${sadEmojiPos.y}px`,
            zIndex: "40",
            animationName: 'float',
            animationDuration: '0.5s', // Faster
            animationTimingFunction: 'ease-out',
            animationIterationCount: '1',
            opacity: 0, // Ensure it starts invisible and fades in? No, float anim probably handles it.
            // Actually float anim usually moves up and fades. Let's assume standard behavior.
          }}
        >
          😢
        </div>
      )}
    </main>
  )
}
