# AXON Media Rendering

AXON is renderer-agnostic. Canonical state is the source of truth; media is a projection.

## Supported projection modes

- `video-texture`: temporal source rendered as a scene texture
- `image`: keyframe, reference, or still projection
- `webgl`: GPU graph/field renderer
- `webgpu`: future high-throughput field renderer
- `procedural`: particles, splines, fields, attractors, tensor surfaces
- `graph`: topology and relationships
- `timeline`: temporal/chapter state
- `ui`: conventional panels and controls

## Temporal media

A source video may provide more than individual images. When the source file is available, ingest:

```text
video
→ metadata
→ chapters / scene boundaries
→ keyframes
→ transitions
→ recurring motifs
→ temporal state labels
→ media manifest
```

The resulting manifest is referenced by canonical node/version identifiers. The video is not the system-of-record; it is a source projection.

## Reference versus implementation

External media references are tracked as external references. Original procedural renderers and interface components are maintained independently. Provenance records preserve the relationship without making the external asset a runtime dependency.

## Canonical visual grammar

```text
FIELD → SIGNAL → PATHWAY → CONVERGENCE → APERTURE → CORE → EXECUTION → FEEDBACK
```

This grammar is used consistently across video, graph, particle, timeline, and UI projections.
