import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, type } from '@/theme';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CHART_HEIGHT = 132;

interface WeekChartProps {
  values: number[];
  todayIndex: number;
}

export function WeekChart({ values, todayIndex }: WeekChartProps) {
  const max = Math.max(...values, 32);
  const total = values.reduce((sum, value) => sum + value, 0);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Questions answered this week</Text>
          <Text style={styles.subtitle}>7-day pacing velocity</Text>
        </View>
        <Text style={styles.total}>{total} Qs</Text>
      </View>

      <View style={styles.chartRow}>
        {values.map((value, index) => {
          const isToday = index === todayIndex;
          const barHeight = Math.max(10, (value / max) * CHART_HEIGHT);
          return (
            <View key={DAY_LABELS[index]} style={styles.column}>
              {isToday ? (
                <View style={[styles.tooltip, { bottom: barHeight + 10 }]}>
                  <Text style={styles.tooltipText}>{value} Qs</Text>
                </View>
              ) : null}
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isToday ? colors.primary : 'rgba(32,37,107,0.16)',
                  },
                ]}
              >
                {isToday ? <View style={styles.barDot} /> : null}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.labelRow}>
        {DAY_LABELS.map((label, index) => (
          <View key={label} style={styles.labelColumn}>
            <Text
              style={[
                styles.dayLabel,
                index === todayIndex ? styles.dayLabelActive : null,
              ]}
            >
              {label}
            </Text>
            {index === todayIndex ? <View style={styles.dayDot} /> : null}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text style={type.bodySm}>Today: peak session recorded</Text>
        </View>
        <Text style={styles.goal}>Daily Goal: 25 Qs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  subtitle: {
    ...type.bodySm,
    color: colors.inkMuted,
  },
  total: {
    fontFamily: fonts.heading,
    fontSize: 18,
    lineHeight: 26,
    color: colors.primary,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: CHART_HEIGHT,
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHigh,
    paddingHorizontal: 4,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    maxWidth: 26,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },
  barDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignSelf: 'center',
    marginTop: 6,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tooltipText: {
    ...type.labelSm,
    fontSize: 10,
    color: colors.surface,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  labelColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    ...type.labelSm,
    color: colors.inkFaint,
    textAlign: 'center',
  },
  dayLabelActive: {
    color: colors.primary,
    fontFamily: fonts.heading,
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  goal: {
    ...type.labelSm,
    fontFamily: fonts.heading,
    color: colors.primary,
  },
});
