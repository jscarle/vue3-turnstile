/// <reference types="vite/client" />

import type {
  AppearanceMode,
  ExecutionMode,
  FailureRetryMode,
  RefreshExpiredMode,
  RefreshTimeoutMode,
  Theme,
  WidgetSize,
} from '@/turnstile.ts';
import type { Language, LogLevel } from '@/types.ts'

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITEKEY?: string
  readonly VITE_TURNSTILE_LOGLEVEL?: LogLevel
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
  readonly VITE_TURNSTILE_EXECUTION?: ExecutionMode
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
