import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, Path, Pattern, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts, radius, type } from '@/theme';

/** Potentiometer schematic used by the Current Electricity past-paper item. */
export function PotentiometerDiagram() {
  return (
    <View style={styles.card}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="blueprint" width={16} height={16} patternUnits="userSpaceOnUse">
            <Path
              d="M16 0H0V16"
              stroke={colors.borderStrong}
              strokeOpacity={0.35}
              strokeWidth={1}
              fill="none"
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#blueprint)" />
      </Svg>

      <View style={styles.headerRow}>
        <View style={styles.figurePill}>
          <View style={styles.dot} />
          <Text style={styles.figureLabel}>FIG 1.1: POTENTIOMETER SETUP</Text>
        </View>
        <Text style={styles.figureMeta}>L = 100 cm</Text>
      </View>

      <View style={styles.svgWrap}>
        <Svg width="100%" height={64} viewBox="0 0 290 64">
          <Path
            d="M 40 40 L 40 14 L 110 14"
            stroke="#464650"
            strokeLinecap="round"
            strokeWidth={1.75}
            fill="none"
          />
          <Line x1={110} x2={110} y1={7} y2={21} stroke={colors.primaryDeep} strokeWidth={2} />
          <Line x1={115} x2={115} y1={10} y2={18} stroke="#464650" strokeWidth={1.5} />
          <SvgText x={104} y={6} fill={colors.primaryDeep} fontFamily={fonts.heading} fontSize={8} fontWeight="600">
            2V, 1Ω
          </SvgText>
          <Path d="M 115 14 L 170 14" stroke="#464650" strokeWidth={1.75} fill="none" />
          <Path
            d="M 170 14 L 175 10 L 180 18 L 185 10 L 190 18 L 195 14 L 250 14 L 250 40"
            fill="none"
            stroke="#464650"
            strokeWidth={1.75}
          />
          <SvgText x={188} y={6} fill={colors.inkFaint} fontFamily={fonts.headingMedium} fontSize={8}>
            r = 1Ω
          </SvgText>
          <Line
            x1={40}
            x2={250}
            y1={40}
            y2={40}
            stroke={colors.primaryDeep}
            strokeLinecap="round"
            strokeWidth={3.5}
          />
          <Circle cx={40} cy={40} r={3} fill={colors.primary} />
          <Circle cx={250} cy={40} r={3} fill={colors.primary} />
          <SvgText x={34} y={55} fill={colors.primaryDeep} fontFamily={fonts.display} fontSize={10}>
            A
          </SvgText>
          <SvgText x={252} y={55} fill={colors.primaryDeep} fontFamily={fonts.display} fontSize={10}>
            B
          </SvgText>
          <SvgText x={112} y={53} fill={colors.indigoMid} fontFamily={fonts.headingMedium} fontSize={9}>
            10 Ω (100 cm)
          </SvgText>
          <Path d="M 145 40 L 145 35" stroke={colors.red} strokeDasharray="2 2" strokeWidth={1.5} />
          <Circle cx={145} cy={40} r={2} fill={colors.red} />
          <SvgText x={148} y={36} fill={colors.red} fontFamily={fonts.heading} fontSize={7}>
            G
          </SvgText>
        </Svg>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>R_wire = 10 Ω</Text>
        <Text style={styles.footerText}>E = 2.0 V · r = 1.0 Ω</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 128,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 210, 0.5)',
    backgroundColor: colors.surface,
    padding: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  figurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(199, 197, 210, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.indigoMid,
  },
  figureLabel: {
    ...type.labelSm,
    fontSize: 9,
    letterSpacing: 0.9,
    color: colors.inkMuted,
  },
  figureMeta: {
    ...type.labelSm,
    fontSize: 9,
    color: colors.borderStrong,
  },
  svgWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(199, 197, 210, 0.3)',
    paddingTop: 4,
  },
  footerText: {
    ...type.labelSm,
    fontSize: 9,
    color: colors.inkMuted,
  },
});
