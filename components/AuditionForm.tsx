'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const inputStyle: React.CSSProperties = {
  background: '#111',
  border: '1px solid var(--muted)',
  color: 'var(--fg)',
  fontFamily: 'Space Mono, monospace',
  fontSize: 12,
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  transition: 'border-color .2s',
}

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  opacity: .35,
  display: 'block',
  marginBottom: 8,
}

export default function AuditionForm({ auditionId, auditionTitle }: { auditionId: string; auditionTitle: string }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', dob:'', city:'', talent:'', message:'', video_url:'' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) { setError('Vui lòng điền họ tên và email.'); return }
    setStatus('loading'); setError('')
    const { error: err } = await supabase.from('applications').insert({
      audition_id: auditionId,
      ...form,
    })
    if (err) { setStatus('error'); setError(err.message) }
    else { setStatus('success') }
  }

  if (status === 'success') return (
    <div style={{ textAlign:'center', padding:'40px 0' }}>
      <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:36,color:'var(--accent)',letterSpacing:'.06em',marginBottom:12 }}>
        ĐÃ NHẬN ĐƠN ĐĂNG KÝ
      </div>
      <p style={{ fontSize:11,opacity:.5,lineHeight:1.8 }}>
        Cảm ơn bạn đã đăng ký tham gia <strong>{auditionTitle}</strong>.<br/>
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      </p>
    </div>
  )

  return (
    <form onSubmit={submit}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div>
          <label style={labelStyle}>Họ và tên *</label>
          <input style={inputStyle} value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A"
            onFocus={e => { e.target.style.borderColor='var(--accent)' }}
            onBlur={e => { e.target.style.borderColor='var(--muted)' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Email *</label>
          <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="you@email.com"
            onFocus={e => { e.target.style.borderColor='var(--accent)' }}
            onBlur={e => { e.target.style.borderColor='var(--muted)' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Số điện thoại</label>
          <input style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="09x xxx xxxx"
            onFocus={e => { e.target.style.borderColor='var(--accent)' }}
            onBlur={e => { e.target.style.borderColor='var(--muted)' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Ngày sinh</label>
          <input style={inputStyle} value={form.dob} onChange={set('dob')} placeholder="DD/MM/YYYY"
            onFocus={e => { e.target.style.borderColor='var(--accent)' }}
            onBlur={e => { e.target.style.borderColor='var(--muted)' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Thành phố</label>
          <input style={inputStyle} value={form.city} onChange={set('city')} placeholder="TP. Hồ Chí Minh"
            onFocus={e => { e.target.style.borderColor='var(--accent)' }}
            onBlur={e => { e.target.style.borderColor='var(--muted)' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Tài năng</label>
          <select style={inputStyle} value={form.talent} onChange={set('talent')}
            onFocus={e => { e.target.style.borderColor='var(--accent)' }}
            onBlur={e => { e.target.style.borderColor='var(--muted)' }}
          >
            <option value="">Chọn tài năng...</option>
            <option value="Vocal">Vocal</option>
            <option value="Dance">Dance</option>
            <option value="Rap">Rap</option>
            <option value="Vocal + Dance">Vocal + Dance</option>
            <option value="All-rounder">All-rounder</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={labelStyle}>Link video giới thiệu (YouTube, TikTok...)</label>
        <input style={inputStyle} value={form.video_url} onChange={set('video_url')} placeholder="https://youtube.com/..."
          onFocus={e => { e.target.style.borderColor='var(--accent)' }}
          onBlur={e => { e.target.style.borderColor='var(--muted)' }}
        />
      </div>

      <div style={{ marginBottom:24 }}>
        <label style={labelStyle}>Lời nhắn (tùy chọn)</label>
        <textarea style={{ ...inputStyle, minHeight:100, resize:'vertical' }} value={form.message} onChange={set('message')} placeholder="Giới thiệu thêm về bản thân..."
          onFocus={e => { e.target.style.borderColor='var(--accent)' }}
          onBlur={e => { e.target.style.borderColor='var(--muted)' }}
        />
      </div>

      {error && <p style={{ fontSize:10,color:'#f55',marginBottom:16,letterSpacing:'.1em' }}>{error}</p>}

      <button type="submit" disabled={status==='loading'}
        style={{ background:'var(--accent)',color:'var(--bg)',border:'none',fontFamily:'Bebas Neue,sans-serif',fontSize:18,letterSpacing:'.15em',padding:'14px 48px',cursor:'none',transition:'opacity .2s',opacity: status==='loading' ? .6 : 1 }}
      >
        {status==='loading' ? 'ĐANG GỬI...' : 'GỬI ĐƠN ĐĂNG KÝ →'}
      </button>
    </form>
  )
}
