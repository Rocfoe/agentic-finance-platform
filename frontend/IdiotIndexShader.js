import * as THREE from 'three';

export function createIdiotIndexMaterial(idiotIndexValue = 1.0, threshold = 50.0) {
  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float u_idiotIndex;
    uniform float u_threshold;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      float normalizedRatio = clamp(u_idiotIndex / max(u_threshold, 0.000001), 0.0, 1.0);
      vec3 lowColor = vec3(0.0, 0.8, 1.0);
      vec3 highColor = vec3(1.0, 0.05, 0.0);
      vec3 baseColor = mix(lowColor, highColor, normalizedRatio);
      vec3 viewDir = normalize(-vPosition);
      float rim = 1.0 - max(0.0, dot(viewDir, normalize(vNormal)));
      float emission = pow(rim, 2.0) * normalizedRatio * 1.5;
      gl_FragColor = vec4(baseColor + vec3(emission, emission * 0.2, 0.0), 0.9);
    }
  `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_idiotIndex: { value: idiotIndexValue },
      u_threshold: { value: threshold },
    },
    transparent: true,
    side: THREE.DoubleSide,
  });
}
