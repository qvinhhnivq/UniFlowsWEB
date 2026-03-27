import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase.from('posts').select('title,excerpt,cover_url').eq('slug', params.slug).single()
  return {
    title: data ? `${data.title} — UniFLOWs Label` : 'News',
    description: data?.excerpt,
    openGraph: data?.cover_url ? { images: [data.cover_url] } : undefined,
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  return (
    <article style={{ paddingTop: 100 }}>
      {/* Back */}
      <div style={{ padding:'20px 48px' }}>
        <Link href="/news" style={{ fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--fg)',opacity:.4,textDecoration:'none' }}>
          ← Back to News
        </Link>
      </div>

      {/* Cover */}
      {post.cover_url && (
        <div style={{ width:'100%',aspectRatio:'21/9',backgroundImage:`url(${post.cover_url})`,backgroundSize:'cover',backgroundPosition:'center',marginBottom:60 }} />
      )}

      {/* Header */}
      <div style={{ padding:'0 48px',maxWidth:800,marginBottom:60 }}>
        <div style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.3,marginBottom:16 }}>
          {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN',{day:'2-digit',month:'long',year:'numeric'}) : ''}
        </div>
        <h1 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:'clamp(36px,6vw,72px)',letterSpacing:'.04em',lineHeight:.95,marginBottom:20 }}>{post.title}</h1>
        {post.excerpt && <p style={{ fontFamily:'Noto Serif Display,serif',fontStyle:'italic',fontSize:18,opacity:.6,lineHeight:1.7 }}>{post.excerpt}</p>}
      </div>

      {/* Content */}
      <div style={{ padding:'0 48px 100px',maxWidth:800,borderTop:'1px solid var(--muted)',paddingTop:48 }}>
        <div style={{ fontSize:14,lineHeight:1.9,opacity:.7,whiteSpace:'pre-wrap' }}
          dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g,'<br/>') || '' }}
        />
      </div>
    </article>
  )
}
