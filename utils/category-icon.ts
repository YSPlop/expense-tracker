export function isCategoryEmojiIcon(icon: string): boolean {
  if (!icon || icon.includes('.')) return false;
  return /\p{Extended_Pictographic}/u.test(icon);
}
