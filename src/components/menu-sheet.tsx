import { router } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LogoMark } from '@/components/brand/logo';
import { Icon, type IconName } from '@/components/ui/icon';
import { useAuth } from '@/store/auth-context';
import { useStudy } from '@/store/study-context';
import { colors, fonts, radius, sheetShadow, spacing, type } from '@/theme';

interface MenuSheetProps {
  visible: boolean;
  onClose: () => void;
}

const destinations: { label: string; icon: IconName; href: '/home' | '/practice' | '/progress' }[] = [
  { label: 'Home', icon: 'home', href: '/home' },
  { label: 'Practice', icon: 'science', href: '/practice' },
  { label: 'Progress & Mastery', icon: 'insights', href: '/progress' },
];

export function MenuSheet({ visible, onClose }: MenuSheetProps) {
  const { progress, resetProgress } = useStudy();
  const { signOut } = useAuth();

  const go = (href: '/home' | '/practice' | '/progress') => {
    onClose();
    router.replace(href);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close menu">
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          <View style={styles.brand}>
            <LogoMark size={44} />
            <View>
              <Text style={styles.brandTitle}>Bhauthika</Text>
              <Text style={type.bodySm}>A/L Physics · English Medium</Text>
            </View>
            <View style={styles.streakPill}>
              <Icon name="local-fire-department" size={16} color={colors.amber} />
              <Text style={styles.streakText}>{progress.streak} day streak</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {destinations.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => go(item.href)}
              style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
            >
              <View style={styles.rowIcon}>
                <Icon name={item.icon} size={19} color={colors.primary} />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={18} color={colors.inkFaint} />
            </Pressable>
          ))}

          <View style={styles.divider} />

          <Pressable
            onPress={() => {
              resetProgress();
              onClose();
            }}
            style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
          >
            <View style={styles.rowIcon}>
              <Icon name="restart-alt" size={19} color={colors.amberDeep} />
            </View>
            <Text style={styles.rowLabel}>Reset practice data</Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              onClose();
              await signOut();
              router.replace('/');
            }}
            style={({ pressed }) => [styles.row, pressed ? styles.rowPressed : null]}
          >
            <View style={styles.rowIcon}>
              <Icon name="logout" size={19} color={colors.inkMuted} />
            </View>
            <Text style={styles.rowLabel}>Sign out</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 30, 40, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
    ...sheetShadow,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandTitle: {
    ...type.headlineSm,
    color: colors.primary,
    fontFamily: fonts.display,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    paddingHorizontal: 9,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.amberSoft,
  },
  streakText: {
    ...type.labelSm,
    color: colors.amberDeep,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: colors.canvas,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    ...type.bodyMd,
    fontFamily: fonts.bodySemiBold,
    color: colors.ink,
    flex: 1,
  },
});
