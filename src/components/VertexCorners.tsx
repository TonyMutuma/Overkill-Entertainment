import React from 'react';

type Variant = 'white' | 'blue' | 'slate' | 'muted';
interface Props {
  variant?: Variant;
  size?: number; // px length
  thickness?: number; // px
}

const colorMap: Record<Variant, string> = {
  white: '#ffffff',
  blue: '#3b82f6',
  slate: '#94a3b8',
  muted: 'rgba(255,255,255,0.55)',
};

export const VertexCorners: React.FC<Props> = ({ variant = 'white', size = 20, thickness = 2.5 }) => {
  const c = colorMap[variant];
  const common: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 3,
  };
  // Bold SMOOTH: inset 6px so brackets sit inside the 18px rounded radius, and corners are softly rounded
  const radius = '10px';
  return (
    <>
      <span aria-hidden style={{ ...common, top: 6, left: 6, borderTop: `${thickness}px solid ${c}`, borderLeft: `${thickness}px solid ${c}`, borderTopLeftRadius: radius }} />
      <span aria-hidden style={{ ...common, top: 6, right: 6, borderTop: `${thickness}px solid ${c}`, borderRight: `${thickness}px solid ${c}`, borderTopRightRadius: radius }} />
      <span aria-hidden style={{ ...common, bottom: 6, left: 6, borderBottom: `${thickness}px solid ${c}`, borderLeft: `${thickness}px solid ${c}`, borderBottomLeftRadius: radius }} />
      <span aria-hidden style={{ ...common, bottom: 6, right: 6, borderBottom: `${thickness}px solid ${c}`, borderRight: `${thickness}px solid ${c}`, borderBottomRightRadius: radius }} />
    </>
  );
};

export const VertexCornersInset: React.FC<Props & { offset?: number }> = ({ variant = 'white', size = 14, thickness = 1.8, offset = 6 }) => {
  const c = colorMap[variant];
  const common: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    pointerEvents: 'none',
    zIndex: 3,
    opacity: 0.9,
  };
  return (
    <>
      <span aria-hidden style={{ ...common, top: offset, left: offset, borderTop: `${thickness}px solid ${c}`, borderLeft: `${thickness}px solid ${c}` }} />
      <span aria-hidden style={{ ...common, top: offset, right: offset, borderTop: `${thickness}px solid ${c}`, borderRight: `${thickness}px solid ${c}` }} />
      <span aria-hidden style={{ ...common, bottom: offset, left: offset, borderBottom: `${thickness}px solid ${c}`, borderLeft: `${thickness}px solid ${c}` }} />
      <span aria-hidden style={{ ...common, bottom: offset, right: offset, borderBottom: `${thickness}px solid ${c}`, borderRight: `${thickness}px solid ${c}` }} />
    </>
  );
};
