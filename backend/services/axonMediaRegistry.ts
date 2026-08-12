export type AxonMediaSourceType = 'video' | 'image' | 'sequence' | 'svg' | 'procedural';

export interface AxonMediaChapter {
  id: string;
  semanticRole: string;
  startSeconds?: number;
  endSeconds?: number;
}

export interface AxonMediaManifest {
  mediaId: string;
  sourceType: AxonMediaSourceType;
  canonical: boolean;
  sourceRef?: string;
  rightsStatus?: string;
  chapters: AxonMediaChapter[];
  renderers: Array<'video-texture' | 'image' | 'webgl' | 'webgpu' | 'procedural' | 'graph' | 'timeline' | 'ui'>;
  provenance?: {
    sourceIdentity?: string;
    capturedAt?: string;
    frame?: number;
    transformation?: string;
    contentHash?: string;
  };
}

export class AxonMediaRegistry {
  private readonly manifests = new Map<string, AxonMediaManifest>();

  register(manifest: AxonMediaManifest): void {
    if (!manifest.mediaId.trim()) throw new Error('mediaId is required');
    if (manifest.renderers.length === 0) throw new Error('at least one renderer is required');
    this.manifests.set(manifest.mediaId, manifest);
  }

  get(mediaId: string): AxonMediaManifest | undefined {
    return this.manifests.get(mediaId);
  }

  list(): AxonMediaManifest[] {
    return [...this.manifests.values()];
  }
}
