# Cooperative Sahayak — SIH26088

Multilingual voice-first assistant for cooperative governance, schemes, PMFBY,
and grievance redressal.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up environment variables**
   ```
   cp .env.local.example .env.local
   ```
   Fill in your keys (Gemini, Supabase, Bhashini) — see comments in the file
   for where to get each one.

3. **Set up Supabase database**
   - Go to your Supabase project → SQL Editor → New Query
   - Paste the contents of `supabase_schema.sql` and run it

4. **Run locally**
   ```
   npm run dev
   ```
   Open http://localhost:3000

## Current status

- ✅ Chat flow: mic → browser STT (temporary) → Gemini (+ RAG lookup from
  Supabase) → browser TTS (temporary)
- ⏳ Bhashini STT/TTS: stubbed in `lib/bhashiniClient.js` — wire up once your
  bhashini.gov.in developer account is approved
- ⏳ Knowledge base: table exists but is empty — add real scheme/law/PMFBY
  content to `knowledge_base` table (via Supabase dashboard or a seed script)
- ❌ Not yet built: document/OCR explainer, pesticide decoder, grievance UI,
  mandi price feature, deadline reminders, SMS fallback, kiosk mode

## Deploy

Push to GitHub, then import the repo in Vercel. Add the same environment
variables from `.env.local` into Vercel's project settings (Settings →
Environment Variables) before deploying.

## Folder structure

```
app/
  page.js              — main voice assistant UI
  api/chat/route.js    — Gemini + RAG endpoint
  api/tts/route.js     — text-to-speech endpoint (Bhashini, falls back to null)
lib/
  supabaseClient.js    — Supabase connection
  geminiClient.js       — Gemini connection + prompt logic
  bhashiniClient.js     — Bhashini STT/TTS/translation (stubbed until approved)
supabase_schema.sql    — run this in Supabase to create your tables
```
