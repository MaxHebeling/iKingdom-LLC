'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const scale = useRef(1)
  const opacity = useRef(1)

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return

    setVisible(true)

    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // Hide cursor when over chat widget or any input
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.closest('[data-chat-widget]') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('[contenteditable]'))
      ) {
        opacity.current = 0
      } else {
        opacity.current = 1
      }
    }

    // Use event delegation — no MutationObserver, no per-element listeners
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]')
      ) {
        scale.current = 1.5
      } else {
        scale.current = 1
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })

    // Animation loop
    const lerp = 0.15
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * lerp
      pos.current.y += (mouse.current.y - pos.current.y) * lerp

      gsap.set(cursor, {
        x: pos.current.x - 20,
        y: pos.current.y - 20,
        scale: scale.current,
        opacity: opacity.current,
      })
    }

    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      gsap.ticker.remove(tick)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-10 w-10 rounded-full border border-white mix-blend-difference"
      style={{ willChange: 'transform' }}
    />
  )
}
