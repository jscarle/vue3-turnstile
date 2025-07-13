import type { App, Plugin, InjectionKey } from 'vue'
import TurnstileWidget from './TurnstileWidget.vue'
import { ENV_DEFAULTS } from './setup.ts'
import type { TurnstileProps } from './types.ts'

export type TurnstilePluginOptions = Partial<TurnstileProps>

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
