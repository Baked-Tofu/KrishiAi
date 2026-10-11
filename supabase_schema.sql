-- Run this in Supabase's SQL Editor (Dashboard > SQL Editor > New Query)

-- Knowledge base for RAG (schemes, cooperative laws, PMFBY, etc.)
create table if not exists knowledge_base (
  id bigint generated always as identity primary key,
  title text,
  content text not null,
  category text, -- e.g. 'scheme', 'law', 'pmfby', 'governance'
  language text default 'en',
  created_at timestamp with time zone default now()
);

-- Grievances
create table if not exists grievances (
  id bigint generated always as identity primary key,
  grievance_code text unique not null, -- e.g. GR1023
  phone_number text not null,
  category text,
  description text,
  status text default 'submitted', -- submitted | in_review | resolved
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Deadlines extracted from scanned documents (for reminders)
create table if not exists deadlines (
  id bigint generated always as identity primary key,
  phone_number text not null,
  document_summary text,
  deadline_date date not null,
  reminder_sent boolean default false,
  created_at timestamp with time zone default now()
);

-- Basic full text search index for the RAG lookup used in app/api/chat/route.js
create index if not exists knowledge_base_content_idx
  on knowledge_base using gin (to_tsvector('english', content));

-- OPTIONAL, for later: enable pgvector for real semantic search instead of
-- plain text search. Run this once you're ready to move beyond keyword matching:
-- create extension if not exists vector;
-- alter table knowledge_base add column embedding vector(768);
