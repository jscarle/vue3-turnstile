export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

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

export const TESTING_SITEKEY = '1x00000000000000000000AA';

import type { RenderParameters } from './turnstile.ts';

export type TurnstileSharedOptions =
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

export type TurnstileProps = Pick<RenderParameters, TurnstileSharedOptions> & {
  /** Every widget has a sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation. */
  sitekey?: string;
  /** Log level for browser logs. Can be debug, info, warn, or error. */
  logLevel?: LogLevel;
  /** Language to display. Must be either: auto (default) to use the language that the visitor has chosen, or an ISO 639-1 two-letter language code (e.g. en) or language and country code (e.g. en-US). See https://developers.cloudflare.com/turnstile/reference/supported-languages/ */
  language?: Language;
};

