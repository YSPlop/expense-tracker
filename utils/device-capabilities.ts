import { Platform } from 'react-native';

export function supportsDynamicIsland() {
  return Platform.OS === 'ios';
}
