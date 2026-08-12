export type AxonPhase =
  | 'RECEIVED'
  | 'ROUTING'
  | 'CONVERGING'
  | 'VALIDATING'
  | 'APERTURE'
  | 'COMMITTED'
  | 'EXECUTING'
  | 'EVIDENCE'
  | 'FEEDBACK';

export interface CanonicalState {
  recordId: string;
  versionId: string;
  parentVersionId?: string;
  phase: AxonPhase;
  topology: Record<string, unknown>;
  state: Record<string, unknown>;
  provenance: Record<string, unknown>;
  permissions: Record<string, unknown>;
  evidenceRefs: string[];
  policyVersion: string;
  timestamp: string;
}

const PHASES: AxonPhase[] = [
  'RECEIVED',
  'ROUTING',
  'CONVERGING',
  'VALIDATING',
  'APERTURE',
  'COMMITTED',
  'EXECUTING',
  'EVIDENCE',
  'FEEDBACK',
];

function isAdjacent(from: AxonPhase, to: AxonPhase): boolean {
  const fromIndex = PHASES.indexOf(from);
  const toIndex = PHASES.indexOf(to);
  return toIndex === fromIndex + 1;
}

export function canAdvanceState(from: AxonPhase, to: AxonPhase): boolean {
  return isAdjacent(from, to);
}

export function transitionState(
  current: CanonicalState,
  nextPhase: AxonPhase,
  patch: Partial<Pick<CanonicalState, 'topology' | 'state' | 'permissions' | 'evidenceRefs'>> = {},
): CanonicalState {
  if (!canAdvanceState(current.phase, nextPhase)) {
    throw new Error(`Invalid AXON transition: ${current.phase} -> ${nextPhase}`);
  }

  if (nextPhase === 'COMMITTED' && current.phase !== 'APERTURE') {
    throw new Error('Canonical state may only commit after the aperture phase');
  }

  if (nextPhase === 'EXECUTING' && !current.permissions) {
    throw new Error('Execution requires an explicit permission context');
  }

  return {
    ...current,
    versionId: cryptoSafeId(),
    parentVersionId: current.versionId,
    phase: nextPhase,
    topology: { ...current.topology, ...(patch.topology ?? {}) },
    state: { ...current.state, ...(patch.state ?? {}) },
    permissions: { ...current.permissions, ...(patch.permissions ?? {}) },
    evidenceRefs: [...new Set([...(current.evidenceRefs ?? []), ...(patch.evidenceRefs ?? [])])],
    timestamp: new Date().toISOString(),
  };
}

function cryptoSafeId(): string {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `axon_${seed}`;
}
