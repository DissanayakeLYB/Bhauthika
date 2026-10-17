import React, { useEffect, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fonts, type } from '@/theme';

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ScoreRingProps {
  correct: number;
  total: number;
  size?: number;
}

export function ScoreRing({ correct, total, size = 140 }: ScoreRingProps) {
  const ratio = total === 0 ? 0 : correct / total;
  const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE);
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const listener = progress.addListener(({ value }) => {
      setDashOffset(CIRCUMFERENCE * (1 - value));
    });
    const animation = Animated.timing(progress, {
      toValue: ratio,
      duration: 900,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    });
    animation.start();
    return () => {
      progress.removeListener(listener);
      animation.stop();
    };
  }, [progress, ratio]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 140 140" style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={70} cy={70} r={RADIUS} fill="transparent" stroke={colors.border} strokeWidth={10} />
        <Circle
          cx={70}
          cy={70}
          r={RADIUS}
          fill="transparent"
          stroke={colors.green}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 32, lineHeight: 38, color: colors.primary }}>
          {correct}
          <Text style={{ fontFamily: fonts.heading, fontSize: 22, color: colors.inkFaint }}>
            {' '}
            / {total}
          </Text>
        </Text>
        <Text style={[type.bodySm, { fontSize: 12 }]}>Questions correct</Text>
      </View>
    </View>
  );
}
