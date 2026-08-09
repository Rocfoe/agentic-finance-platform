# UniVersaTeach Harness Release State

## Canonical invariant

**THE HARNESS IS THE RELEASE. THE MODEL IS A PARAMETER.**

A release binds the workflow, policy, memory snapshot, model adapter, agent registry, tool set, and provenance. A run records those bindings so model/policy/memory changes remain independently attributable.

## Run lifecycle

`RUN → CHECKPOINT → FORK → REPLAY → REVERT`

Forking creates a new run identity. Reverting restores a checkpoint without deleting evidence.

## Agent registry

- DrBrainGenii — cognition and synthesis
- DrVanBeanie — governance and control
- TraceWeaver — observability and replay

Agent identity does not itself grant authority. Effective authority remains subject to role, permission, policy, workflow state, and execution gates.

## Production boundary

The repository contract is production-oriented, but external infrastructure must be bound separately: PostgreSQL/pgvector, Redis, identity, secret management, container runtime/registry, DNS/TLS, and observability.

No production-live claim is made by this file alone.
