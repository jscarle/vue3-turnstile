import type { App, Plugin } from 'vue'
import TurnstileWidget from './TurnstileWidget.vue'

/**
 * Plugin to globally register the TurnstileWidget component.
 */
const TurnstilePlugin: Plugin = {
  install(app: App) {
    app.component('TurnstileWidget', TurnstileWidget)
  },
}

export default TurnstilePlugin
