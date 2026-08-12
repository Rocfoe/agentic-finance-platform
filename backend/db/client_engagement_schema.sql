CREATE TABLE IF NOT EXISTS client_engagements (
  id UUID PRIMARY KEY,
  client_ref TEXT NOT NULL,
  sector TEXT NOT NULL,
  engagement_mode TEXT NOT NULL,
  objective TEXT NOT NULL,
  compliance_boundary TEXT NOT NULL CHECK (compliance_boundary IN ('advisory_supervised','business_analytics')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_engagement_events (
  id UUID PRIMARY KEY,
  engagement_id UUID NOT NULL REFERENCES client_engagements(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('client','agent','professional','system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_outcome_metrics (
  id UUID PRIMARY KEY,
  engagement_id UUID NOT NULL REFERENCES client_engagements(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  baseline_value NUMERIC,
  target_value NUMERIC,
  observed_value NUMERIC,
  unit TEXT,
  observed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_client_engagement_client ON client_engagements(client_ref, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_engagement_events ON client_engagement_events(engagement_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_outcome_metrics ON client_outcome_metrics(engagement_id, metric_name);
