import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, fonts, radius, type } from '@/theme';

export type ChipTone = 'neutral' | 'indigo' | 'softIndigo' | 'green' | 'amber' | 'red' | 'white';

const tones: Record<ChipTone, { background: string; text: string; border?: string }> = {
  neutral: { background: colors.surfaceContainer, text: colors.inkMuted },
  indigo: { background: colors.indigoSoft, text: colors.primary },
  softIndigo: { background: '#DFE2FF', text: colors.primary },
  green: { background: colors.greenSoft, text: colors.green },
  amber: { background: colors.amberSoft, text: colors.amberDeep, border: 'rgba(245,165,36,0.25)' },
  red: { background: colors.redSoft, text: colors.red },
  white: { background: colors.surface, text: colors.primary },
};

interface ChipProps {
  label: string;
  tone?: ChipTone;
  icon?: IconName;
  iconSize?: number;
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  tone = 'neutral',
  icon,
  iconSize = 13,
  uppercase = false,
  style,
}: ChipProps) {
  const palette = tones[tone];
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: palette.background },
        palette.border ? { borderWidth: 1, borderColor: palette.border } : null,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={iconSize} color={palette.text} /> : null}
      <Text
        style={[
          type.labelSm,
          styles.label,
          { color: palette.text },
          uppercase ? styles.uppercase : null,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  label: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  uppercase: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
