"use client"

import { useEffect, useState } from "react"

interface Heart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function FloatingHearts({ count = 20 }: { count?: number }) {
  const [hearts, setHearts] = useState<Heart[]>([])

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 12,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setHearts(generated)
  }, [count])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-10" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute text-primary"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animation: `float-heart ${heart.duration}s ease-in-out ${heart.delay}s infinite`,
            opacity: heart.opacity,
          }}
        >
          {heart.id % 3 === 0 ? "\u2764\uFE0F" : heart.id % 3 === 1 ? "\uD83D\uDC95" : "\uD83E\uDE77"}
        </span>
      ))}
    </div>
  )
}
