# AXON Build

Implemented on `axon-architecture-build`:

- Canonical AXON state contract and transition engine
- Sequential phase enforcement
- Explicit execute authorization gate
- Versioned canonical state transitions
- Renderer-agnostic media projection types
- AXON media manifest schema
- Media registry and tests
- React SVG field projection
- Example field topology
- Temporal/chapter-oriented media documentation

Canonical phases:

`RECEIVED → ROUTING → CONVERGING → VALIDATING → APERTURE → COMMITTED → EXECUTING → EVIDENCE → FEEDBACK`

Visual primitives:

`FIELD → SIGNAL → PATHWAY → CONVERGENCE → APERTURE → CORE → EXECUTION → FEEDBACK`

The runtime state is authoritative. Visual renderers are projections and must not become independent sources of truth.
