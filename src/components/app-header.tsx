import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { colors, fonts, radius, spacing, type } from '@/theme';

interface AppHeaderProps {
  streak: number;
  streakLabel?: 'days' | 'compact' | 'short';
  onMenuPress?: () => void;
}

export function StreakChip({
  streak,
  label = 'days',
}: {
  streak: number;
  label?: 'days' | 'compact' | 'short';
}) {
  const text =
    label === 'compact' ? `${streak}` : label === 'short' ? `${streak} d` : `${streak} Days Streak`;
  return (
    <View
      style={[
        styles.streak,
        label === 'compact' ? styles.streakCompact : null,
        label === 'short' ? styles.streakShort : null,
      ]}
    >
      <Icon name="local-fire-department" size={18} color={colors.amber} />
      <Text
        style={[
          styles.streakText,
          label === 'compact' ? styles.streakTextBold : null,
          label === 'short' ? styles.streakTextPrimary : null,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

export function AppHeader({ streak, streakLabel = 'days', onMenuPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={onMenuPress}
          hitSlop={8}
          style={({ pressed }) => [styles.menuButton, pressed ? styles.pressed : null]}
        >
          <Icon name="menu" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Bhauthika</Text>
      </View>
      <StreakChip streak={streak} label={streakLabel} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 56,
    backgroundColor: colors.canvas,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  pressed: {
    backgroundColor: colors.surfaceContainer,
    opacity: 0.9,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.4,
    color: colors.primary,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 28,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakCompact: {
    backgroundColor: colors.indigoSoft,
    borderColor: '#C9CCF6',
    paddingHorizontal: 9,
  },
  streakShort: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.borderStrong,
    paddingHorizontal: 9,
  },
  streakText: {
    ...type.labelMd,
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.amberDeep,
  },
  streakTextBold: {
    color: colors.primary,
    fontFamily: fonts.heading,
    fontSize: 12,
  },
  streakTextPrimary: {
    color: colors.primary,
    fontFamily: fonts.heading,
  },
});
