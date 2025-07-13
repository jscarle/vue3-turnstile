import {
  type AppearanceMode, type ExecutionMode,
  type FailureRetryMode,
  type Language,
  type LogLevel,
  type RefreshExpiredMode,
  type RefreshTimeoutMode,
  TESTING_SITEKEY,
  type Theme,
  type WidgetSize
} from '@/types/turnstile.d'

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
const REFRESH_TIMEOUT = ['never', 'manual', 'auto'] as const;
const EXECUTION = ['render', 'execute'] as const;

export const ENV_DEFAULTS = {
  sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY ?? TESTING_SITEKEY,
  logLevel: parseEnum<LogLevel>(import.meta.env.VITE_TURNSTILE_LOGLEVEL, LOG_LEVELS) ?? 'info',
  theme: parseEnum<Theme>(import.meta.env.VITE_TURNSTILE_THEME, THEMES),
  language: parseEnum<Language>(import.meta.env.VITE_TURNSTILE_LANGUAGE, LANGUAGES),
  tabindex: parseNumber(import.meta.env.VITE_TURNSTILE_TABINDEX),
  size: parseEnum<WidgetSize>(import.meta.env.VITE_TURNSTILE_SIZE, SIZES),
  retry: parseEnum<FailureRetryMode>(import.meta.env.VITE_TURNSTILE_RETRY, FAILURE_MODES),
  'retry-interval': parseNumber(import.meta.env.VITE_TURNSTILE_RETRY_INTERVAL),
  'refresh-expired': parseEnum<RefreshExpiredMode>(import.meta.env.VITE_TURNSTILE_REFRESH_EXPIRED, REFRESH_EXPIRED),
  'refresh-timeout': parseEnum<RefreshTimeoutMode>(import.meta.env.VITE_TURNSTILE_REFRESH_TIMEOUT, REFRESH_TIMEOUT),
  appearance: parseEnum<AppearanceMode>(import.meta.env.VITE_TURNSTILE_APPEARANCE, APPEARANCES),
  'feedback-enabled': parseBoolean(import.meta.env.VITE_TURNSTILE_FEEDBACK_ENABLED),
  execution: parseEnum<ExecutionMode>(import.meta.env.VITE_TURNSTILE_EXECUTION, EXECUTION),
}
