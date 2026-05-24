const PALETTE = [
  '#4F46E5',
  '#10A56F',
  '#0EA5E9',
  '#F97066',
  '#D97706',
  '#9333EA',
  '#0D9488',
  '#DB2777',
];

export function avatarInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function avatarColor(name: string): string {
  const sum = Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length] ?? '#4F46E5';
}
