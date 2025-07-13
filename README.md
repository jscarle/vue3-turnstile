# vue3-turnstile

A Vue 3 TypeScript Component for Cloudflare's Turnstile

## Installation

```bash
npm install @jscarle/vue3-turnstile
```

## Usage

```ts
<script setup lang="ts">
import { TurnstileWidget } from '@jscarle/vue3-turnstile'
</script>

<template>
  <TurnstileWidget v-model="token" sitekey="your-site-key" />
</template>
```

Run `npm run build` to generate the library and type definitions. Tests can be executed with `npm test`.
