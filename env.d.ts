/// <reference types="vite/client" />

import type {
  AppearanceMode,
  FailureRetryMode,
  RefreshExpiredMode,
  RefreshTimeoutMode,
  Theme,
  WidgetSize,
} from '@/types/turnstile';
import type { Language } from '@/TurnstileWidget.vue';

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITEKEY?: string
  readonly VITE_TURNSTILE_LOGLEVEL?: 'debug' | 'info' | 'warn' | 'error'
  readonly VITE_TURNSTILE_THEME?: Theme
  readonly VITE_TURNSTILE_LANGUAGE?: Language
  readonly VITE_TURNSTILE_TABINDEX?: number
  readonly VITE_TURNSTILE_SIZE?: WidgetSize
  readonly VITE_TURNSTILE_RETRY?: FailureRetryMode
  readonly VITE_TURNSTILE_RETRY_INTERVAL?: number
  readonly VITE_TURNSTILE_REFRESH_EXPIRED?: RefreshExpiredMode
  readonly VITE_TURNSTILE_REFRESH_TIMEOUT?: RefreshTimeoutMode
  readonly VITE_TURNSTILE_APPEARANCE?: AppearanceMode
  readonly VITE_TURNSTILE_FEEDBACK_ENABLED?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
