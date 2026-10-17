import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, fonts, radius, type } from '@/theme';

type Variant = 'primary' | 'ghost' | 'amber';

interface ActionButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variants: Record<
  Variant,
  { container: ViewStyle; label: string; icon: string; pressed: ViewStyle }
> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    label: colors.surface,
    icon: colors.surface,
    pressed: { backgroundColor: colors.primaryPressed },
  },
  ghost: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: colors.primary,
    icon: colors.primary,
    pressed: { backgroundColor: colors.canvas },
  },
  amber: {
    container: { backgroundColor: colors.amberSoft },
    label: colors.amberDeep,
    icon: colors.amberDeep,
    pressed: { backgroundColor: '#FCEBD3' },
  },
};

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
}: ActionButtonProps) {
  const palette = variants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        palette.container,
        pressed && !disabled ? palette.pressed : null,
        disabled ? styles.disabled : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.label} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' ? (
            <Icon name={icon} size={19} color={palette.icon} />
          ) : null}
          <Text style={[type.labelLg, styles.label, { color: palette.label }]}>{label}</Text>
          {icon && iconPosition === 'right' ? (
            <Icon name={icon} size={19} color={palette.icon} />
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.heading,
    fontSize: 15,
    letterSpacing: 0.1,
  },
  disabled: {
    opacity: 0.45,
  },
  link: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkLabel: {
    color: colors.primary,
    fontFamily: fonts.heading,
  },
});

export function LinkButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.link, pressed ? styles.linkPressed : null, style]}
    >
      <Text style={[type.labelMd, styles.linkLabel]}>{label}</Text>
    </Pressable>
  );
}
