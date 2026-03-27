'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/artists', label: 'Artists' },
  { href: '/releases', label: 'Releases' },
  { href: '/audition', label: 'Audition' },
  { href: '/news', label: 'News' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<'vi'|'en'>('vi')
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''} style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 48px',background: scrolled ? 'rgba(5,5,5,.85)' : 'linear-gradient(to bottom, rgba(5,5,5,.9) 0%, transparent 100%)',backdropFilter: scrolled ? 'blur(12px)' : 'none',transition:'all .3s' }}>
        <Link href="/" style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:18, letterSpacing:'.3em', color:'var(--fg)', textDecoration:'none' }}>
          UNIFLOWS
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          {/* Lang switcher */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => setLang('vi')} style={{ background:'none',border:'none',fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.22em',cursor:'none',color: lang==='vi' ? 'var(--accent)' : 'var(--fg)',opacity: lang==='vi' ? 1 : .35,textTransform:'uppercase' }}>VI</button>
            <span style={{ opacity:.2,fontSize:10 }}>|</span>
            <button onClick={() => setLang('en')} style={{ background:'none',border:'none',fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.22em',cursor:'none',color: lang==='en' ? 'var(--accent)' : 'var(--fg)',opacity: lang==='en' ? 1 : .35,textTransform:'uppercase' }}>EN</button>
          </div>
          <button onClick={() => setOpen(!open)} style={{ background:'none',border:'none',color:'var(--fg)',fontFamily:'Space Mono,monospace',fontSize:11,letterSpacing:'.22em',cursor:'none',display:'flex',alignItems:'center',gap:10,textTransform:'uppercase' }}>
            <div style={{ display:'flex',flexDirection:'column',gap:4 }}>
              <div style={{ width:22,height:1,background:'var(--fg)',transition:'transform .3s',transform: open ? 'rotate(45deg) translate(3px,3px)' : 'none' }} />
              <div style={{ width:22,height:1,background:'var(--fg)',transition:'opacity .3s',opacity: open ? 0 : 1 }} />
              <div style={{ width:22,height:1,background:'var(--fg)',transition:'transform .3s',transform: open ? 'rotate(-45deg) translate(3px,-3px)' : 'none' }} />
            </div>
            Menu
          </button>
        </div>
      </nav>

      {/* Menu overlay */}
      <div style={{ position:'fixed',inset:0,zIndex:90,background:'rgba(5,5,5,.97)',backdropFilter:'blur(16px)',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 48px',transform: open ? 'translateY(0)' : 'translateY(-100%)',transition:'transform .6s cubic-bezier(0.16,1,0.3,1)',pointerEvents: open ? 'all' : 'none' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:80 }}>
          {links.map((l, i) => (
            <Link key={l.href} href={l.href} style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,96px)',letterSpacing:'.04em',color:'var(--fg)',textDecoration:'none',opacity: open ? 1 : 0,transform: open ? 'none' : 'translateY(20px)',transition:`opacity .4s ${i*.08}s, transform .4s ${i*.08}s`,display:'flex',alignItems:'center',gap:16,lineHeight:1 }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg)')}
            >
              <span style={{ fontSize:12,letterSpacing:'.2em',color:'var(--accent)',fontFamily:'Space Mono,monospace' }}>0{i+1}</span>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
