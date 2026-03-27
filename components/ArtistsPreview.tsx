'use client'
import Link from 'next/link'
import { Artist } from '@/lib/supabase'

export default function ArtistsPreview({ artists }: { artists: Artist[] }) {
  if (!artists.length) return null

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:2 }}>
      {artists.map(a => {
        const initials = (a.name||'?').split(' ').map((w:string)=>w[0]).join('').substring(0,2).toUpperCase()
        return (
          <Link key={a.id} href={`/artists/${a.id}`} style={{ textDecoration:'none', color:'var(--fg)', position:'relative', aspectRatio:'3/4', overflow:'hidden', background:'#0a0a0a', display:'block' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.querySelector<HTMLElement>('.artist-view-btn')!.style.opacity='1' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.querySelector<HTMLElement>('.artist-view-btn')!.style.opacity='0' }}
          >
            {/* BG text */}
            <div style={{ position:'absolute',bottom:-20,right:-10,fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(80px,14vw,160px)',letterSpacing:'.04em',opacity:.04,lineHeight:1,userSelect:'none' }}>{initials}</div>

            {/* Photo */}
            {a.image_url && (
              <div style={{ position:'absolute',inset:0,backgroundImage:`url(${a.image_url})`,backgroundSize:'cover',backgroundPosition:'center top' }} />
            )}

            {/* Overlay */}
            <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,5,5,.9) 0%,transparent 60%)' }} />

            {/* View btn */}
            <div className="artist-view-btn" style={{ position:'absolute',top:24,right:24,fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.2em',color:'var(--accent)',border:'1px solid rgba(200,245,66,.4)',padding:'8px 16px',opacity:0,transition:'opacity .2s',textTransform:'uppercase' }}>
              View ↗
            </div>

            {/* Info */}
            <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:28 }}>
              <p style={{ fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'var(--accent)',opacity:.75,marginBottom:7 }}>{a.tag}</p>
              <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(28px,4vw,48px)',letterSpacing:'.04em',lineHeight:1,marginBottom:8 }}>{a.name}</h2>
              {a.members && <p style={{ fontSize:10,letterSpacing:'.15em',opacity:.45 }}>{a.members}</p>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
