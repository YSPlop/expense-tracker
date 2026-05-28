import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

import { GlassSurface } from './GlassSurface';

type GlassModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  align?: 'center' | 'bottom';
};

export function GlassModal({ visible, onClose, children, align = 'center' }: GlassModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={[styles.scrim, { backgroundColor: colors.scrim }]} onPress={onClose} />

        <View
          style={[
            styles.contentWrap,
            align === 'bottom' && { paddingBottom: insets.bottom + Spacing.lg, justifyContent: 'flex-end' },
            align === 'center' && styles.centered,
          ]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <GlassSurface variant="modal" borderRadius={Radius.xl} elevated style={styles.card}>
              {children}
            </GlassSurface>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  centered: {
    justifyContent: 'center',
  },
  card: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
});
