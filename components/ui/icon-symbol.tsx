// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

import type { AppIconName } from '@/types/icons';

export type { AppIconName };

const MAPPING: Record<AppIconName, ComponentProps<typeof MaterialIcons>['name']> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.right': 'chevron-right',
  'minus.circle.fill': 'remove-circle',
  'plus.circle.fill': 'add-circle',
  'fork.knife': 'restaurant',
  'car.fill': 'directions-car',
  'bolt.fill': 'bolt',
  'bag.fill': 'shopping-bag',
  'dollarsign.circle.fill': 'attach-money',
  'briefcase.fill': 'work',
  'questionmark.circle.fill': 'help',
  tray: 'inbox',
  xmark: 'close',
  pencil: 'edit',
  trash: 'delete',
  'chart.pie.fill': 'pie-chart',
  'chart.bar.fill': 'bar-chart',
  'chart.line.uptrend.xyaxis': 'show-chart',
  'chart.donut': 'donut-large',
  'square.grid.2x2.fill': 'grid-view',
  'creditcard.fill': 'credit-card',
  'cart.fill': 'shopping-cart',
  'cup.and.saucer.fill': 'local-cafe',
  'heart.fill': 'favorite',
  'gamecontroller.fill': 'sports-esports',
  'gift.fill': 'card-giftcard',
  airplane: 'flight',
  'book.fill': 'menu-book',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: AppIconName | string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  const materialName = MAPPING[name as AppIconName] ?? 'help-outline';
  return <MaterialIcons color={color} size={size} name={materialName} style={style} />;
}
