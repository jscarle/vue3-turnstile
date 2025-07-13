import type { App, Plugin, InjectionKey } from 'vue'
import TurnstileWidget from './TurnstileWidget.vue'
import { ENV_DEFAULTS } from './setup.ts'
import type { Language, LogLevel } from './types.ts'
import type {
  AppearanceMode,
  ExecutionMode,
  FailureRetryMode,
  RefreshExpiredMode,
  RefreshTimeoutMode,
  Theme,
  WidgetSize,
} from './turnstile.ts'

export interface TurnstilePluginOptions {
  sitekey?: string
  logLevel?: LogLevel
  language?: Language
  action?: string
  cData?: string
  theme?: Theme
  tabindex?: number
  size?: WidgetSize
  retry?: FailureRetryMode
  'retry-interval'?: number
  appearance?: AppearanceMode
  'refresh-expired'?: RefreshExpiredMode
  'refresh-timeout'?: RefreshTimeoutMode
  execution?: ExecutionMode
  'feedback-enabled'?: boolean
}

export const TurnstileOptionsKey: InjectionKey<TurnstilePluginOptions> =
  Symbol('TurnstileOptions')

/**
 * Plugin to globally register the TurnstileWidget component.
 */
const TurnstilePlugin = {
  install(app: App, options: TurnstilePluginOptions = {}): void {
    app.component('TurnstileWidget', TurnstileWidget)
    app.provide(TurnstileOptionsKey, options)

    const defaults = ENV_DEFAULTS as Record<keyof TurnstilePluginOptions, unknown>
    for (const [key, value] of Object.entries(options) as [keyof TurnstilePluginOptions, unknown][]) {
      if (value !== undefined) {
        defaults[key] = value
      }
    }
  },
} satisfies Plugin

export default TurnstilePlugin
