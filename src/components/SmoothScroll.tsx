'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { type ReactNode } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useLenis(() => {
    ScrollTrigger.update()
  })

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
