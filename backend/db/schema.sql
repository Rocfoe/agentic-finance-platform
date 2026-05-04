CREATE TABLE sources (
  id UUID PRIMARY KEY,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE strategies (
  id UUID PRIMARY KEY,
  source_id UUID,
  title TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE clones (
  id UUID PRIMARY KEY,
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE runs (
  id UUID PRIMARY KEY,
  clone_id UUID,
  status TEXT,
  output TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE run_events (
  id UUID PRIMARY KEY,
  run_id UUID,
  event_type TEXT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
