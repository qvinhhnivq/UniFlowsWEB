import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'News — UniFLOWs Label' }
export const revalidate = 60

export default async function NewsPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id,title,slug,excerpt,cover_url,published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div style={{ paddingTop: 120 }}>
      <div style={{ padding:'0 48px 60px',borderBottom:'1px solid var(--muted)' }}>
        <p className="section-label">Updates</p>
        <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(48px,8vw,96px)',letterSpacing:'.04em',lineHeight:.9 }}>NEWS</h1>
      </div>

      {posts && posts.length > 0 ? (
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))',gap:2 }}>
          {posts.map(post => (
            <Link key={post.id} href={`/news/${post.slug}`}
              style={{ textDecoration:'none',color:'var(--fg)',display:'block',background:'#0a0a0a',transition:'background .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#111' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#0a0a0a' }}
            >
              {post.cover_url && (
                <div style={{ width:'100%',aspectRatio:'16/9',backgroundImage:`url(${post.cover_url})`,backgroundSize:'cover',backgroundPosition:'center' }} />
              )}
              <div style={{ padding:'28px 28px 32px' }}>
                <div style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.3,marginBottom:12 }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}) : ''}
                </div>
                <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:'.04em',lineHeight:1.1,marginBottom:12 }}>{post.title}</h2>
                {post.excerpt && <p style={{ fontSize:11,lineHeight:1.75,opacity:.45,marginBottom:16 }}>{post.excerpt}</p>}
                <span style={{ fontSize:9,letterSpacing:'.2em',color:'var(--accent)',textTransform:'uppercase' }}>Đọc tiếp →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ padding:'120px 48px',textAlign:'center',opacity:.3 }}>
          <p style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em' }}>No posts yet</p>
        </div>
      )}
    </div>
  )
}
