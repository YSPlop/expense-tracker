import { useMemo } from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useAppTheme() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return useMemo(
    () => ({
      scheme,
      colors,
      isDark: scheme === 'dark',
    }),
    [scheme, colors]
  );
}
