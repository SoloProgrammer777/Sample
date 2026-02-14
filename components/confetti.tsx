"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  color: string
  size: number
  duration: number
  delay: number
  shape: "circle" | "square" | "heart"
}

const COLORS = [
  "#e91e63",
  "#f06292",
  "#ff80ab",
  "#f8bbd0",
  "#ff5252",
  "#ff1744",
  "#ffd700",
  "#ff6f00",
]

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const generated: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 6,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 1.5,
      shape: (["circle", "square", "heart"] as const)[Math.floor(Math.random() * 3)],
    }))
    setPieces(generated)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            width: piece.shape !== "heart" ? `${piece.size}px` : undefined,
            height: piece.shape !== "heart" ? `${piece.size}px` : undefined,
            fontSize: piece.shape === "heart" ? `${piece.size + 4}px` : undefined,
            backgroundColor: piece.shape !== "heart" ? piece.color : undefined,
            borderRadius: piece.shape === "circle" ? "50%" : "2px",
            animation: `confetti-fall ${piece.duration}s ease-in ${piece.delay}s forwards`,
            top: "-10px",
          }}
        >
          {piece.shape === "heart" ? "\u2764\uFE0F" : ""}
        </span>
      ))}
    </div>
  )
}
