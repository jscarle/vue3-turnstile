# vue3-turnstile

A Vue 3.5 TypeScript component for Cloudflare's Turnstile.

[![CI](https://github.com/jscarle/vue3-turnstile/actions/workflows/ci.yml/badge.svg)](https://github.com/jscarle/vue3-turnstile/actions/workflows/ci.yml)

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
