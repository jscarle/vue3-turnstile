<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, inject } from 'vue';
import { useScript } from '@unhead/vue';
import {
  type LogLevel,
  type TurnstileProps,
  TEST_SITEKEY_ALWAYS_PASS,
} from '@/types.ts'
import { type RenderParameters } from '@/turnstile.ts'
import { ENV_DEFAULTS } from '@/setup.ts'
import { TurnstileOptionsKey, type TurnstilePluginOptions } from '@/plugin'

const props = withDefaults(defineProps<TurnstileProps>(), ENV_DEFAULTS);
const pluginOptions = inject(
  TurnstileOptionsKey,
  {} as TurnstilePluginOptions,
);
const resolvedProps = computed((): TurnstileProps => ({
  ...(pluginOptions as TurnstilePluginOptions),
  ...props,
}));
const resolvedSitekey = computed(() => resolvedProps.value.sitekey);

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
  return (
    logLevelOrder[level] >= logLevelOrder[resolvedProps.value.logLevel!]
  );
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

const watchedProps = computed((): TurnstileProps => resolvedProps.value);

const options = computed((): RenderParameters => {
  // exclude logLevel since it is used only for local logging
  const { sitekey, logLevel: _logLevel, ...rest } = watchedProps.value;
  void _logLevel;
  return {
    sitekey: sitekey ?? TEST_SITEKEY_ALWAYS_PASS,
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
        if (isLogLevel('debug')) console.debug('Turnstile is removing container.');
        window.turnstile.remove(widgetId.value);
        widgetId.value = null;
        if (isLogLevel('debug')) console.debug('Turnstile removed container.');
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

interface ExposedMethods {
  reset(): void
  render(): void | Promise<void>
  execute(): void
  remove(): void
}

let exposeDefinition: ExposedMethods
if (typeof window === 'undefined') {
  const noOp = () => {}
  exposeDefinition = { reset: noOp, render: noOp, execute: noOp, remove: noOp }
} else {
  exposeDefinition = { reset, render, execute, remove }
}
defineExpose(exposeDefinition)

onMounted(async () => {
  if (typeof window === 'undefined' || !resolvedProps.value.sitekey) {
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
  async (newVal, oldVal, onCleanup) => {
    let cancelled = false;
    onCleanup(() => (cancelled = true));
    remove();
    await render();
    if (cancelled) return;
  }
);
</script>

<template>
  <template v-if="resolvedSitekey">
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
