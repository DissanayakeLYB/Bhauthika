import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Light tactile confirmation; silently no-ops on web and unsupported devices. */
export function tapFeedback() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
