import { supabase } from '@/lib/supabase'
import ReleasesGrid from '@/components/ReleasesGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Releases — UniFLOWs Label' }
export const revalidate = 60

export default async function ReleasesPage() {
  const [{ data: releases }, { data: artists }] = await Promise.all([
    supabase.from('releases').select('*').order('sort_order'),
    supabase.from('artists').select('id,name').order('sort_order'),
  ])

  // Group releases by artist
  const grouped = artists?.map(a => ({
    artist: a,
    releases: releases?.filter(r => r.artist_id === a.id) || []
  })).filter(g => g.releases.length > 0) || []

  // Releases with no artist match
  const unmatched = releases?.filter(r => !artists?.find(a => a.id === r.artist_id)) || []

  return (
    <div style={{ paddingTop: 120 }}>
      <div style={{ padding:'0 48px 60px',borderBottom:'1px solid var(--muted)' }}>
        <p className="section-label">Discography</p>
        <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,96px)',letterSpacing:'.04em',lineHeight:.9 }}>
          ALL RELEASES
        </h1>
      </div>

      {grouped.map(g => (
        <div key={g.artist.id} style={{ padding:'60px 48px',borderBottom:'1px solid var(--muted)' }}>
          <p style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em',marginBottom:32,color:'var(--accent)' }}>
            {g.artist.name}
          </p>
          <ReleasesGrid releases={g.releases} />
        </div>
      ))}

      {unmatched.length > 0 && (
        <div style={{ padding:'60px 48px' }}>
          <p style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em',marginBottom:32,opacity:.4 }}>Other</p>
          <ReleasesGrid releases={unmatched} />
        </div>
      )}

      {(!releases || releases.length === 0) && (
        <div style={{ padding:'120px 48px',textAlign:'center',opacity:.3 }}>
          <p style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32 }}>No releases yet</p>
        </div>
      )}
    </div>
  )
}
