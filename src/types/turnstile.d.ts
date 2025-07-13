/**
 * The theme of the Turnstile widget.
 * The default is "auto", which respects the user preference.
 * This can be forced to "light" or "dark" by setting the theme accordingly.
 */
export type Theme = 'auto' | 'light' | 'dark';

/**
 * The widget size.
 * Can take the following values: normal, compact, flexible.
 */
export type WidgetSize = 'normal' | 'compact' | 'flexible';

/**
 * How to retry on widget failure.
 * The default is "auto", which allows the user to retry.
 * This can be forced to "never" by the user.
 */
export type FailureRetryMode = 'never' | 'auto';

/**
 * The appearance mode of the Turnstile widget.
 * The default is "always". If set to "execute", the widget will only appear when executing.
 * If set to "interaction-only", the widget will only be shown when / if interactivity is required.
 */
export type AppearanceMode = 'always' | 'execute' | 'interaction-only';

/**
 * The refresh mode to use when the given Turnstile token expires.
 * The default is "auto". "never" will never refresh the widget, "manual" will prompt the user with a refresh button.
 */
export type RefreshExpiredMode = 'never' | 'manual' | 'auto';

/**
 * The refresh mode to use when the widget times out.
 * The default is "auto". "never" will never refresh the widget, "manual" will prompt the user with a refresh button.
 */
export type RefreshTimeoutMode = 'never' | 'manual' | 'auto';

/**
 * The execution mode to control when to obtain the widget token.
 * The default is "render". "render" will make the challenge run automatically after calling the render() function,
 * while "execute" will make the challenge run after the render() function has been called, by invoking turnstile.execute separately.
 * This detaches the appearance and rendering of a widget from its execution.
 */
export type ExecutionMode = 'render' | 'execute';

/**
 * Parameters for the turnstile.render() method.
 */
export interface RenderParameters {
  /**
   * Your Cloudflare Turnstile sitekey. This sitekey is associated with the corresponding widget configuration and is created upon the widget creation.
   */
  sitekey: string;

  /**
   * Optional. A customer value that can be used to differentiate widgets under the same sitekey in analytics and which is returned upon validation.
   * This value may contain up to 32 alphanumeric characters including `_` and `-`.
   */
  action?: string;

  /**
   * Optional. A customer payload that can be used to attach customer data to the challenge throughout its issuance and which is returned upon validation.
   * This value may contain up to 255 alphanumeric characters including `_` and `-`.
   */
  cData?: string;

  /**
   * Optional. A JavaScript callback that is invoked upon success of the challenge.
   * The callback is passed a token that can be validated.
   */
  callback?: (token: string) => void;

  /**
   * Optional. A JavaScript callback invoked when the token expires.
   * The widget will not reset when this callback is triggered.
   */
  'expired-callback'?: (token: string) => void;

  /**
   * Optional. A JavaScript callback invoked when there is an error (e.g. network error or the challenge failed).
   * Refer to [Client-side errors](https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/).
   */
  'error-callback'?: (error: string) => void;

  /**
   * Optional. A JavaScript callback invoked when the challenge presents an interactive challenge but was not solved within a given time.
   * The callback should reset the widget so the visitor can try again.
   */
  'timeout-callback'?: () => void;

  /**
   * Optional. A JavaScript callback invoked before the challenge enters interactive mode.
   */
  'before-interactive-callback'?: () => void;

  /**
   * Optional. A JavaScript callback invoked when challenge has left interactive mode.
   */
  'after-interactive-callback'?: () => void;

  /**
   * Optional. A JavaScript callback invoked when a given client or browser is not supported by Turnstile.
   */
  'unsupported-callback'?: () => void;

  /**
   * Optional. The widget theme.
   * Can be `light`, `dark`, or `auto`.
   * The default is `auto`, which respects the user's preference.
   */
  theme?: Theme;

  /**
   * Optional. The tabindex of Turnstile’s iframe for accessibility purposes.
   * @default 0
   */
  tabindex?: number;

  /**
   * Optional. The size of the Turnstile widget.
   * Accepted values: "normal", "compact", "flexible"
   * @default "normal"
   */
  size?: WidgetSize;

  /**
   * Optional. Controls whether the widget should automatically retry obtaining a token if it fails.
   * The default `auto` will retry automatically; set to `never` to disable.
   */
  retry?: FailureRetryMode;

  /**
   * Optional. Time between retry attempts when `retry` is `auto`, in milliseconds.
   * Must be a positive integer less than 900000.
   * @default 8000
   */
  'retry-interval'?: number;

  /**
   * Optional. Language to display.
   * Must be `auto` (default) to use the visitor's language, or an ISO 639-1 code such as `en` or `en-US`.
   */
  language?: string;

  /**
   * Optional. Controls when the widget is visible.
   * Can be `always` (default), `execute`, or `interaction-only`.
   */
  appearance?: AppearanceMode;

  /**
   * Optional. Controls creation of a hidden input element containing the response token.
   * @default true
   */
  'response-field'?: boolean;

  /**
   * Optional. Name of the hidden response input element.
   * @default "cf-turnstile-response"
   */
  'response-field-name'?: string;

  /**
   * Optional. Automatically refreshes the token when it expires.
   * Can be `auto`, `manual`, or `never`.
   * @default "auto"
   */
  'refresh-expired'?: RefreshExpiredMode;

  /**
   * Optional. Controls widget refresh behavior on interactive challenge timeout.
   * Can be `auto`, `manual`, or `never`.
   * @default "auto"
   */
  'refresh-timeout'?: RefreshTimeoutMode;

  /**
   * Optional. Allows Cloudflare to gather visitor feedback upon widget failure.
   * @default true
   */
  'feedback-enabled'?: boolean;

  /**
   * Optional. Controls when to obtain the token of the widget.
   * Can be `render` (default) or `execute`.
   */
  execution?: ExecutionMode;
}

/**
 * The main Turnstile API interface.
 */
export interface Turnstile {
  /**
   * Registers a callback to be invoked when the turnstile is ready.
   * @param callback A callback function to be executed when the turnstile is ready. Use this callback to perform actions upon turnstile readiness.
   */
  ready(callback: () => void): void;

  /**
   * Invokes a Turnstile widget and returns the ID of the newly created widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @param params An object containing render parameters as key=value pairs, for example, {"sitekey": "your_site_key", "theme": "auto"}.
   * @return the ID of the newly created widget, or undefined if invocation is unsuccessful.
   */
  render(container: string | HTMLElement, params?: RenderParameters): string | null | undefined;

  /**
   * Invokes a Turnstile widget and returns the ID of the newly created widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @param params An object containing render parameters as key=value pairs, for example, {"sitekey": "your_site_key", "theme": "auto"}.
   * @return the ID of the newly created widget, or undefined if invocation is unsuccessful.
   */
  execute(container: string | HTMLElement, params?: RenderParameters): void;

  /**
   * Resets a Turnstile widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   */
  reset(container?: string | HTMLElement): void;

  /**
   * Fully removes the Turnstile widget from the DOM.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   */
  remove(container?: string | HTMLElement): void;

  /**
   * Gets the response of a Turnstile widget.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @return the response of the Turnstile widget.
   */
  getResponse(container?: string | HTMLElement): string | undefined;

  /**
   * Checks whether or not the token returned by the given widget is expired.
   * @param container The HTML element to render the Turnstile widget into. Specify either the ID of HTML element (string), or the DOM element itself.
   * @return whether it is expired or not
   */
  isExpired(container?: string | HTMLElement): boolean;
}

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

