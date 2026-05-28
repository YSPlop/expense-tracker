import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import type { AppIconName } from '@/types/icons';
import { isCategoryEmojiIcon } from '@/utils/category-icon';

type CategoryIconProps = {
  icon: string;
  size?: number;
  color: string;
};

export function CategoryIcon({ icon, size = 22, color }: CategoryIconProps) {
  if (isCategoryEmojiIcon(icon)) {
    return (
      <View style={[styles.emojiWrap, { width: size + 4, height: size + 4 }]}>
        <Text style={[styles.emoji, { fontSize: size * 0.9 }]}>{icon}</Text>
      </View>
    );
  }

  return (
    <IconSymbol name={icon as AppIconName} size={size} color={color} />
  );
}

const styles = StyleSheet.create({
  emojiWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
});
