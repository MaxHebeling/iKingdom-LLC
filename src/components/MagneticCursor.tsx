'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const scale = useRef(1)

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return

    setVisible(true)

    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onMouseEnter = () => {
      scale.current = 1.5
    }

    const onMouseLeave = () => {
      scale.current = 1
    }

    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"]')
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter)
        el.addEventListener('mouseleave', onMouseLeave)
      })
      return interactives
    }

    window.addEventListener('mousemove', onMouseMove)
    let interactives = addHoverListeners()

    // Re-attach listeners on DOM changes (e.g. route transitions)
    const observer = new MutationObserver(() => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
      })
      interactives = addHoverListeners()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    // Animation loop
    const lerp = 0.15
    const tick = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * lerp
      pos.current.y += (mouse.current.y - pos.current.y) * lerp

      gsap.set(cursor, {
        x: pos.current.x - 20,
        y: pos.current.y - 20,
        scale: scale.current,
      })
    }

    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter)
        el.removeEventListener('mouseleave', onMouseLeave)
      })
      observer.disconnect()
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
