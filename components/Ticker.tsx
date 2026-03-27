'use client'
import { useState, useEffect } from 'react'

export default function Ticker({ textVI, textEN }: { textVI: string; textEN: string }) {
  const [lang, setLang] = useState<'vi'|'en'>('vi')

  useEffect(() => {
    const h = (e: CustomEvent) => setLang(e.detail)
    window.addEventListener('langChange' as any, h)
    return () => window.removeEventListener('langChange' as any, h)
  }, [])

  const raw = lang === 'en' ? textEN : textVI
  const parts = raw.split('✦').map(s => s.trim()).filter(Boolean)
  const items = parts.map((item, i) => i % 2 === 0
    ? <span key={i} className="ticker-item">{item}</span>
    : <span key={i} className="ticker-item acc">✦ {item}</span>
  )

  return (
    <div className="ticker-wrap">
      <div className="ticker">{items}{items}</div>
    </div>
  )
}
