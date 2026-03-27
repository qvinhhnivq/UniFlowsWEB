import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface Artist {
  id: string
  name: string
  tag: string
  bio: string
  members: string
  image_url: string
  fb_url: string
  ig_url: string
  yt_url: string
  tt_url: string
  sp_url: string
  sc_url: string
  sort_order: number
}

export interface Release {
  id: string
  artist_id: string
  title: string
  cover_url: string
  audio_url: string
  soundcloud_url: string
  spotify_url: string
  apple_url: string
  youtube_url: string
  release_date: string
  description: string
  play_btn_text: string
  sort_order: number
}

export interface Audition {
  id: string
  title: string
  description: string
  image_url: string
  video_url: string
  type: string
  location: string
  deadline: string
  apply_link: string
  status: 'open' | 'closed'
  sort_order: number
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_url: string
  published: boolean
  published_at: string
  created_at: string
}

export interface Application {
  id: string
  audition_id: string
  name: string
  email: string
  phone: string
  dob: string
  city: string
  talent: string
  message: string
  video_url: string
  created_at: string
}

export interface Contact {
  id: string
  label: string
  email: string
  sort_order: number
}

export interface Setting {
  key: string
  value: string
}
