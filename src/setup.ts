import { TEST_SITEKEY_ALWAYS_PASS } from '@/types.ts';
import type { TurnstileProps } from '@/types.ts';

export const DEFAULT_PROPS: Partial<TurnstileProps> = {
  sitekey: TEST_SITEKEY_ALWAYS_PASS,
  logLevel: 'info',
};
