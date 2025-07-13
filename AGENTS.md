# Agent instructions

This repository packages a Vue 3.5 component for distribution on NPM. It is intended to be used by a very large audience and must follow Vue and TypeScript best practices. Type safety must be strict and **no `any` type** declarations are allowed. Resolve all build warnings before committing code.

## Prohibited files

The following files must never be modified by the agent:

- `src/TurnstileWidget.vue`
- `src/types.ts`

These files define the core component and its public types. Do not alter them under any circumstances.
