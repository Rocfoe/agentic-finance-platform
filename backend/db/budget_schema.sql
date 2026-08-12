CREATE TABLE IF NOT EXISTS budget_models (
  id UUID PRIMARY KEY,
  fiscal_year INT NOT NULL,
  topline NUMERIC(20,2) NOT NULL CHECK (topline >= 0),
  operations NUMERIC(20,2) NOT NULL DEFAULT 0 CHECK (operations >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_constraints (
  id UUID PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES budget_models(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  constraint_type TEXT NOT NULL CHECK (constraint_type IN ('floor','ceiling','mandate','preference','signal')),
  amount NUMERIC(20,2),
  program TEXT,
  source TEXT,
  fiscal_year INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_commitments (
  id UUID PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES budget_models(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budget_commitment_years (
  commitment_id UUID NOT NULL REFERENCES budget_commitments(id) ON DELETE CASCADE,
  fiscal_year INT NOT NULL,
  amount NUMERIC(20,2) NOT NULL CHECK (amount >= 0),
  PRIMARY KEY (commitment_id, fiscal_year)
);

CREATE TABLE IF NOT EXISTS allocation_candidates (
  id UUID PRIMARY KEY,
  budget_id UUID NOT NULL REFERENCES budget_models(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount NUMERIC(20,2) NOT NULL CHECK (amount >= 0),
  programs TEXT[] NOT NULL DEFAULT '{}',
  satisfies TEXT[] NOT NULL DEFAULT '{}',
  risk_score NUMERIC(6,5) CHECK (risk_score >= 0 AND risk_score <= 1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_constraints_budget ON budget_constraints(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_commitments_budget ON budget_commitments(budget_id);
CREATE INDEX IF NOT EXISTS idx_allocation_candidates_budget ON allocation_candidates(budget_id);
