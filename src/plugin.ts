import type { App, Plugin, InjectionKey } from 'vue'
import TurnstileWidget from './TurnstileWidget.vue'
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
  },
} satisfies Plugin

export default TurnstilePlugin
