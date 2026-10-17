import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

interface ProgressBarProps {
  /** Percentage between 0 and 100. */
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  value,
  color = colors.primary,
  trackColor = colors.border,
  height = 6,
  style,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const [animated] = useState(() => new Animated.Value(clamped));

  useEffect(() => {
    Animated.timing(animated, {
      toValue: clamped,
      duration: 450,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [animated, clamped]);

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: trackColor },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <Animated.View
        style={{
          height,
          borderRadius: height / 2,
          backgroundColor: color,
          width: animated.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
});
