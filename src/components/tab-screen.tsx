import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/app-header';
import { MenuSheet } from '@/components/menu-sheet';
import { colors } from '@/theme';

interface TabScreenProps {
  streak: number;
  streakLabel?: 'days' | 'compact' | 'short';
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  scroll?: boolean;
}

export function TabScreen({
  streak,
  streakLabel = 'days',
  children,
  contentStyle,
  scroll = true,
}: TabScreenProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <AppHeader streak={streak} streakLabel={streakLabel} onMenuPress={() => setMenuOpen(true)} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flexContent, contentStyle]}>{children}</View>
      )}
      <MenuSheet visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
  flexContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
