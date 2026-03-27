'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const inp: React.CSSProperties = { background:'#111',border:'1px solid #222',color:'#f0ece3',fontFamily:'Space Mono,monospace',fontSize:11,padding:'10px 14px',width:'100%',outline:'none' }
const lbl: React.CSSProperties = { fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',opacity:.35,display:'block',marginBottom:6 }
const btn: React.CSSProperties = { background:'var(--accent)',color:'#050505',border:'none',fontFamily:'Bebas Neue,sans-serif',fontSize:16,letterSpacing:'.15em',padding:'10px 28px',cursor:'pointer' }

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'settings'|'artists'|'releases'|'auditions'|'posts'|'applications'>('settings')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Data
  const [settings, setSettings] = useState<Record<string,string>>({})
  const [artists, setArtists] = useState<any[]>([])
  const [releases, setReleases] = useState<any[]>([])
  const [auditions, setAuditions] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])

  const checkPw = async () => {
    const { data } = await supabase.from('settings').select('value').eq('key','admin-password').single()
    const correct = data?.value || 'uniflows2024'
    if (pw === correct) { setAuthed(true); loadAll() }
    else alert('Mật khẩu không đúng')
  }

  const loadAll = async () => {
    const [s, a, r, au, p, ap] = await Promise.all([
      supabase.from('settings').select('key,value'),
      supabase.from('artists').select('*').order('sort_order'),
      supabase.from('releases').select('*').order('sort_order'),
      supabase.from('auditions').select('*').order('sort_order'),
      supabase.from('posts').select('*').order('created_at', { ascending:false }),
      supabase.from('applications').select('*,auditions(title)').order('created_at', { ascending:false }),
    ])
    const sv: Record<string,string> = {}
    s.data?.forEach(r => { sv[r.key] = r.value })
    setSettings(sv)
    setArtists(a.data || [])
    setReleases(r.data || [])
    setAuditions(au.data || [])
    setPosts(p.data || [])
    setApplications(ap.data || [])
  }

  const saveSetting = async (key: string, value: string) => {
    await supabase.from('settings').upsert({ key, value }, { onConflict:'key' })
    setSettings(s => ({ ...s, [key]: value }))
  }

  const saveAllSettings = async () => {
    setSaving(true)
    await Promise.all(Object.entries(settings).map(([k,v]) =>
      supabase.from('settings').upsert({ key:k, value:v }, { onConflict:'key' })
    ))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const upsertArtist = async (a: any) => {
    const { id, created_at, ...payload } = a
    if (id) await supabase.from('artists').update(payload).eq('id', id)
    else {
      const { data } = await supabase.from('artists').insert(payload).select().single()
      if (data) setArtists(prev => prev.map(x => x._new ? data : x))
    }
    loadAll()
  }

  const deleteArtist = async (id: string) => {
    if (!confirm('Xoá nghệ sĩ này?')) return
    await supabase.from('artists').delete().eq('id', id)
    loadAll()
  }

  const upsertRelease = async (r: any) => {
    const { id, created_at, ...payload } = r
    if (id) await supabase.from('releases').update(payload).eq('id', id)
    else {
      const { data } = await supabase.from('releases').insert(payload).select().single()
      if (data) setReleases(prev => prev.map(x => x._new ? data : x))
    }
    loadAll()
  }

  const deleteRelease = async (id: string) => {
    if (!confirm('Xoá release này?')) return
    await supabase.from('releases').delete().eq('id', id)
    loadAll()
  }

  const upsertAudition = async (a: any) => {
    const { id, created_at, ...payload } = a
    if (id) await supabase.from('auditions').update(payload).eq('id', id)
    else await supabase.from('auditions').insert(payload)
    loadAll()
  }

  const deleteAudition = async (id: string) => {
    if (!confirm('Xoá audition này?')) return
    await supabase.from('auditions').delete().eq('id', id)
    loadAll()
  }

  const upsertPost = async (p: any) => {
    const { id, created_at, ...payload } = p
    if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
    if (id) await supabase.from('posts').update(payload).eq('id', id)
    else await supabase.from('posts').insert(payload)
    loadAll()
  }

  const deletePost = async (id: string) => {
    if (!confirm('Xoá bài viết này?')) return
    await supabase.from('posts').delete().eq('id', id)
    loadAll()
  }

  if (!authed) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)' }}>
      <div style={{ background:'#0c0c0c',border:'1px solid #222',padding:48,maxWidth:360,width:'100%',textAlign:'center' }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:28,letterSpacing:'.1em',marginBottom:6 }}>ADMIN <span style={{ color:'var(--accent)' }}>LOGIN</span></div>
        <div style={{ fontSize:10,letterSpacing:'.15em',opacity:.3,textTransform:'uppercase',marginBottom:28 }}>UniFLOWs Label</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&checkPw()}
          placeholder="••••••••" style={{ ...inp,textAlign:'center',letterSpacing:'.2em',marginBottom:12 }} />
        <button onClick={checkPw} style={{ ...btn,width:'100%',fontSize:18,padding:12 }}>VÀO ADMIN</button>
      </div>
    </div>
  )

  const tabs = ['settings','artists','releases','auditions','posts','applications'] as const

  return (
    <div style={{ minHeight:'100vh',background:'#080808',paddingTop:80 }}>
      {/* Tab bar */}
      <div style={{ display:'flex',gap:0,borderBottom:'1px solid #222',padding:'0 48px',position:'sticky',top:0,background:'#080808',zIndex:50 }}>
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)}
            style={{ background:'none',border:'none',borderBottom: tab===t?'2px solid var(--accent)':'2px solid transparent',color: tab===t?'var(--accent)':'var(--fg)',fontFamily:'Space Mono,monospace',fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',padding:'16px 20px',cursor:'pointer',opacity: tab===t?1:.4,transition:'all .2s',marginBottom:-1 }}
          >{t}</button>
        ))}
      </div>

      <div style={{ padding:'40px 48px' }}>

        {/* SETTINGS TAB */}
        {tab==='settings' && (
          <div>
            <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em',marginBottom:32 }}>Thông tin Label</h2>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:800 }}>
              {[
                ['label-city','Thành phố'],['label-desc','Mô tả (VI)'],['label-desc-en','Mô tả (EN)'],
                ['stat1-num','Stat 1 — Số'],['stat1-lbl','Stat 1 — Tên'],['stat2-num','Stat 2 — Số'],['stat2-lbl','Stat 2 — Tên'],
                ['artists-section-title','Tên mục Artists'],['email-contact-label','Label Email 1'],['email-contact','Email 1'],
                ['email-mgmt-label','Label Email 2'],['email-mgmt','Email 2'],
                ['label-fb','Facebook'],['label-ig','Instagram'],['label-yt','YouTube'],['label-tt','TikTok'],
                ['footer-copy','Footer copyright'],['footer-logo','Footer logo'],['footer-city','Footer city'],
                ['ticker-vi','Ticker VI'],['ticker-en','Ticker EN'],
                ['admin-password','Mật khẩu Admin'],
              ].map(([k,l]) => (
                <div key={k} style={{ gridColumn: ['label-desc','label-desc-en','ticker-vi','ticker-en'].includes(k)?'span 2':undefined }}>
                  <label style={lbl}>{l}</label>
                  {['label-desc','label-desc-en','ticker-vi','ticker-en'].includes(k)
                    ? <textarea style={{ ...inp,minHeight:72,resize:'vertical' }} value={settings[k]||''} onChange={e=>setSettings(s=>({...s,[k]:e.target.value}))} />
                    : <input style={inp} value={settings[k]||''} onChange={e=>setSettings(s=>({...s,[k]:e.target.value}))} type={k==='admin-password'?'password':'text'} />
                  }
                </div>
              ))}
            </div>
            <div style={{ marginTop:32,display:'flex',alignItems:'center',gap:16 }}>
              <button onClick={saveAllSettings} style={btn}>{saving?'ĐANG LƯU...':'LƯU THAY ĐỔI'}</button>
              {saved && <span style={{ fontSize:10,color:'var(--accent)',letterSpacing:'.2em' }}>✓ ĐÃ LƯU</span>}
            </div>
          </div>
        )}

        {/* ARTISTS TAB */}
        {tab==='artists' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32 }}>
              <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em' }}>Nghệ sĩ</h2>
              <button onClick={()=>setArtists(a=>[...a,{_new:true,name:'',tag:'',bio:'',members:'',image_url:'',fb_url:'',ig_url:'',yt_url:'',tt_url:'',sp_url:'',sc_url:'',sort_order:a.length}])} style={btn}>+ Thêm nghệ sĩ</button>
            </div>
            {artists.map((a,i) => (
              <ArtistEditor key={a.id||i} artist={a} onSave={upsertArtist} onDelete={()=>deleteArtist(a.id)} artists={artists} />
            ))}
          </div>
        )}

        {/* RELEASES TAB */}
        {tab==='releases' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32 }}>
              <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em' }}>Releases</h2>
              <button onClick={()=>setReleases(r=>[...r,{_new:true,artist_id:artists[0]?.id||'',title:'',cover_url:'',audio_url:'',soundcloud_url:'',spotify_url:'',apple_url:'',youtube_url:'',release_date:'',description:'',play_btn_text:'▶ Play Demo',sort_order:r.length}])} style={btn}>+ Thêm release</button>
            </div>
            {releases.map((r,i) => (
              <ReleaseEditor key={r.id||i} release={r} artists={artists} onSave={upsertRelease} onDelete={()=>deleteRelease(r.id)} />
            ))}
          </div>
        )}

        {/* AUDITIONS TAB */}
        {tab==='auditions' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32 }}>
              <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em' }}>Auditions</h2>
              <button onClick={()=>setAuditions(a=>[...a,{_new:true,title:'',description:'',image_url:'',video_url:'',type:'',location:'',deadline:'',apply_link:'',status:'open',sort_order:a.length}])} style={btn}>+ Thêm audition</button>
            </div>
            {auditions.map((a,i) => (
              <AuditionEditor key={a.id||i} audition={a} onSave={upsertAudition} onDelete={()=>deleteAudition(a.id)} />
            ))}
          </div>
        )}

        {/* POSTS TAB */}
        {tab==='posts' && (
          <div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32 }}>
              <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em' }}>Bài viết / News</h2>
              <button onClick={()=>setPosts(p=>[...p,{_new:true,title:'',slug:'',excerpt:'',content:'',cover_url:'',published:false,published_at:new Date().toISOString()}])} style={btn}>+ Viết bài mới</button>
            </div>
            {posts.map((p,i) => (
              <PostEditor key={p.id||i} post={p} onSave={upsertPost} onDelete={()=>deletePost(p.id)} />
            ))}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {tab==='applications' && (
          <div>
            <h2 style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:32,letterSpacing:'.06em',marginBottom:32 }}>Đơn đăng ký ({applications.length})</h2>
            {applications.length === 0
              ? <p style={{ opacity:.3,fontSize:12 }}>Chưa có đơn đăng ký nào.</p>
              : applications.map(a => (
                <div key={a.id} style={{ border:'1px solid #222',padding:'20px 24px',marginBottom:2,background:'#0d0d0d' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',marginBottom:12 }}>
                    <div>
                      <span style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:20,letterSpacing:'.04em' }}>{a.name}</span>
                      <span style={{ fontSize:10,opacity:.4,marginLeft:12,letterSpacing:'.1em' }}>{a.talent}</span>
                    </div>
                    <div style={{ fontSize:9,opacity:.3,letterSpacing:'.1em' }}>{new Date(a.created_at).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12 }}>
                    {[['Audition',(a as any).auditions?.title],['Email',a.email],['Phone',a.phone],['DOB',a.dob],['City',a.city]].filter(([,v])=>v).map(([k,v])=>(
                      <div key={k}>
                        <div style={{ fontSize:8,letterSpacing:'.2em',opacity:.3,textTransform:'uppercase',marginBottom:3 }}>{k}</div>
                        <div style={{ fontSize:11 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {a.message && <p style={{ marginTop:12,fontSize:11,opacity:.5,lineHeight:1.7,borderTop:'1px solid #1a1a1a',paddingTop:12 }}>{a.message}</p>}
                  {a.video_url && <a href={a.video_url} target="_blank" rel="noopener" style={{ fontSize:9,color:'var(--accent)',letterSpacing:'.15em',textTransform:'uppercase',marginTop:8,display:'block' }}>Video ↗</a>}
                </div>
              ))
            }
          </div>
        )}

      </div>
    </div>
  )
}

// ── Sub-editors ──────────────────────────────────────────────
function ArtistEditor({ artist, onSave, onDelete, artists }: any) {
  const [a, setA] = useState(artist)
  const [open, setOpen] = useState(!!artist._new)
  const set = (k:string) => (e:any) => setA((x:any)=>({...x,[k]:e.target.value}))
  return (
    <div style={{ border:'1px solid #222',marginBottom:2,background:'#0d0d0d' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',cursor:'pointer' }} onClick={()=>setOpen(!open)}>
        <span style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:'.06em' }}>{a.name||'Nghệ sĩ mới'}</span>
        <div style={{ display:'flex',gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onSave(a)}} style={{ ...btn,padding:'6px 16px',fontSize:12 }}>Lưu</button>
          {a.id&&<button onClick={e=>{e.stopPropagation();onDelete()}} style={{ background:'none',border:'1px solid #c00',color:'#f55',fontFamily:'Space Mono,monospace',fontSize:9,padding:'6px 12px',cursor:'pointer' }}>Xoá</button>}
          <span style={{ opacity:.4,fontSize:12 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 20px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          {[['name','Tên'],['tag','Tag'],['members','Thành viên'],['image_url','🖼 Ảnh URL'],['fb_url','Facebook'],['ig_url','Instagram'],['yt_url','YouTube'],['tt_url','TikTok'],['sp_url','Spotify'],['sc_url','SoundCloud']].map(([k,l])=>(
            <div key={k}>
              <label style={lbl}>{l}</label>
              <input style={inp} value={a[k]||''} onChange={set(k)} />
            </div>
          ))}
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Bio</label>
            <textarea style={{ ...inp,minHeight:80,resize:'vertical' }} value={a.bio||''} onChange={set('bio')} />
          </div>
        </div>
      )}
    </div>
  )
}

function ReleaseEditor({ release, artists, onSave, onDelete }: any) {
  const [r, setR] = useState(release)
  const [open, setOpen] = useState(!!release._new)
  const set = (k:string) => (e:any) => setR((x:any)=>({...x,[k]:e.target.value}))
  return (
    <div style={{ border:'1px solid #222',marginBottom:2,background:'#0d0d0d' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',cursor:'pointer' }} onClick={()=>setOpen(!open)}>
        <span style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:'.06em' }}>{r.title||'Release mới'}</span>
        <div style={{ display:'flex',gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onSave(r)}} style={{ ...btn,padding:'6px 16px',fontSize:12 }}>Lưu</button>
          {r.id&&<button onClick={e=>{e.stopPropagation();onDelete()}} style={{ background:'none',border:'1px solid #c00',color:'#f55',fontFamily:'Space Mono,monospace',fontSize:9,padding:'6px 12px',cursor:'pointer' }}>Xoá</button>}
          <span style={{ opacity:.4,fontSize:12 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 20px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Nghệ sĩ</label>
            <select style={inp} value={r.artist_id||''} onChange={set('artist_id')}>
              <option value="">Chọn nghệ sĩ...</option>
              {artists.map((a:any)=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          {[['title','Tên bài/album'],['release_date','Ngày phát hành'],['cover_url','🖼 Ảnh bìa URL'],['audio_url','🎵 Audio URL'],['soundcloud_url','☁️ SoundCloud'],['spotify_url','Spotify'],['apple_url','Apple Music'],['youtube_url','YouTube']].map(([k,l])=>(
            <div key={k}>
              <label style={lbl}>{l}</label>
              <input style={inp} value={r[k]||''} onChange={set(k)} />
            </div>
          ))}
          <div>
            <label style={lbl}>Nút Play</label>
            <select style={inp} value={r.play_btn_text||'▶ Play Demo'} onChange={set('play_btn_text')}>
              {['▶ Play Demo','▶ Play','▶ Nghe thử','▶ Listen'].map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Mô tả</label>
            <textarea style={{ ...inp,minHeight:60,resize:'vertical' }} value={r.description||''} onChange={set('description')} />
          </div>
        </div>
      )}
    </div>
  )
}

function AuditionEditor({ audition, onSave, onDelete }: any) {
  const [a, setA] = useState(audition)
  const [open, setOpen] = useState(!!audition._new)
  const set = (k:string) => (e:any) => setA((x:any)=>({...x,[k]:e.target.value}))
  return (
    <div style={{ border:'1px solid #222',marginBottom:2,background:'#0d0d0d' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',cursor:'pointer' }} onClick={()=>setOpen(!open)}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <span style={{ width:6,height:6,borderRadius:'50%',background:a.status==='open'?'var(--accent)':'#555',display:'block' }} />
          <span style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:'.06em' }}>{a.title||'Audition mới'}</span>
        </div>
        <div style={{ display:'flex',gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onSave(a)}} style={{ ...btn,padding:'6px 16px',fontSize:12 }}>Lưu</button>
          {a.id&&<button onClick={e=>{e.stopPropagation();onDelete()}} style={{ background:'none',border:'1px solid #c00',color:'#f55',fontFamily:'Space Mono,monospace',fontSize:9,padding:'6px 12px',cursor:'pointer' }}>Xoá</button>}
          <span style={{ opacity:.4,fontSize:12 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 20px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          {[['title','Tiêu đề'],['type','Hình thức'],['location','Địa điểm'],['deadline','Hạn đăng ký'],['image_url','🖼 Ảnh URL'],['video_url','🎬 Video URL']].map(([k,l])=>(
            <div key={k}>
              <label style={lbl}>{l}</label>
              <input style={inp} value={a[k]||''} onChange={set(k)} />
            </div>
          ))}
          <div>
            <label style={lbl}>Trạng thái</label>
            <select style={inp} value={a.status||'open'} onChange={set('status')}>
              <option value="open">Đang mở</option>
              <option value="closed">Đã kết thúc</option>
            </select>
          </div>
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Mô tả</label>
            <textarea style={{ ...inp,minHeight:80,resize:'vertical' }} value={a.description||''} onChange={set('description')} />
          </div>
        </div>
      )}
    </div>
  )
}

function PostEditor({ post, onSave, onDelete }: any) {
  const [p, setP] = useState(post)
  const [open, setOpen] = useState(!!post._new)
  const set = (k:string) => (e:any) => setP((x:any)=>({...x,[k]:typeof e.target.checked!=='undefined'?e.target.checked:e.target.value}))
  return (
    <div style={{ border:'1px solid #222',marginBottom:2,background:'#0d0d0d' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',cursor:'pointer' }} onClick={()=>setOpen(!open)}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <span style={{ fontSize:9,letterSpacing:'.1em',padding:'3px 8px',border:'1px solid',borderColor:p.published?'var(--accent)':'#333',color:p.published?'var(--accent)':'#555' }}>{p.published?'PUBLISHED':'DRAFT'}</span>
          <span style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:'.06em' }}>{p.title||'Bài viết mới'}</span>
        </div>
        <div style={{ display:'flex',gap:8 }}>
          <button onClick={e=>{e.stopPropagation();onSave(p)}} style={{ ...btn,padding:'6px 16px',fontSize:12 }}>Lưu</button>
          {p.id&&<button onClick={e=>{e.stopPropagation();onDelete()}} style={{ background:'none',border:'1px solid #c00',color:'#f55',fontFamily:'Space Mono,monospace',fontSize:9,padding:'6px 12px',cursor:'pointer' }}>Xoá</button>}
          <span style={{ opacity:.4,fontSize:12 }}>{open?'▲':'▼'}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding:'0 20px 20px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Tiêu đề</label>
            <input style={inp} value={p.title||''} onChange={set('title')} />
          </div>
          {[['slug','Slug (URL)'],['cover_url','🖼 Ảnh bìa URL'],['published_at','Ngày đăng']].map(([k,l])=>(
            <div key={k}>
              <label style={lbl}>{l}</label>
              <input style={inp} value={p[k]||''} onChange={set(k)} />
            </div>
          ))}
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <input type="checkbox" id="pub" checked={!!p.published} onChange={set('published')} style={{ width:16,height:16,cursor:'pointer' }} />
            <label htmlFor="pub" style={{ ...lbl,margin:0,cursor:'pointer' }}>Công bố</label>
          </div>
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Tóm tắt</label>
            <textarea style={{ ...inp,minHeight:60,resize:'vertical' }} value={p.excerpt||''} onChange={set('excerpt')} />
          </div>
          <div style={{ gridColumn:'span 2' }}>
            <label style={lbl}>Nội dung</label>
            <textarea style={{ ...inp,minHeight:240,resize:'vertical',fontFamily:'Space Mono,monospace' }} value={p.content||''} onChange={set('content')} placeholder="Nội dung bài viết..." />
          </div>
        </div>
      )}
    </div>
  )
}
