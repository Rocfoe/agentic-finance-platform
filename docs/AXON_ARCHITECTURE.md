# AXON Field Architecture

## Purpose
AXON is an architectural and visual grammar for the UniVersaTeach / WOLVYN runtime. It defines how distributed signals become routed, converged, validated, committed, executed, and returned as evidence. It is a reference grammar, not a dependency or claim of ownership over the external visual source.

## Canonical flow

```text
FIELD → SIGNAL → PATHWAY → CONVERGENCE → APERTURE → CORE → EXECUTION → FEEDBACK
```

## Runtime primitives

| Primitive | Runtime meaning |
|---|---|
| Field | Distributed observations, sensors, agents, clients, workers, telemetry |
| Signal | Typed observation or event |
| Pathway | Persistent routing through workflows and agents |
| Convergence | Correlation, aggregation, conflict resolution |
| Aperture | Policy, authorization, validation, provenance boundary |
| Core | Canonical state and protected invariants |
| Execution | Authorized bounded state transition |
| Feedback | Outcome, evidence, telemetry, learning |

## Canonical invariant

No projection changes canonical state directly. Every state transition crosses an auditable aperture.

## State object

```ts
interface CanonicalState {
  recordId: string;
  versionId: string;
  parentVersionId?: string;
  phase: string;
  topology: Record<string, unknown>;
  state: Record<string, unknown>;
  provenance: Record<string, unknown>;
  permissions: Record<string, unknown>;
  evidenceRefs: string[];
  policyVersion: string;
  timestamp: string;
}
```

## Temporal model

Every meaningful transition has both topology and time coordinates. Chapters/phases are runtime state, not merely presentation.

```text
RECEIVED → ROUTING → CONVERGING → VALIDATING → APERTURE → COMMITTED → EXECUTING → EVIDENCE → FEEDBACK
```

## Rendering contract

The same canonical state may be projected through:

- video textures
- still imagery
- WebGL/WebGPU procedural fields
- graph topology
- tensor/vector fields
- timeline/chapter views
- conventional UI panels

Renderers are projections. The schema/state graph remains authoritative.

## Workforce integration

```text
Sensor → Observation → Normalization → Agent/Workforce → Proposal → Policy Gate → Execution → Evidence → Canonical State
```

Clients, agents, sensors, workforce actors, and professional-service workflows participate as typed nodes with capability and authorization boundaries.

## Media provenance

External visual references are recorded separately from original implementations. Derived captures retain source identity, timestamp/frame where available, transformation metadata, and provenance. Original procedural renderers remain the canonical implementation surface.

## Safety and financial boundary

Optimization may generate analysis, simulations, recommendations, or bounded workflow actions. Regulated activity, movement of funds, binding commitments, and other restricted actions remain subject to explicit authorization and applicable controls.
