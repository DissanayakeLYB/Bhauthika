import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs, type BottomTabBarProps } from 'expo-router/js-tabs';
import { Icon, type IconName } from '@/components/ui/icon';
import { colors, fonts } from '@/theme';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  home: { label: 'Home', icon: 'home' },
  practice: { label: 'Practice', icon: 'science' },
  progress: { label: 'Progress', icon: 'insights' },
};

function AppTabBar({ state, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View
      style={[
        styles.bar,
        { height: 64 + insets.bottom, paddingBottom: insets.bottom },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name];
        if (!meta) return null;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            onPress={() => {
              if (!focused) navigateToTab(route.key);
            }}
            style={({ pressed }) => [styles.tab, pressed ? styles.tabPressed : null]}
          >
            <Icon name={meta.icon} size={22} color={focused ? colors.primary : colors.inkFaint} />
            <Text style={[styles.label, focused ? styles.labelActive : null]}>{meta.label}</Text>
            {focused ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="practice" options={{ title: 'Practice' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    shadowColor: colors.ink,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingTop: 4,
  },
  tabPressed: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.headingMedium,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 0.4,
    color: colors.inkFaint,
  },
  labelActive: {
    fontFamily: fonts.heading,
    color: colors.primary,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    marginTop: 1,
  },
  dotSpacer: {
    width: 5,
    height: 5,
    marginTop: 1,
  },
});
