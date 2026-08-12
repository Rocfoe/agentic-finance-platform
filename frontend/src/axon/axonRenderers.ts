export type AxonRenderer =
  | 'video-texture'
  | 'image'
  | 'webgl'
  | 'webgpu'
  | 'procedural'
  | 'graph'
  | 'timeline'
  | 'ui';

export interface RenderProjection {
  renderer: AxonRenderer;
  stateVersion: string;
  sourceRef?: string;
  time?: number;
  options?: Record<string, unknown>;
}

/**
 * A renderer is a projection of canonical state. It must never become a
 * second source of truth. The host application resolves stateVersion before
 * producing a visual projection.
 */
export function createProjection(
  renderer: AxonRenderer,
  stateVersion: string,
  options: Record<string, unknown> = {},
): RenderProjection {
  return { renderer, stateVersion, options };
}

export function createTemporalProjection(
  renderer: AxonRenderer,
  stateVersion: string,
  time: number,
  options: Record<string, unknown> = {},
): RenderProjection {
  return { renderer, stateVersion, time, options };
}
