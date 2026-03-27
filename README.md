# UniFLOWs Label — Next.js Website

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.local.example` to `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://htlxmfbzevdhyjyzenqp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Supabase setup
Run `supabase-setup.sql` in your Supabase SQL Editor to create the `posts` and `applications` tables.

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add environment variables in Vercel dashboard
4. Deploy!

## Connect your domain (Spaceship)

After deploying to Vercel:
1. In Vercel → Project Settings → Domains → Add `uniflowslabel.com`
2. In Spaceship DNS settings, add:
   - Type: `A` | Name: `@` | Value: `76.76.21.21`
   - Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`
3. Wait 24-48h for DNS propagation

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/artists` | All artists |
| `/artists/[id]` | Artist detail + releases |
| `/releases` | All releases grouped by artist |
| `/audition` | Auditions + built-in application form |
| `/news` | News/blog list |
| `/news/[slug]` | Post detail |
| `/admin` | CMS dashboard (password protected) |

## Admin

Go to `/admin` → enter your admin password (default: `uniflows2024`)

From the admin dashboard you can manage:
- **Settings** — label info, stats, ticker, emails, social links, footer
- **Artists** — add/edit/delete artists
- **Releases** — add/edit/delete releases, assign to artists
- **Auditions** — add/edit/delete audition listings
- **Posts** — write news/blog posts with publish toggle
- **Applications** — view all audition submissions
