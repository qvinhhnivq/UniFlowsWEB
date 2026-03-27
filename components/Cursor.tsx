'use client'
import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const dot = document.getElementById('cur-dot')
    const ring = document.getElementById('cur-ring')
    const glow = document.getElementById('cur-glow')
    let mx = 0, my = 0, rx = 0, ry = 0

    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px' }
      if (glow) { glow.style.left = mx + 'px'; glow.style.top = my + 'px' }
    }

    const lerp = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px' }
      requestAnimationFrame(lerp)
    }

    const onEnter = () => document.body.classList.add('cursor-link')
    const onLeave = () => document.body.classList.remove('cursor-link')

    document.addEventListener('mousemove', move, { passive: true })
    requestAnimationFrame(lerp)

    const registerLinks = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    registerLinks()
    const obs = new MutationObserver(registerLinks)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', move)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cur-dot" />
      <div id="cur-ring" />
      <div id="cur-glow" />
    </>
  )
}
