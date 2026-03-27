import { supabase } from '@/lib/supabase'

async function getSettings() {
  const { data } = await supabase.from('settings').select('key,value')
  const s: Record<string, string> = {}
  data?.forEach(r => { s[r.key] = r.value })
  return s
}

export default async function Footer() {
  const s = await getSettings()
  return (
    <footer>
      <p>{s['footer-copy'] || '© 2024–2026 UniFLOWs Label'}</p>
      <div style={{ fontFamily:'Bebas Neue,sans-serif',fontSize:13,letterSpacing:'.3em',opacity:.18 }}>
        {s['footer-logo'] || 'UNIFLOWS'}
      </div>
      <p>{s['footer-city'] || 'Ho Chi Minh City'}</p>
    </footer>
  )
}
