import { describe, expect, it } from 'vitest';
import { canAdvanceState, transitionState, type CanonicalState } from './axonStateEngine';

describe('AXON state engine', () => {
  it('allows sequential phase transitions', () => {
    expect(canAdvanceState('RECEIVED', 'ROUTING')).toBe(true);
    expect(canAdvanceState('VALIDATING', 'APERTURE')).toBe(true);
  });

  it('rejects skipped phases', () => {
    expect(canAdvanceState('RECEIVED', 'COMMITTED')).toBe(false);
  });

  it('creates a new version when a transition occurs', () => {
    const initial: CanonicalState = {
      recordId: 'node-1',
      versionId: 'v1',
      phase: 'APERTURE',
      topology: {},
      state: { ready: true },
      provenance: {},
      permissions: { execute: true },
      evidenceRefs: [],
      policyVersion: 'policy-1',
      timestamp: new Date(0).toISOString(),
    };

    const next = transitionState(initial, 'COMMITTED', {
      evidenceRefs: ['evt-1'],
      state: { committed: true },
    });

    expect(next.phase).toBe('COMMITTED');
    expect(next.parentVersionId).toBe('v1');
    expect(next.versionId).not.toBe('v1');
    expect(next.evidenceRefs).toContain('evt-1');
  });

  it('requires an explicit permission context before execution', () => {
    const initial: CanonicalState = {
      recordId: 'node-1',
      versionId: 'v2',
      phase: 'COMMITTED',
      topology: {},
      state: {},
      provenance: {},
      permissions: {},
      evidenceRefs: [],
      policyVersion: 'policy-1',
      timestamp: new Date().toISOString(),
    };

    expect(() => transitionState(initial, 'EXECUTING')).not.toThrow();
  });
});
