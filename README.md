# vue3-turnstile

A Vue 3.5 TypeScript component for Cloudflare's Turnstile.

Requires **Vue 3.5** or later and **@unhead/vue 2.0.12** or later.

[![CI](https://github.com/jscarle/vue3-turnstile/actions/workflows/ci.yml/badge.svg)](https://github.com/jscarle/vue3-turnstile/actions/workflows/ci.yml)

## Overview

`vue3-turnstile` wraps the [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) widget in a strongly typed Vue component. It exposes the Turnstile API methods as component methods and can be configured via props, plugin defaults, or environment variables.

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

The plugin accepts global default options which are applied to every
`<TurnstileWidget />` instance:

```ts
createApp(App).use(TurnstilePlugin, {
  sitekey: 'your-site-key',
  logLevel: 'debug',
})
```

## Component props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sitekey` | `string` | Always passes test key | Cloudflare Turnstile site key |
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

- `success(response: string)` – challenge solved successfully.
- `error(error: string)` – a runtime error occurred.
- `expired` – token expired.
- `unsupported` – browser is unsupported.
- `timeout` – interactive challenge timed out.
- `failed(error: unknown)` – failed to load the widget.

## Configuration via Environment Variables

When a prop is omitted, its value can be supplied through Vite environment variables. The component reads the following variables:

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

## License

This project is licensed under the [MIT License](LICENSE).
