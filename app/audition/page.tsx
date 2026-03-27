import { supabase } from '@/lib/supabase'
import AuditionForm from '@/components/AuditionForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Audition — UniFLOWs Label' }
export const revalidate = 60

export default async function AuditionPage() {
  const [{ data: auditions }, { data: settings }] = await Promise.all([
    supabase.from('auditions').select('*').order('sort_order'),
    supabase.from('settings').select('key,value'),
  ])
  const s: Record<string,string> = {}
  settings?.forEach(r => { s[r.key] = r.value })

  const openAuditions = auditions?.filter(a => a.status === 'open') || []
  const closedAuditions = auditions?.filter(a => a.status === 'closed') || []

  return (
    <div style={{ paddingTop: 120 }}>
      {/* Header */}
      <div style={{ padding:'0 48px 60px',borderBottom:'1px solid var(--muted)' }}>
        <p className="section-label">Join Us</p>
        <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,96px)',letterSpacing:'.04em',lineHeight:.9,marginBottom:24 }}>
          AUDITION
        </h1>
        {s['aud-desc'] && (
          <p style={{ fontFamily:'Space Mono,monospace',fontSize:12,lineHeight:1.85,opacity:.5,maxWidth:600 }}>
            {s['aud-desc']}
          </p>
        )}
      </div>

      {/* Open auditions */}
      {openAuditions.length > 0 && (
        <div style={{ padding:'60px 48px',borderBottom:'1px solid var(--muted)' }}>
          {openAuditions.map(a => (
            <div key={a.id} style={{ marginBottom:60 }}>
              {/* Audition card */}
              <div style={{ display:'grid',gridTemplateColumns:a.image_url?'280px 1fr':'1fr',gap:0,border:'1px solid var(--muted)',marginBottom:0,position:'relative',overflow:'hidden' }}>
                {/* Accent bar */}
                <div style={{ position:'absolute',left:0,top:0,bottom:0,width:3,background:'var(--accent)' }} />

                {a.image_url && (
                  <div style={{ backgroundImage:`url(${a.image_url})`,backgroundSize:'cover',backgroundPosition:'center',minHeight:220 }} />
                )}

                <div style={{ padding:'32px 36px' }}>
                  <div style={{ display:'inline-flex',alignItems:'center',gap:8,fontSize:9,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--accent)',marginBottom:16 }}>
                    <span style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',display:'block',animation:'statusPulse 1.8s ease-in-out infinite' }} />
                    Đang mở đăng ký
                  </div>
                  <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(24px,3vw,40px)',letterSpacing:'.04em',lineHeight:1,marginBottom:12 }}>{a.title}</h2>
                  <p style={{ fontSize:11,lineHeight:1.85,opacity:.5,marginBottom:20,maxWidth:560 }}>{a.description}</p>
                  <div style={{ display:'flex',gap:24,flexWrap:'wrap' }}>
                    {a.type && <div style={{ fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',opacity:.35 }}>Hình thức <span style={{ color:'var(--fg)',opacity:.7 }}>{a.type}</span></div>}
                    {a.location && <div style={{ fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',opacity:.35 }}>Địa điểm <span style={{ color:'var(--fg)',opacity:.7 }}>{a.location}</span></div>}
                    {a.deadline && <div style={{ fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',opacity:.35 }}>Hạn nộp <span style={{ color:'var(--fg)',opacity:.7 }}>{a.deadline}</span></div>}
                  </div>
                </div>
              </div>

              {/* Inline form */}
              <div style={{ border:'1px solid var(--muted)',borderTop:'none',background:'#080808',padding:'40px 36px' }}>
                <p style={{ fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',opacity:.3,marginBottom:28 }}>Đăng ký tham gia</p>
                <AuditionForm auditionId={a.id} auditionTitle={a.title} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Closed auditions */}
      {closedAuditions.length > 0 && (
        <div style={{ padding:'60px 48px' }}>
          <p style={{ fontSize:9,letterSpacing:'.28em',textTransform:'uppercase',opacity:.3,marginBottom:32 }}>Đã kết thúc</p>
          {closedAuditions.map(a => (
            <div key={a.id} style={{ border:'1px solid var(--muted)',marginBottom:2,opacity:.45,display:'grid',gridTemplateColumns:a.image_url?'160px 1fr':'1fr',gap:0 }}>
              {a.image_url && <div style={{ backgroundImage:`url(${a.image_url})`,backgroundSize:'cover',backgroundPosition:'center',minHeight:120 }} />}
              <div style={{ padding:'24px 28px' }}>
                <div style={{ fontSize:9,letterSpacing:'.22em',textTransform:'uppercase',opacity:.5,marginBottom:8 }}>● Đã kết thúc</div>
                <h3 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:24,letterSpacing:'.04em' }}>{a.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {(!auditions || auditions.length === 0) && (
        <div style={{ padding:'120px 48px',textAlign:'center' }}>
          <div style={{ fontSize:32,marginBottom:16,opacity:.15 }}>🎤</div>
          <p style={{ opacity:.3,fontSize:12,letterSpacing:'.1em' }}>Hiện chưa có buổi audition nào.<br/>Theo dõi mạng xã hội để cập nhật sớm nhất.</p>
        </div>
      )}

      <style>{`
        @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
      `}</style>
    </div>
  )
}
