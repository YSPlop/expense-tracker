import Svg, { Circle, G } from 'react-native-svg';
import { View } from 'react-native';

import type { CategoryTotal } from '@/types/analytics';
import { useAppTheme } from '@/hooks/use-app-theme';

const SIZE = 180;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type DonutPieChartProps = {
  data: CategoryTotal[];
  variant: 'donut' | 'pie';
};

export function DonutPieChart({ data, variant }: DonutPieChartProps) {
  const { colors } = useAppTheme();
  const total = data.reduce((s, d) => s + d.amount, 0);
  const innerRadius = variant === 'donut' ? RADIUS * 0.55 : 0;

  if (total === 0) {
    return (
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.chartMuted}
            strokeWidth={STROKE}
            fill="none"
            opacity={0.4}
          />
        </Svg>
      </View>
    );
  }

  let offset = 0;

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE}>
        <G rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`}>
          {data.slice(0, 6).map((item) => {
            const fraction = item.amount / total;
            const strokeDasharray = `${CIRCUMFERENCE * fraction} ${CIRCUMFERENCE}`;
            const strokeDashoffset = -CIRCUMFERENCE * offset;
            offset += fraction;

            return (
              <Circle
                key={item.categoryId}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={item.color}
                strokeWidth={STROKE}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </G>
        {variant === 'donut' && (
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={innerRadius} fill={colors.background} />
        )}
      </Svg>
    </View>
  );
}
