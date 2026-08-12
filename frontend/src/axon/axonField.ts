export type AxonPrimitive =
  | 'field'
  | 'signal'
  | 'pathway'
  | 'convergence'
  | 'aperture'
  | 'core'
  | 'execution'
  | 'feedback';

export interface AxonNode {
  id: string;
  primitive: AxonPrimitive;
  position: { x: number; y: number; z?: number };
  intensity?: number;
  phase?: string;
  stateVersion?: string;
  metadata?: Record<string, unknown>;
}

export interface AxonEdge {
  id: string;
  from: string;
  to: string;
  kind: 'signal' | 'route' | 'convergence' | 'transition' | 'feedback';
  weight?: number;
}

export interface AxonField {
  nodes: AxonNode[];
  edges: AxonEdge[];
  currentTime?: string;
  activePhase?: string;
}

export const AXON_PHASES = [
  'RECEIVED',
  'ROUTING',
  'CONVERGING',
  'VALIDATING',
  'APERTURE',
  'COMMITTED',
  'EXECUTING',
  'EVIDENCE',
  'FEEDBACK',
] as const;

export type AxonPhase = (typeof AXON_PHASES)[number];

export function transitionIsAllowed(from: AxonPhase, to: AxonPhase): boolean {
  const index = AXON_PHASES.indexOf(from);
  const next = AXON_PHASES.indexOf(to);
  if (index < 0 || next < 0) return false;
  return next === index + 1 || (from === 'EVIDENCE' && to === 'FEEDBACK');
}
