<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useScript } from '@unhead/vue';
import type {
  AppearanceMode,
  ExecutionMode, FailureRetryMode, RefreshExpiredMode,
  RenderParameters,
  Theme,
  Turnstile,
  WidgetSize
} from '@/types/turnstile'

const TESTING_SITEKEY = '1x00000000000000000000AA';

/** Language codes supported by Cloudflare Turnstile. */
export type Language =
  | 'auto'
  | 'ar'
  | 'bn'
  | 'bg'
  | 'ca'
  | 'zh-CN'
  | 'zh-TW'
  | 'hr'
  | 'cs'
  | 'da'
  | 'nl'
  | 'en'
  | 'et'
  | 'tl'
  | 'fi'
  | 'fr'
  | 'de'
  | 'el'
  | 'he'
  | 'hi'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'ko'
  | 'lv'
  | 'lt'
  | 'ms'
  | 'nb'
  | 'fa'
  | 'pl'
  | 'pt'
  | 'pt-BR'
  | 'ro'
  | 'ru'
  | 'sr'
  | 'sk'
  | 'sl'
  | 'es'
  | 'sv'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'ar-eg'
  | 'es-es'
  | 'fr-fr'
  | 'de-de'
  | 'ja-jp'
  | 'ru-ru'
  | 'tr-tr'
  | 'pt-br'
  | 'nl-nl'
  | 'it-it'
  | 'pl-pl'
  | 'fa-ir'
  | 'hr-hr'
  | 'hu-hu'
  | 'lt-lt'
  | 'nb-no'
  | 'ro-ro'
  | 'sk-sk'
  | 'sl-si'
  | 'sr-ba'
  | 'uk-ua'
  | 'ms-my'
  | 'th-th'
  | 'tl-ph';

type TurnstileSharedOptions =
  | 'action'
  | 'cData'
  | 'theme'
  | 'tabindex'
  | 'size'
  | 'retry'
  | 'retry-interval'
  | 'appearance'
  | 'refresh-expired'
  | 'refresh-timeout'
  | 'execution'
  | 'feedback-enabled';

type TurnstileProps = Pick<RenderParameters, TurnstileSharedOptions> & {
  /** Every widget has a sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation. */
  sitekey?: string;
  /** Log level for browser logs. Can be debug, info, warn, or error. */
  logLevel?: LogLevel;
  /** Language to display. Must be either: auto (default) to use the language that the visitor has chosen, or an ISO 639-1 two-letter language code (e.g. en) or language and country code (e.g. en-US). See https://developers.cloudflare.com/turnstile/reference/supported-languages/ */
  language?: Language;
};

declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    turnstile: Turnstile;
  }
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function parseEnum<T extends string>(val: unknown, valid: readonly T[]): T | undefined {
  return valid.includes(val as T) ? (val as T) : undefined;
}
function parseNumber(val: unknown): number | undefined {
  const n = Number(val);
  return !isNaN(n) ? n : undefined;
}
function parseBoolean(val: unknown): boolean | undefined {
  if (val === undefined) return undefined;
  if (val === 'true' || val === '1') return true;
  if (val === 'false' || val === '0') return false;
  return undefined;
}

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
const THEMES = ['auto', 'light', 'dark'] as const;
const LANGUAGES = [
  'auto','ar','bn','bg','ca','zh-CN','zh-TW','hr','cs','da','nl','en','et','tl','fi','fr','de','el','he','hi','hu','id','it','ja','ko','lv','lt','ms','nb','fa','pl','pt','pt-BR','ro','ru','sr','sk','sl','es','sv','th','tr','uk','vi','ar-eg','es-es','fr-fr','de-de','ja-jp','ru-ru','tr-tr','pt-br','nl-nl','it-it','pl-pl','fa-ir','hr-hr','hu-hu','lt-lt','nb-no','ro-ro','sk-sk','sl-si','sr-ba','uk-ua','ms-my','th-th','tl-ph'
] as const;
const SIZES = ['normal', 'compact', 'flexible'] as const;
const FAILURE_MODES = ['never', 'auto'] as const;
const APPEARANCES = ['always', 'execute', 'interaction-only'] as const;
const REFRESH_EXPIRED = ['never', 'manual', 'auto'] as const;
const EXECUTION = ['render', 'execute'] as const;

const props = withDefaults(defineProps<TurnstileProps>(), {
  sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY ?? TESTING_SITEKEY,
  logLevel: parseEnum<LogLevel>(import.meta.env.VITE_TURNSTILE_LOGLEVEL, LOG_LEVELS) ?? 'info',
  theme: parseEnum<Theme>(import.meta.env.VITE_TURNSTILE_THEME, THEMES),
  language: parseEnum<Language>(import.meta.env.VITE_TURNSTILE_LANGUAGE, LANGUAGES),
  tabindex: parseNumber(import.meta.env.VITE_TURNSTILE_TABINDEX),
  size: parseEnum<WidgetSize>(import.meta.env.VITE_TURNSTILE_SIZE, SIZES),
  retry: parseEnum<FailureRetryMode>(import.meta.env.VITE_TURNSTILE_RETRY, FAILURE_MODES),
  retryInterval: parseNumber(import.meta.env.VITE_TURNSTILE_RETRY_INTERVAL),
  refreshExpired: parseEnum<RefreshExpiredMode>(import.meta.env.VITE_TURNSTILE_REFRESH_EXPIRED, REFRESH_EXPIRED),
  refreshTimeout: parseNumber(import.meta.env.VITE_TURNSTILE_REFRESH_TIMEOUT),
  appearance: parseEnum<AppearanceMode>(import.meta.env.VITE_TURNSTILE_APPEARANCE, APPEARANCES),
  feedbackEnabled: parseBoolean(import.meta.env.VITE_TURNSTILE_FEEDBACK_ENABLED),
  execution: parseEnum<ExecutionMode>(import.meta.env.VITE_TURNSTILE_EXECUTION, EXECUTION),
});

const model = defineModel<string | null>({ required: true });

const emit = defineEmits<{
  (e: 'success', response: string): void;
  (e: 'error', error: string): void;
  (e: 'expired'): void;
  (e: 'unsupported'): void;
  (e: 'timeout'): void;
  (e: 'failed', error: unknown): void;
}>();

const isLoading = ref(true);
const error = ref<string | null>(null);
const widgetRef = ref<HTMLElement | null>(null);
const widgetId = ref<string | null | undefined>(null);

const logLevelOrder = { debug: 0, info: 1, warn: 2, error: 3 };
const mustInitialize = ref(true);
const isInitialized = ref(false);

const turnstile = useScript('https://challenges.cloudflare.com/turnstile/v0/api.js', {
  trigger: 'manual',
});

if (typeof window !== 'undefined' && window.turnstile === undefined) {
  mustInitialize.value = true;
  turnstile.warmup('preload');
  if (isLogLevel('debug')) console.debug('Turnstile is preloaded.');
} else {
  mustInitialize.value = false;
}

/** Check if a message should be logged for the current log level. */
function isLogLevel(level: LogLevel): boolean {
  return logLevelOrder[level] >= logLevelOrder[props.logLevel];
}

const callback = (response: string) => {
  emit('success', response);
  model.value = response;
};
const errorCallback = (error: string) => {
  emit('error', error);
  if (isLogLevel('error')) console.error(`Turnstile errored with code ${error}.`);
  model.value = null;
};
const expiredCallback = () => {
  emit('expired');
  if (isLogLevel('error')) console.error('Turnstile expired.');
  model.value = null;
};
const unsupportedCallback = () => {
  emit('unsupported');
  if (isLogLevel('error')) console.error('Turnstile is unsupported.');
  model.value = null;
};
const timeoutCallback = () => {
  emit('timeout');
  if (isLogLevel('warn')) console.warn('Turnstile timed out.');
  model.value = null;
};

const watchedProps = computed((): TurnstileProps => props);

const options = computed((): RenderParameters => {
  const { sitekey, ...rest } = watchedProps.value;
  return {
    sitekey: sitekey ?? TESTING_SITEKEY,
    ...rest,
    callback,
    'error-callback': errorCallback,
    'expired-callback': expiredCallback,
    'unsupported-callback': unsupportedCallback,
    'timeout-callback': timeoutCallback,
  };
});

/** Reset the Turnstile widget. */
function reset() {
  if (typeof window !== 'undefined' && window.turnstile && window.turnstile.reset && widgetId.value) {
    window.turnstile.reset(widgetId.value);
  }
}

/** Execute the Turnstile widget. */
function execute() {
  if (typeof window !== 'undefined' && window.turnstile && window.turnstile.execute && widgetId.value) {
    window.turnstile.execute(widgetId.value, options.value);
  }
}

/** Remove the Turnstile widget. */
function remove() {
  try {
    if (typeof window !== 'undefined' && window.turnstile && window.turnstile.remove) {
      if (widgetId.value) {
        window.turnstile.remove(widgetId.value);
        widgetId.value = null;
      } else if (widgetRef.value) {
        window.turnstile.remove(widgetRef.value);
      }
    }
  } catch (e) {
    if (isLogLevel('warn')) console.warn('Error while removing Turnstile.', e);
  }
}

/** Render the Turnstile widget. */
async function render() {
  try {
    error.value = null;
    remove();
    if (mustInitialize.value && !isInitialized.value) {
      isInitialized.value = true;
      await turnstile.load();
      if (isLogLevel('debug')) console.debug('Turnstile is initialized.');
    }
    await nextTick();
    if (widgetRef.value) {
      if (typeof window !== 'undefined' && window.turnstile && window.turnstile.render) {
        if (isLogLevel('debug')) console.debug('Turnstile is rendering.');
        widgetId.value = window.turnstile.render(widgetRef.value, options.value);
      }
    }
    if (isLogLevel('debug')) console.debug('Turnstile loaded.');
  } catch (e) {
    emit('failed', e);
    if (isLogLevel('error')) console.error('Turnstile failed to load.', e);
    error.value = 'Turnstile failed to load.';
  } finally {
    isLoading.value = false;
  }
}

let exposeDefinition;
if (typeof window === 'undefined') {
  function noOp() {}

  exposeDefinition = { reset: noOp, render: noOp, execute: noOp, remove: noOp };
} else {
  exposeDefinition = { reset, render, execute, remove };
}
defineExpose(exposeDefinition);

onMounted(async () => {
  if (typeof window === 'undefined' || !props.sitekey) {
    if (isLogLevel('warn')) console.warn('Turnstile site key was not found.');
    isLoading.value = false;
    return;
  }
  await render();
});

onUnmounted(() => {
  remove();
  widgetRef.value = null;
  widgetId.value = null;
  mustInitialize.value = true;
  isInitialized.value = false;
});

watch(
  () => watchedProps.value,
  async () => {
    remove();
    await render();
  }
);
</script>

<template>
  <template v-if="sitekey">
    <template v-if="isLoading">
      <slot name="loading">
        <div role="status" aria-busy="true" aria-live="polite">Loading...</div>
      </slot>
    </template>
    <template v-else-if="error">
      <div role="alert" aria-live="assertive">
        <slot name="error">{{ error }}</slot>
      </div>
    </template>
    <div v-show="!isLoading && !error" role="region" ref="widgetRef"></div>
  </template>
</template>

<style scoped lang="css"></style>
