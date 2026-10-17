import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Bhauthika Laboratory & Study System tokens.
 * Mirrors stitch_bhauthika_physics_app_ui/bhauthika_laboratory_study_system/DESIGN.md
 */
export const colors = {
  canvas: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceLow: '#F2F3FF',
  surfaceContainer: '#ECEDFB',
  surfaceHigh: '#E6E7F6',
  border: '#E8ECF4',
  borderStrong: '#C7C5D2',

  primary: '#20256B',
  primaryDeep: '#070B57',
  primaryPressed: '#2E3280',
  indigoSoft: '#EEF0FF',
  indigoMid: '#3B3F9E',

  ink: '#1B1E28',
  inkMuted: '#636A7E',
  inkFaint: '#9CA3AF',

  green: '#2E9E6B',
  greenSoft: '#EBF7F1',
  amber: '#F5A524',
  amberDeep: '#CD8600',
  amberSoft: '#FEF6E9',
  amberTint: '#FFF7E8',
  red: '#D64545',
  redSoft: '#FDECEC',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  sheet: 28,
  pill: 999,
};

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  heading: 'SpaceGrotesk_600SemiBold',
  headingMedium: 'SpaceGrotesk_500Medium',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
};

export const type = {
  displayLg: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
    color: colors.ink,
  } satisfies TextStyle,
  headlineLg: {
    fontFamily: fonts.heading,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.26,
    color: colors.primary,
  } satisfies TextStyle,
  headlineMd: {
    fontFamily: fonts.heading,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.2,
    color: colors.ink,
  } satisfies TextStyle,
  headlineSm: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: -0.1,
    color: colors.ink,
  } satisfies TextStyle,
  questionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    lineHeight: 28,
    color: colors.ink,
  } satisfies TextStyle,
  bodyLg: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
  } satisfies TextStyle,
  bodyMd: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    color: colors.ink,
  } satisfies TextStyle,
  bodySm: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.inkMuted,
  } satisfies TextStyle,
  labelLg: {
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.28,
    color: colors.ink,
  } satisfies TextStyle,
  labelMd: {
    fontFamily: fonts.heading,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.48,
    color: colors.ink,
  } satisfies TextStyle,
  labelSm: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.55,
    color: colors.inkMuted,
  } satisfies TextStyle,
};

/** Level 1 elevation: surface cards and option tiles. */
export const cardShadow: ViewStyle = {
  shadowColor: colors.ink,
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
};

/** Level 2 elevation: selected options and focused cards. */
export const raisedShadow: ViewStyle = {
  shadowColor: '#20256B',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

/** Level 3 elevation: bottom sheets and modal surfaces. */
export const sheetShadow: ViewStyle = {
  shadowColor: colors.ink,
  shadowOpacity: 0.18,
  shadowRadius: 32,
  shadowOffset: { width: 0, height: -8 },
  elevation: 16,
};

export const layout = {
  margin: spacing.md,
  maxWidth: 640,
  tabBarHeight: 64,
};
