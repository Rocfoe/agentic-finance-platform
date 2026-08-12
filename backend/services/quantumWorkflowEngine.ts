export type WorkflowPhase =
  | "ingress"
  | "sovereignty"
  | "currency"
  | "cost"
  | "database";

export interface RegionalWorkflowInput {
  regionCode: string;
  ingress: {
    latencyMs: number;
    ipHash?: string;
    geoCode?: string;
    payloadBytes: number;
  };
  sovereignty: {
    piiScore: number;
    ipSensitivity: number;
    vaultToken?: string;
    regionPin: string;
  };
  currency: {
    spotPriceLocal: number;
    fxRateToBase: number;
    tariffRate: number;
    commodityVolatility: number;
  };
  cost: {
    floorCostUsd: number;
    finishedCostUsd: number;
    geometryFactor: number;
  };
  database: {
    commitLsn?: string;
    syncLatencyMs: number;
    replicaState: "healthy" | "lagging" | "partitioned";
    entropyHash?: string;
  };
}

export interface WorkflowVector {
  phase: WorkflowPhase;
  vector: number[];
  gradient: Record<string, number>;
}

export interface QuantumCircuitStep {
  qubit: number;
  gate: "Rx" | "Ry" | "Rz" | "CNOT";
  parameter?: number;
  control?: number;
  target?: number;
  phase: WorkflowPhase;
}

export interface EncodedRegionalState {
  regionCode: string;
  vectors: WorkflowVector[];
  angles: number[];
  circuit: QuantumCircuitStep[];
  globalStateLabel: "|Ψ_global⟩";
  loss: {
    ingressLatency: number;
    sovereigntyRisk: number;
    currencyVariance: number;
    costInefficiency: number;
    databaseReplicationLag: number;
    total: number;
  };
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const safe = (value: number) => (Number.isFinite(value) ? value : 0);

/**
 * Encodes the supplied classical workflow state into a deterministic PQC
 * specification. This does not execute a quantum circuit or claim quantum
 * advantage. It produces normalized vectors, rotation angles, entanglement
 * topology, and an auditable loss surface for a later quantum backend.
 */
export function encodeRegionalWorkflow(input: RegionalWorkflowInput): EncodedRegionalState {
  const tariff = clamp01(safe(input.currency.tariffRate));
  const pii = clamp01(safe(input.sovereignty.piiScore));
  const sensitivity = clamp01(safe(input.sovereignty.ipSensitivity));
  const replicaPenalty = input.database.replicaState === "healthy"
    ? 0
    : input.database.replicaState === "lagging"
      ? 0.5
      : 1;

  const vectors: WorkflowVector[] = [
    {
      phase: "ingress",
      vector: [safe(input.ingress.latencyMs), safe(input.ingress.payloadBytes)],
      gradient: { routeLatency: 1 },
    },
    {
      phase: "sovereignty",
      vector: [pii, sensitivity, safe(input.sovereignty.regionPin.length)],
      gradient: { tokenizationRisk: pii * sensitivity },
    },
    {
      phase: "currency",
      vector: [safe(input.currency.spotPriceLocal), safe(input.currency.fxRateToBase), tariff, safe(input.currency.commodityVolatility)],
      gradient: { fxVariance: safe(input.currency.spotPriceLocal) * safe(input.currency.commodityVolatility) },
    },
    {
      phase: "cost",
      vector: [safe(input.cost.floorCostUsd), safe(input.cost.finishedCostUsd), safe(input.cost.geometryFactor)],
      gradient: {
        costInefficiency: input.cost.floorCostUsd > 0
          ? safe(input.cost.finishedCostUsd) / input.cost.floorCostUsd
          : 0,
      },
    },
    {
      phase: "database",
      vector: [safe(input.database.syncLatencyMs), replicaPenalty],
      gradient: { replicationLag: safe(input.database.syncLatencyMs) * (1 + replicaPenalty) },
    },
  ];

  const angles = [
    ...vectors[0].vector,
    ...vectors[1].vector,
    ...vectors[2].vector,
    ...vectors[3].vector,
    ...vectors[4].vector,
  ].map((value) => 2 * Math.PI * clamp01(Math.abs(value) / (1 + Math.abs(value))));

  const circuit: QuantumCircuitStep[] = [
    { qubit: 0, gate: "Rx", parameter: angles[0], phase: "ingress" },
    { qubit: 0, gate: "Ry", parameter: angles[2], phase: "sovereignty" },
    { qubit: 0, gate: "Rz", parameter: angles[4], phase: "currency" },
    { qubit: 1, gate: "Rx", parameter: angles[7], phase: "cost" },
    { qubit: 1, gate: "Ry", parameter: angles[8], phase: "database" },
    { qubit: 1, gate: "Rz", parameter: angles[9], phase: "currency" },
    { qubit: 0, gate: "CNOT", control: 0, target: 1, phase: "database" },
  ];

  const ingressLatency = safe(input.ingress.latencyMs);
  const sovereigntyRisk = pii * sensitivity;
  const currencyVariance = Math.abs(safe(input.currency.fxRateToBase) - 1) + tariff + safe(input.currency.commodityVolatility);
  const costInefficiency = input.cost.floorCostUsd > 0
    ? Math.max(0, safe(input.cost.finishedCostUsd) / input.cost.floorCostUsd - 1)
    : 0;
  const databaseReplicationLag = safe(input.database.syncLatencyMs) * (1 + replicaPenalty);
  const total = ingressLatency + sovereigntyRisk + currencyVariance + costInefficiency + databaseReplicationLag;

  return {
    regionCode: input.regionCode,
    vectors,
    angles,
    circuit,
    globalStateLabel: "|Ψ_global⟩",
    loss: {
      ingressLatency,
      sovereigntyRisk,
      currencyVariance,
      costInefficiency,
      databaseReplicationLag,
      total,
    },
  };
}

export function encodeGlobalWorkflow(inputs: RegionalWorkflowInput[]) {
  const regionalStates = inputs.map(encodeRegionalWorkflow);
  const globalLoss = regionalStates.reduce((sum, state) => sum + state.loss.total, 0);
  return {
    regionalStates,
    globalStateLabel: "|Ψ_global⟩",
    entanglementEdges: regionalStates.slice(1).map((state, index) => ({
      controlRegion: regionalStates[index].regionCode,
      targetRegion: state.regionCode,
      gate: "CNOT",
    })),
    hCostExpectation: globalLoss,
    optimizationStatus: "classical_surrogate_ready",
  };
}
