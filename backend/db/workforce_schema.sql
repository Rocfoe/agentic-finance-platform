CREATE TABLE IF NOT EXISTS workforce_actors (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  autonomy_level INT NOT NULL CHECK (autonomy_level BETWEEN 0 AND 7),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workforce_tasks (
  id UUID PRIMARY KEY,
  objective TEXT NOT NULL,
  required_capabilities TEXT[] NOT NULL DEFAULT '{}',
  autonomy_required INT NOT NULL CHECK (autonomy_required BETWEEN 0 AND 7),
  status TEXT NOT NULL DEFAULT 'queued',
  actor_id UUID REFERENCES workforce_actors(id),
  inputs JSONB NOT NULL DEFAULT '[]',
  outputs JSONB NOT NULL DEFAULT '[]',
  review_required BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sensor_observations (
  id UUID PRIMARY KEY,
  sensor_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  value JSONB NOT NULL,
  unit TEXT,
  region TEXT,
  confidence NUMERIC(6,5) NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  provenance TEXT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workforce_task_events (
  id UUID PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES workforce_tasks(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES workforce_actors(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workforce_tasks_status ON workforce_tasks(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_observations_sensor_time ON sensor_observations(sensor_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workforce_task_events_task_time ON workforce_task_events(task_id, created_at DESC);
