import type { AxonField } from './axonField';

export const axonFieldExample: AxonField = {
  activePhase: 'CONVERGING',
  currentTime: new Date().toISOString(),
  nodes: [
    { id: 'field-a', primitive: 'field', position: { x: 100, y: 260 }, intensity: 0.35 },
    { id: 'signal-a', primitive: 'signal', position: { x: 240, y: 170 }, intensity: 0.65, phase: 'ROUTING' },
    { id: 'signal-b', primitive: 'signal', position: { x: 240, y: 350 }, intensity: 0.55, phase: 'ROUTING' },
    { id: 'conv-a', primitive: 'convergence', position: { x: 430, y: 260 }, intensity: 0.95, phase: 'CONVERGING' },
    { id: 'aperture-a', primitive: 'aperture', position: { x: 590, y: 260 }, intensity: 0.8, phase: 'APERTURE' },
    { id: 'core-a', primitive: 'core', position: { x: 760, y: 260 }, intensity: 0.9, phase: 'COMMITTED', stateVersion: 'demo-v1' },
  ],
  edges: [
    { id: 'e1', from: 'field-a', to: 'signal-a', kind: 'signal', weight: 0.7 },
    { id: 'e2', from: 'field-a', to: 'signal-b', kind: 'signal', weight: 0.6 },
    { id: 'e3', from: 'signal-a', to: 'conv-a', kind: 'convergence', weight: 0.9 },
    { id: 'e4', from: 'signal-b', to: 'conv-a', kind: 'convergence', weight: 0.85 },
    { id: 'e5', from: 'conv-a', to: 'aperture-a', kind: 'transition', weight: 1 },
    { id: 'e6', from: 'aperture-a', to: 'core-a', kind: 'transition', weight: 1 },
  ],
};
