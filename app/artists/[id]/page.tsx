import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReleasesGrid from '@/components/ReleasesGrid'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data } = await supabase.from('artists').select('name,tag').eq('id', params.id).single()
  return { title: data ? `${data.name} — UniFLOWs Label` : 'Artist' }
}

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const [{ data: artist }, { data: releases }] = await Promise.all([
    supabase.from('artists').select('*').eq('id', params.id).single(),
    supabase.from('releases').select('*').eq('artist_id', params.id).order('sort_order'),
  ])

  if (!artist) notFound()

  const socials = [
    { label: 'Facebook', url: artist.fb_url },
    { label: 'Instagram', url: artist.ig_url },
    { label: 'YouTube', url: artist.yt_url },
    { label: 'TikTok', url: artist.tt_url },
    { label: 'Spotify', url: artist.sp_url },
    { label: 'SoundCloud', url: artist.sc_url },
  ].filter(s => s.url)

  return (
    <div style={{ paddingTop: 100 }}>
      {/* Back */}
      <div style={{ padding: '20px 48px' }}>
        <Link href="/artists" style={{ fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--fg)',opacity:.4,textDecoration:'none',transition:'opacity .2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity='1' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity='.4' }}
        >← Back to Artists</Link>
      </div>

      {/* Hero */}
      <div style={{ position:'relative',height:'60vh',minHeight:400,overflow:'hidden',marginBottom:80 }}>
        {artist.image_url
          ? <div style={{ position:'absolute',inset:0,backgroundImage:`url(${artist.image_url})`,backgroundSize:'cover',backgroundPosition:'center top' }} />
          : <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center' }}>
              <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'20vw',opacity:.03,letterSpacing:'.04em' }}>
                {artist.name.split(' ').map((w:string)=>w[0]).join('').substring(0,2)}
              </div>
            </div>
        }
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,var(--bg) 0%,transparent 50%)' }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'0 48px 48px' }}>
          <p style={{ fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',color:'var(--accent)',opacity:.75,marginBottom:10 }}>{artist.tag}</p>
          <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,100px)',letterSpacing:'.04em',lineHeight:.9 }}>{artist.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:'0 48px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,marginBottom:80 }}>
        <div>
          {artist.members && (
            <>
              <p style={{ fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',opacity:.28,marginBottom:16 }}>Members</p>
              <p style={{ fontFamily:'Noto Serif Display,serif',fontStyle:'italic',fontSize:22,opacity:.85,marginBottom:40,letterSpacing:'.02em' }}>{artist.members}</p>
            </>
          )}
          <p style={{ fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',opacity:.28,marginBottom:16 }}>About</p>
          <p style={{ fontSize:13,lineHeight:1.85,opacity:.6 }}>{artist.bio}</p>
        </div>
        {socials.length > 0 && (
          <div>
            <p style={{ fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',opacity:.28,marginBottom:20 }}>Follow</p>
            <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
              {socials.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener"
                  style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:24,letterSpacing:'.06em',color:'var(--fg)',textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--muted)',padding:'16px 0',transition:'color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='var(--fg)' }}
                >
                  {s.label} <span style={{ fontSize:16,opacity:.5 }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Releases */}
      {releases && releases.length > 0 && (
        <div style={{ padding:'0 48px 80px',borderTop:'1px solid var(--muted)',paddingTop:60 }}>
          <p style={{ fontSize:9,letterSpacing:'.3em',textTransform:'uppercase',opacity:.28,marginBottom:32 }}>Releases</p>
          <ReleasesGrid releases={releases} />
        </div>
      )}
    </div>
  )
}
