import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme';

interface LogoMarkProps {
  size?: number;
  /** Draw only the orbit artwork, without the rounded indigo tile. */
  bare?: boolean;
}

/**
 * The Bhauthika mark: an orbital ellipse with an amber sine wave and nucleus.
 * Vector recreation of bhauthika_physics_logo/screen.png.
 */
export function LogoMark({ size = 72, bare = false }: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80" accessibilityLabel="Bhauthika logo">
      {!bare && <Rect width={80} height={80} rx={20} fill={colors.indigoMid} />}
      <G transform="rotate(-30 40 40)">
        <Ellipse
          cx={40}
          cy={40}
          rx={24}
          ry={10}
          stroke={colors.surface}
          strokeWidth={2.5}
          opacity={0.95}
        />
      </G>
      <Path
        d="M22 43 C28 32,34 32,40 40 C46 48,52 48,58 37"
        stroke={colors.amber}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx={40} cy={40} r={4} fill={colors.surface} />
      <Circle cx={58} cy={30} r={2.5} fill={colors.amber} />
    </Svg>
  );
}
