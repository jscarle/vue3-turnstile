# vue3-turnstile

A Vue 3.5 TypeScript component for Cloudflare's Turnstile.

Requires **Vue 3.5** or later and **@unhead/vue 2.0.12** or later.

[![CI](https://github.com/jscarle/vue3-turnstile/actions/workflows/ci.yml/badge.svg)](https://github.com/jscarle/vue3-turnstile/actions/workflows/ci.yml)

## Overview

`vue3-turnstile` wraps the [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget in a strongly typed Vue component. It exposes the Turnstile API methods as component methods and can be configured via component props, environment variables, or plugin defaults. Configuration values are resolved in that order of priority.

## Installation

```bash
npm install @jscarle/vue3-turnstile
```

## Usage

### Component usage

```vue
<script setup lang="ts">
import { TurnstileWidget } from '@jscarle/vue3-turnstile'
const token = ref<string | null>(null)
</script>

<template>
  <TurnstileWidget v-model="token" sitekey="your-site-key" />
</template>
```

### Registering globally

To make `<TurnstileWidget />` available in all components:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { TurnstilePlugin } from '@jscarle/vue3-turnstile'

createApp(App).use(TurnstilePlugin).mount('#app')
```

`TurnstilePlugin` installs the `TurnstileWidget` component globally and injects
default options for all widget props. Environment variables override these
plugin options, and component props take priority over both. Options therefore
serve as fallbacks when neither props nor Vite environment variables provide a
value for a `<TurnstileWidget />` instance:

```ts
createApp(App).use(TurnstilePlugin, {
  sitekey: 'your-site-key',
  logLevel: 'debug',
})
```

### Customization

Global defaults passed to the plugin apply to every widget, but are overridden by
environment variables. Component props take precedence over both. If an option
is omitted, the component falls back to Vite environment variables, allowing
configuration per deployment:

```env
VITE_TURNSTILE_SITEKEY=your-site-key
VITE_TURNSTILE_THEME=light
```

## Component props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sitekey` | `string` | Test key that always passes | Cloudflare Turnstile site key |
| `action` | `string` | - | Widget analytics action name |
| `cData` | `string` | - | Custom payload returned on validation |
| `logLevel` | `'debug' \| 'info' \| 'warn' \| 'error'` | `info` | Browser log level |
| `language` | `Language` | `auto` | Widget language |
| `theme` | `'auto' \| 'light' \| 'dark'` | `auto` | Widget theme |
| `tabindex` | `number` | `0` | iframe tabindex |
| `size` | `'normal' \| 'compact' \| 'flexible'` | `normal` | Widget size |
| `retry` | `'never' \| 'auto'` | `auto` | Automatically retry on failure |
| `retry-interval` | `number` | `8000` | Milliseconds between retries |
| `appearance` | `'always' \| 'execute' \| 'interaction-only'` | `always` | When the widget is visible |
| `refresh-expired` | `'never' \| 'manual' \| 'auto'` | `auto` | Refresh behavior when token expires |
| `refresh-timeout` | `'never' \| 'manual' \| 'auto'` | `auto` | Refresh behavior on timeout |
| `execution` | `'render' \| 'execute'` | `render` | When to obtain the widget token |
| `feedback-enabled` | `boolean` | `true` | Allow Cloudflare feedback |

### Events

The component emits the following events:

- `success(response: string)` – emitted when the visitor solves the challenge.
  The returned token is also available via `v-model` and should be sent to
  Cloudflare for verification.
- `error(error: string)` – emitted when a runtime error occurs while obtaining a
  token.
- `expired` – emitted when the token is no longer valid but the widget has not
  been reset.
- `unsupported` – emitted if the visitor's browser is unsupported by
  Cloudflare Turnstile.
- `timeout` – emitted when the interactive challenge was not solved in time.
- `failed(error: unknown)` – emitted if loading the widget fails entirely.

Use these events to react to the widget state and handle failures gracefully.

```vue
<script setup lang="ts">
function onSolved(token: string) {
  // send token to your server
}

function onError(message: string) {
  console.error(message)
}
</script>

<template>
  <TurnstileWidget
    @success="onSolved"
    @error="onError"
    @expired="() => console.log('expired')"
    @timeout="() => console.log('timeout')"
    @failed="err => console.error('load failed', err)"
  />
</template>
```

### Environment variables
When a prop is omitted, its value can be supplied through Vite environment variables.
The component reads the following variables:

- `VITE_TURNSTILE_SITEKEY`
- `VITE_TURNSTILE_LOGLEVEL`
- `VITE_TURNSTILE_THEME`
- `VITE_TURNSTILE_LANGUAGE`
- `VITE_TURNSTILE_TABINDEX`
- `VITE_TURNSTILE_SIZE`
- `VITE_TURNSTILE_RETRY`
- `VITE_TURNSTILE_RETRY_INTERVAL`
- `VITE_TURNSTILE_REFRESH_EXPIRED`
- `VITE_TURNSTILE_REFRESH_TIMEOUT`
- `VITE_TURNSTILE_APPEARANCE`
- `VITE_TURNSTILE_FEEDBACK_ENABLED`
- `VITE_TURNSTILE_EXECUTION`

Example `.env`:

```env
VITE_TURNSTILE_SITEKEY=your-site-key
VITE_TURNSTILE_LOGLEVEL=debug
VITE_TURNSTILE_THEME=light
```

## Token Verification

Validate the response token on your server by sending it to Cloudflare's [`siteverify` endpoint](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/):

```ts
const params = new URLSearchParams()
params.append('secret', 'your-secret-key')
params.append('response', token)

const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
  method: 'POST',
  body: params,
})
  .then(r => r.json())

if (!result.success) {
  // token is invalid
}
```

Tokens must be validated within 300 seconds and cannot be reused.

## Contributing

Issues and pull requests are welcome. Feel free to open a ticket if you discover
an issue or have a feature request.

## License

This project is licensed under the [MIT License](LICENSE.md).
