import { Easing } from 'react-native';

export const Springs = {
  press: { damping: 15, stiffness: 300, mass: 0.8 },
  dock: { damping: 14, stiffness: 240, mass: 0.85 },
  modal: { damping: 20, stiffness: 260, mass: 1 },
  chart: { damping: 18, stiffness: 220, mass: 0.9 },
  counter: { damping: 20, stiffness: 180, mass: 1 },
} as const;

export const Durations = {
  fast: 200,
  normal: 300,
  slow: 400,
} as const;

export const Stagger = {
  section: 50,
  listItem: 40,
} as const;

export const Easings = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
} as const;

export const PressScale = {
  pressed: 0.96,
  default: 1,
} as const;
