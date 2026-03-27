'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  descVI: string
  descEN: string
  city: string
}

export default function HeroClient({ descVI, descEN, city }: Props) {
  const [lang, setLang] = useState<'vi'|'en'>('vi')

  // Listen for lang change from Nav
  useEffect(() => {
    const handler = (e: CustomEvent) => setLang(e.detail)
    window.addEventListener('langChange' as any, handler)
    return () => window.removeEventListener('langChange' as any, handler)
  }, [])

  return (
    <section style={{ position:'relative',minHeight:'100svh',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 48px 80px',overflow:'hidden' }}>
      {/* Orbs */}
      <div style={{ position:'absolute',width:600,height:600,left:'50%',top:'35%',transform:'translate(-50%,-50%)',borderRadius:'50%',background:'radial-gradient(circle,rgba(200,245,66,.07) 0%,rgba(200,245,66,.03) 40%,transparent 70%)',pointerEvents:'none',animation:'orbBreath 5s ease-in-out infinite' }} />
      <div style={{ position:'absolute',width:400,height:400,left:'50%',top:'35%',transform:'translate(-50%,-50%)',borderRadius:'50%',border:'1px solid rgba(200,245,66,.08)',pointerEvents:'none',animation:'orbBreath 5s ease-in-out infinite',animationDelay:'.3s' }} />
      <div style={{ position:'absolute',width:240,height:240,left:'50%',top:'35%',transform:'translate(-50%,-50%)',borderRadius:'50%',border:'1px solid rgba(200,245,66,.12)',pointerEvents:'none',animation:'orbBreath 5s ease-in-out infinite',animationDelay:'.6s' }} />

      <style>{`
        @keyframes orbBreath {
          0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}
          50%{transform:translate(-50%,-50%) scale(1.18);opacity:1}
        }
      `}</style>

      {/* City */}
      <p style={{ fontSize:9,letterSpacing:'.32em',textTransform:'uppercase',opacity:.28,marginBottom:20 }}>{city.split(',')[0].toUpperCase()}</p>

      {/* Heading */}
      <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(72px,12vw,160px)',letterSpacing:'.02em',lineHeight:.88,marginBottom:40 }}>
        UNI<em style={{ fontFamily:'Noto Serif Display,serif',fontStyle:'italic',color:'var(--accent)' }}>FLOWS</em><br />LABEL
      </h1>

      {/* Desc + CTA */}
      <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:40 }}>
        <p style={{ fontFamily:'Space Mono,monospace',fontSize:12,lineHeight:1.85,opacity:.55,maxWidth:480 }}>
          {lang === 'vi' ? descVI : descEN}
        </p>
        <Link href="/artists" style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:16,letterSpacing:'.2em',color:'var(--fg)',border:'1px solid rgba(240,236,227,.2)',padding:'16px 32px',textDecoration:'none',whiteSpace:'nowrap',flexShrink:0,transition:'background .2s,color .2s,border-color .2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='var(--accent)'; el.style.color='var(--bg)'; el.style.borderColor='var(--accent)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='none'; el.style.color='var(--fg)'; el.style.borderColor='rgba(240,236,227,.2)' }}
        >
          KHÁM PHÁ ↓
        </Link>
      </div>
    </section>
  )
}
