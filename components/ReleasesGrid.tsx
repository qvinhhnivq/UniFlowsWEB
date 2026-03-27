'use client'
import { Release } from '@/lib/supabase'
import { playTrack } from './AudioPlayer'

export default function ReleasesGrid({ releases }: { releases: Release[] }) {
  return (
    <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:2 }}>
      {releases.map(r => (
        <div key={r.id} style={{ background:'#0d0d0d',overflow:'hidden',transition:'background .2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#131313' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#0d0d0d' }}
        >
          {/* Cover */}
          <div style={{ aspectRatio:'1',background:r.cover_url?`url(${r.cover_url})`:'#111',backgroundSize:'cover',backgroundPosition:'center',position:'relative',display:'flex',alignItems:'center',justifyContent:'center' }}>
            {!r.cover_url && <div style={{ fontSize:28,opacity:.1 }}>♪</div>}
            {(r.audio_url || r.soundcloud_url) && (
              <button
                onClick={() => playTrack({ id:r.id, title:r.title, artist:'', audio_url:r.audio_url||r.soundcloud_url, cover_url:r.cover_url })}
                style={{ position:'absolute',inset:0,background:'rgba(0,0,0,.4)',border:'none',color:'#fff',fontSize:28,cursor:'none',opacity:0,transition:'opacity .2s',width:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity='1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity='0' }}
              >▶</button>
            )}
          </div>
          {/* Info */}
          <div style={{ padding:'14px 16px 18px' }}>
            <div style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.28,marginBottom:5 }}>{r.release_date}</div>
            <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:19,letterSpacing:'.04em',lineHeight:1.1,marginBottom:5 }}>{r.title||'Untitled'}</div>
            {r.description && <div style={{ fontSize:10,lineHeight:1.65,opacity:.38,marginBottom:10 }}>{r.description}</div>}
            <div style={{ display:'flex',gap:10,flexWrap:'wrap',marginTop:8 }}>
              {(r.audio_url||r.soundcloud_url) && (
                <button
                  onClick={() => playTrack({ id:r.id, title:r.title, artist:'', audio_url:r.audio_url||r.soundcloud_url, cover_url:r.cover_url })}
                  style={{ fontFamily:'Space Mono,monospace',fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--accent)',background:'rgba(200,245,66,.08)',border:'1px solid rgba(200,245,66,.25)',padding:'6px 12px',cursor:'none',transition:'background .2s,color .2s' }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.background='var(--accent)'; el.style.color='var(--bg)' }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.background='rgba(200,245,66,.08)'; el.style.color='var(--accent)' }}
                >{r.play_btn_text||'▶ Play'}</button>
              )}
              {r.spotify_url && <a href={r.spotify_url} target="_blank" rel="noopener" style={{ fontSize:9,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--accent)',textDecoration:'none',opacity:.65 }}>Spotify</a>}
              {r.apple_url && <a href={r.apple_url} target="_blank" rel="noopener" style={{ fontSize:9,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--accent)',textDecoration:'none',opacity:.65 }}>Apple</a>}
              {r.youtube_url && <a href={r.youtube_url} target="_blank" rel="noopener" style={{ fontSize:9,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--accent)',textDecoration:'none',opacity:.65 }}>YouTube</a>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
