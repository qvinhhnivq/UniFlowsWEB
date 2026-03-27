'use client'
import { useState, useRef, useEffect } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  audio_url: string
  cover_url?: string
  soundcloud_url?: string
}

let globalSetTrack: ((t: Track) => void) | null = null
export function playTrack(t: Track) { globalSetTrack?.(t) }

export default function AudioPlayer() {
  const [track, setTrack] = useState<Track | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => { globalSetTrack = setTrack }, [])

  useEffect(() => {
    if (!track) return
    const a = audioRef.current
    if (!a) return
    a.src = track.audio_url
    a.play().then(() => setPlaying(true)).catch(() => {})
  }, [track])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { a.play(); setPlaying(true) }
    else { a.pause(); setPlaying(false) }
  }

  const close = () => {
    audioRef.current?.pause()
    setTrack(null); setPlaying(false); setProgress(0)
  }

  if (!track) return <audio ref={audioRef} style={{ display:'none' }} />

  return (
    <div id="global-player" className="visible" style={{ position:'relative' }}>
      <audio ref={audioRef} style={{ display:'none' }}
        onTimeUpdate={e => { const a = e.currentTarget; setProgress(a.duration ? (a.currentTime/a.duration)*100 : 0) }}
        onEnded={() => setPlaying(false)}
      />
      <div className="gp-cover" style={track.cover_url ? { backgroundImage:`url(${track.cover_url})` } : {}}>
        {!track.cover_url && '♪'}
      </div>
      <div className="gp-info">
        <div className="gp-title">{track.title}</div>
        <div className="gp-artist">{track.artist}</div>
      </div>
      <div className="gp-controls">
        <button className="gp-btn gp-play-btn" onClick={toggle}>{playing ? '⏸' : '▶'}</button>
        <button className="gp-btn" onClick={close} style={{ fontSize:11,opacity:.4 }}>✕</button>
      </div>
      <div className="gp-progress">
        <div className="gp-progress-bar" style={{ width: progress+'%' }} />
      </div>
    </div>
  )
}
