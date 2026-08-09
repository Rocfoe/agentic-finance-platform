# UniVersaTeach / Agentic Finance Platform

UniVersaTeach is the experience surface for a governed agentic learning and execution substrate.

## Core principle

**The harness is the release. The model is a parameter.**

A release binds workflow, policy, memory, model adapter, agents, tools, run state, and provenance while keeping those components independently versionable and attributable.

## Runtime capabilities

- context-container execution
- governed agent routing
- versioned policy runtime
- governed memory classes
- model adapters
- checkpoint / fork / replay / revert semantics
- execution telemetry and provenance
- explicit financial-action boundaries
- agent registry for DrBrainGenii, DrVanBeanie, and TraceWeaver
- production deployment through the connected Vercel surface

## Experience

The root `index.html` is the UniVersaTeach experience surface: substrate overview, agent civilization, workflow, governance boundaries, and stack navigation.

## Run locally

```sh
docker-compose up --build
```

For the static experience, serve the repository root with any static web server.

## Production

The repository is connected to a Vercel production deployment. Infrastructure-bound capabilities remain governed by their configured adapters and credentials.
