import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Artists — UniFLOWs Label' }
export const revalidate = 60

export default async function ArtistsPage() {
  const { data: artists } = await supabase.from('artists').select('*').order('sort_order')
  const { data: settings } = await supabase.from('settings').select('key,value')
  const s: Record<string,string> = {}
  settings?.forEach(r => { s[r.key] = r.value })

  return (
    <div style={{ paddingTop:120 }}>
      <div style={{ padding:'0 48px 60px' }}>
        <p className="section-label">{s['artists-section-title']||'Our Artists'}</p>
        <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,96px)',letterSpacing:'.04em',lineHeight:.9 }}>
          THE ROSTER
        </h1>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(380px,1fr))',gap:2 }}>
        {artists?.map(a => {
          const initials = (a.name||'?').split(' ').map((w:string)=>w[0]).join('').substring(0,2).toUpperCase()
          return (
            <Link key={a.id} href={`/artists/${a.id}`} style={{ textDecoration:'none',color:'var(--fg)',position:'relative',aspectRatio:'4/5',overflow:'hidden',background:'#0a0a0a',display:'block' }}>
              <div style={{ position:'absolute',bottom:-20,right:-10,fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(80px,14vw,160px)',letterSpacing:'.04em',opacity:.04,lineHeight:1,userSelect:'none' }}>{initials}</div>
              {a.image_url && <div style={{ position:'absolute',inset:0,backgroundImage:`url(${a.image_url})`,backgroundSize:'cover',backgroundPosition:'center top' }} />}
              <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(5,5,5,.9) 0%,transparent 60%)' }} />
              <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:32 }}>
                <p style={{ fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'var(--accent)',opacity:.75,marginBottom:8 }}>{a.tag}</p>
                <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(32px,4vw,52px)',letterSpacing:'.04em',lineHeight:1,marginBottom:8 }}>{a.name}</h2>
                {a.members && <p style={{ fontSize:10,letterSpacing:'.15em',opacity:.45 }}>{a.members}</p>}
                <p style={{ marginTop:16,fontSize:9,letterSpacing:'.2em',color:'var(--accent)',textTransform:'uppercase' }}>View Profile ↗</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
