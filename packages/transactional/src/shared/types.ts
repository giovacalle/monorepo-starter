export const Locales = ['it', 'en'] as const;
export type Locale = (typeof Locales)[number];
