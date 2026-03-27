import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import HeroClient from '@/components/HeroClient'
import ArtistsPreview from '@/components/ArtistsPreview'
import Ticker from '@/components/Ticker'

async function getData() {
  const [{ data: settings }, { data: artists }, { data: posts }] = await Promise.all([
    supabase.from('settings').select('key,value'),
    supabase.from('artists').select('*').order('sort_order'),
    supabase.from('posts').select('id,title,slug,excerpt,cover_url,published_at').eq('published', true).order('published_at', { ascending: false }).limit(3),
  ])
  const s: Record<string, string> = {}
  settings?.forEach(r => { s[r.key] = r.value })
  return { s, artists: artists || [], posts: posts || [] }
}

export const revalidate = 60

export default async function HomePage() {
  const { s, artists, posts } = await getData()

  return (
    <>
      {/* Hero */}
      <HeroClient
        descVI={s['label-desc'] || 'Một label âm nhạc độc lập từ Sài Gòn — nơi những luồng chảy sáng tạo hội tụ và bùng phát.'}
        descEN={s['label-desc-en'] || 'An independent Hybrid music label from Saigon — where creative flows converge and explode.'}
        city={s['label-city'] || 'Ho Chi Minh City, Vietnam'}
      />

      {/* Ticker */}
      <Ticker
        textVI={s['ticker-vi'] || 'UniFLOWs Label ✦ VIOLIXX ✦ IT GIRL ✦ Ho Chi Minh City ✦ V-Pop Independent'}
        textEN={s['ticker-en'] || 'UniFLOWs Label ✦ VIOLIXX ✦ IT GIRL ✦ Ho Chi Minh City ✦ V-Pop Independent'}
      />

      {/* Artists preview */}
      <section style={{ padding:'80px 48px', borderTop:'1px solid var(--muted)' }}>
        <p className="section-label reveal" id="artists-section-title">
          {s['artists-section-title'] || 'Our Artists'}
        </p>
        <ArtistsPreview artists={artists} />
        <div style={{ marginTop:40, textAlign:'center' }}>
          <Link href="/artists" style={{ fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--accent)',border:'1px solid rgba(200,245,66,.35)',padding:'12px 32px',textDecoration:'none',transition:'background .2s, color .2s' }}
            onMouseEnter={undefined} // handled by CSS
          >
            View All Artists →
          </Link>
        </div>
      </section>

      {/* About */}
      <section style={{ padding:'80px 48px', borderTop:'1px solid var(--muted)' }}>
        <p className="section-label reveal">About The Label</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>
          <div className="reveal">
            <h2 style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:'clamp(36px,5vw,64px)', letterSpacing:'.04em', lineHeight:1 }}>
              WHERE MUSIC <em style={{ fontFamily:'Noto Serif Display,serif', fontStyle:'italic', color:'var(--accent)' }}>Flows</em> FREE
            </h2>
          </div>
          <div className="reveal reveal-delay-1">
            <p style={{ fontSize:13, lineHeight:1.8, opacity:.6, marginBottom:16 }}>
              UniFLOWs Label là một nhà máy sáng tạo độc lập tại TP.HCM — nơi âm nhạc không bị giới hạn bởi khuôn mẫu.
            </p>
            <p style={{ fontSize:13, lineHeight:1.8, opacity:.6, marginBottom:32 }}>
              Chúng tôi xây dựng sự nghiệp cho các nghệ sĩ V-Pop với cách tiếp cận toàn diện: từ sản xuất âm nhạc, hình ảnh thương hiệu đến phân phối kỹ thuật số và chiến lược phát triển fanbase.
            </p>
            <div style={{ display:'flex', gap:48 }}>
              <div>
                <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:48,letterSpacing:'.04em',color:'var(--accent)' }}>{s['stat1-num']||'2+'}</div>
                <div style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.4 }}>{s['stat1-lbl']||'Artists'}</div>
              </div>
              <div>
                <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:48,letterSpacing:'.04em',color:'var(--accent)' }}>{s['stat2-num']||'SGN'}</div>
                <div style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.4 }}>{s['stat2-lbl']||'Based In'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {posts.length > 0 && (
        <section style={{ padding:'80px 48px', borderTop:'1px solid var(--muted)' }}>
          <p className="section-label reveal">Latest News</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:2 }}>
            {posts.map((post: any) => (
              <Link key={post.id} href={`/news/${post.slug}`} style={{ textDecoration:'none', color:'var(--fg)', display:'block', background:'#0a0a0a', padding:'28px', transition:'background .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#111' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a0a0a' }}
              >
                {post.cover_url && (
                  <div style={{ width:'100%',aspectRatio:'16/9',backgroundImage:`url(${post.cover_url})`,backgroundSize:'cover',backgroundPosition:'center',marginBottom:20 }} />
                )}
                <div style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.3,marginBottom:10 }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN') : ''}
                </div>
                <h3 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:24,letterSpacing:'.04em',marginBottom:10,lineHeight:1.1 }}>{post.title}</h3>
                <p style={{ fontSize:11,opacity:.5,lineHeight:1.7 }}>{post.excerpt}</p>
                <div style={{ marginTop:16,fontSize:9,letterSpacing:'.2em',color:'var(--accent)',textTransform:'uppercase' }}>Đọc tiếp →</div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop:40,textAlign:'center' }}>
            <Link href="/news" style={{ fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--accent)',border:'1px solid rgba(200,245,66,.35)',padding:'12px 32px',textDecoration:'none' }}>
              All News →
            </Link>
          </div>
        </section>
      )}

      {/* Contact */}
      <section style={{ padding:'80px 48px', borderTop:'1px solid var(--muted)' }}>
        <p className="section-label reveal">Get In Touch</p>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start' }}>
          <div className="reveal">
            <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(36px,5vw,72px)',letterSpacing:'.02em',lineHeight:.9,marginBottom:40 }}>
              LET&apos;S <em style={{ fontFamily:'Noto Serif Display,serif',fontStyle:'italic',color:'var(--accent)' }}>create</em> TOGETHER
            </h2>
            <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
              <div>
                <div style={{ fontSize:9,letterSpacing:'.27em',textTransform:'uppercase',opacity:.25,marginBottom:5 }}>Location</div>
                <div style={{ fontSize:13,opacity:.68 }}>{s['label-city']||'Ho Chi Minh City, Vietnam'}</div>
              </div>
              <div>
                <div style={{ fontSize:9,letterSpacing:'.27em',textTransform:'uppercase',opacity:.25,marginBottom:5 }}>{s['email-contact-label']||'Email chung'}</div>
                <a href={`mailto:${s['email-contact']||'contact@uniflowslabel.com'}`} style={{ fontSize:13,opacity:.68,color:'var(--fg)',textDecoration:'none' }}>{s['email-contact']||'contact@uniflowslabel.com'}</a>
              </div>
              <div>
                <div style={{ fontSize:9,letterSpacing:'.27em',textTransform:'uppercase',opacity:.25,marginBottom:5 }}>{s['email-mgmt-label']||'Email quản lý'}</div>
                <a href={`mailto:${s['email-mgmt']||'management@uniflowslabel.com'}`} style={{ fontSize:13,opacity:.68,color:'var(--fg)',textDecoration:'none' }}>{s['email-mgmt']||'management@uniflowslabel.com'}</a>
              </div>
            </div>
          </div>
          <div className="reveal reveal-delay-1">
            <p style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.3,marginBottom:20 }}>Follow Us</p>
            <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
              {[
                { key:'label-fb', label:'Facebook' },
                { key:'label-ig', label:'Instagram' },
                { key:'label-yt', label:'YouTube' },
                { key:'label-tt', label:'TikTok' },
              ].filter(l => s[l.key]).map(l => (
                <a key={l.key} href={s[l.key]} target="_blank" rel="noopener" style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:'.1em',color:'var(--fg)',textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid var(--muted)',paddingBottom:12,transition:'color .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--fg)' }}
                >
                  {l.label} <span style={{ fontSize:14 }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
