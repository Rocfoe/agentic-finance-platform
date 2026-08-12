import { describe, expect, it } from 'vitest';
import { AxonMediaRegistry } from './axonMediaRegistry';

describe('AXON media registry', () => {
  it('registers and retrieves renderer-agnostic media', () => {
    const registry = new AxonMediaRegistry();
    registry.register({
      mediaId: 'axon-demo',
      sourceType: 'video',
      canonical: false,
      renderers: ['video-texture', 'timeline', 'webgl'],
      chapters: [{ id: 'signal', semanticRole: 'signal_pathway' }],
    });

    expect(registry.get('axon-demo')?.renderers).toContain('webgl');
    expect(registry.list()).toHaveLength(1);
  });

  it('rejects missing media identity', () => {
    const registry = new AxonMediaRegistry();
    expect(() => registry.register({
      mediaId: ' ',
      sourceType: 'image',
      canonical: false,
      renderers: ['image'],
      chapters: [],
    })).toThrow('mediaId is required');
  });
});
