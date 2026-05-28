import { useEffect, useState } from 'react';

import { formatMoney } from '@/utils/money';

export function useAnimatedCounter(cents: number) {
  const [displayText, setDisplayText] = useState(() => formatMoney(cents));

  useEffect(() => {
    setDisplayText(formatMoney(cents));
  }, [cents]);

  return { displayText };
}
