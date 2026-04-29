export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type Language =
  | 'auto'
  | 'ar'
  | 'bg'
  | 'zh'
  | 'zh-cn'
  | 'zh-tw'
  | 'hr'
  | 'cs'
  | 'da'
  | 'nl'
  | 'en'
  | 'fa'
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
  | 'tlh'
  | 'ko'
  | 'lt'
  | 'ms'
  | 'nb'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'sr'
  | 'sk'
  | 'sl'
  | 'es'
  | 'sv'
  | 'tl'
  | 'th'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'ar-eg'
  | 'bg-bg'
  | 'cs-cz'
  | 'da-dk'
  | 'en-us'
  | 'es-es'
  | 'fr-fr'
  | 'de-de'
  | 'el-gr'
  | 'he-il'
  | 'hi-in'
  | 'id-id'
  | 'fi-fi'
  | 'ko-kr'
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
  | 'tl-ph'
  | 'vi-vn';

/** Test sitekey that always passes (visible). */
export const TEST_SITEKEY_ALWAYS_PASS = '1x00000000000000000000AA';

/** Test sitekey that always blocks (visible). */
export const TEST_SITEKEY_ALWAYS_BLOCK = '2x00000000000000000000AB';

/** Test sitekey that always passes (invisible). */
export const TEST_SITEKEY_ALWAYS_PASS_INVISIBLE = '1x00000000000000000000BB';

/** Test sitekey that always blocks (invisible). */
export const TEST_SITEKEY_ALWAYS_BLOCK_INVISIBLE = '2x00000000000000000000BB';

/** Test sitekey that forces an interactive challenge (visible). */
export const TEST_SITEKEY_CHALLENGE = '3x00000000000000000000FF';

import type { RenderParameters } from './turnstile';

export type TurnstileSharedOptions =
  | 'action'
  | 'cData'
  | 'theme'
  | 'tabindex'
  | 'size'
  | 'retry'
  | 'retry-interval'
  | 'appearance'
  | 'response-field'
  | 'response-field-name'
  | 'refresh-expired'
  | 'refresh-timeout'
  | 'execution'
  | 'feedback-enabled'
  | 'offlabel-show-privacy';

export type TurnstileProps = Pick<RenderParameters, TurnstileSharedOptions> & {
  /** Every widget has a sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation. */
  sitekey?: string;
  /** Log level for browser logs. Can be debug, info, warn, or error. */
  logLevel?: LogLevel;
  /** Language to display. Must be either auto (default), a supported two-letter language code such as en, or a supported regional language code such as en-us. See https://developers.cloudflare.com/turnstile/reference/supported-languages/ */
  language?: Language;
};
