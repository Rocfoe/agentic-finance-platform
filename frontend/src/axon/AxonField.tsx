import React, { useMemo } from 'react';
import type { AxonField as AxonFieldModel, AxonPrimitive } from './axonField';

interface Props {
  field: AxonFieldModel;
  width?: number;
  height?: number;
  onNodeSelect?: (nodeId: string) => void;
}

const primitiveRadius: Record<AxonPrimitive, number> = {
  field: 4,
  signal: 5,
  pathway: 6,
  convergence: 8,
  aperture: 11,
  core: 15,
  execution: 8,
  feedback: 6,
};

export function AxonField({ field, width = 960, height = 520, onNodeSelect }: Props) {
  const nodeById = useMemo(
    () => new Map(field.nodes.map((node) => [node.id, node])),
    [field.nodes],
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      aria-label="AXON canonical state field"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      <defs>
        <radialGradient id="axonCore">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#54d8ff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#54d8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="axonPath" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#54d8ff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ff9d42" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <rect width={width} height={height} fill="#05070b" rx="24" />

      {field.edges.map((edge) => {
        const from = nodeById.get(edge.from);
        const to = nodeById.get(edge.to);
        if (!from || !to) return null;
        return (
          <path
            key={edge.id}
            d={`M ${from.position.x} ${from.position.y} C ${(from.position.x + to.position.x) / 2} ${from.position.y}, ${(from.position.x + to.position.x) / 2} ${to.position.y}, ${to.position.x} ${to.position.y}`}
            fill="none"
            stroke="url(#axonPath)"
            strokeWidth={Math.max(1, (edge.weight ?? 0.6) * 3)}
            opacity={0.75}
          />
        );
      })}

      {field.nodes.map((node) => {
        const r = primitiveRadius[node.primitive] * (0.7 + (node.intensity ?? 0.5));
        const isCore = node.primitive === 'core';
        return (
          <g
            key={node.id}
            transform={`translate(${node.position.x} ${node.position.y})`}
            onClick={() => onNodeSelect?.(node.id)}
            style={{ cursor: onNodeSelect ? 'pointer' : 'default' }}
          >
            {isCore && <circle r={r * 2.6} fill="url(#axonCore)" />}
            <circle
              r={r}
              fill={isCore ? '#07090d' : '#102033'}
              stroke={isCore ? '#ffffff' : '#54d8ff'}
              strokeWidth={isCore ? 2 : 1.5}
              opacity={0.95}
            />
            <title>{`${node.id} · ${node.primitive}${node.phase ? ` · ${node.phase}` : ''}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
