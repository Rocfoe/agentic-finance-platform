CREATE TABLE IF NOT EXISTS workflow_regions (
    region_code VARCHAR(32) PRIMARY KEY,
    ingress_latency_ms NUMERIC(18, 6) NOT NULL DEFAULT 0,
    payload_bytes BIGINT NOT NULL DEFAULT 0,
    pii_score NUMERIC(8, 6) NOT NULL DEFAULT 0,
    ip_sensitivity NUMERIC(8, 6) NOT NULL DEFAULT 0,
    region_pin VARCHAR(32) NOT NULL,
    spot_price_local NUMERIC(18, 6) NOT NULL DEFAULT 0,
    fx_rate_to_base NUMERIC(18, 6) NOT NULL DEFAULT 1,
    tariff_rate NUMERIC(8, 6) NOT NULL DEFAULT 0,
    commodity_volatility NUMERIC(18, 6) NOT NULL DEFAULT 0,
    floor_cost_usd NUMERIC(18, 6) NOT NULL DEFAULT 0,
    finished_cost_usd NUMERIC(18, 6) NOT NULL DEFAULT 0,
    geometry_factor NUMERIC(18, 6) NOT NULL DEFAULT 0,
    commit_lsn VARCHAR(255),
    sync_latency_ms NUMERIC(18, 6) NOT NULL DEFAULT 0,
    replica_state VARCHAR(16) NOT NULL DEFAULT 'healthy',
    entropy_hash VARCHAR(255),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (replica_state IN ('healthy', 'lagging', 'partitioned'))
);

CREATE TABLE IF NOT EXISTS workflow_vector_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(32) NOT NULL REFERENCES workflow_regions(region_code),
    phase VARCHAR(32) NOT NULL,
    vector JSONB NOT NULL,
    gradient JSONB NOT NULL,
    loss JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quantum_encoding_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(32),
    state_label VARCHAR(64) NOT NULL DEFAULT '|Ψ_global⟩',
    rotation_angles JSONB NOT NULL,
    circuit_spec JSONB NOT NULL,
    h_cost_expectation NUMERIC(24, 8),
    execution_backend VARCHAR(64) NOT NULL DEFAULT 'classical_surrogate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workflow_vector_region_phase
    ON workflow_vector_events (region_code, phase, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quantum_encoding_region_time
    ON quantum_encoding_events (region_code, created_at DESC);
