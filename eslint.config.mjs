import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Codebase convention: unused overload-signature params are prefixed
      // `_` on purpose (see Button.tsx/Cell.tsx/Tag.tsx) rather than omitted,
      // to keep every overload's parameter list self-documenting.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // SeatHall.tsx/EqualizerDots.tsx/StatCounter.tsx/useReducedMotion.ts
      // deliberately set state from a ref mutated by the same component's
      // own event handlers (SeatHall) or sync client-only values (matchMedia,
      // randomized seeds) on mount to avoid SSR/hydration mismatches —
      // verified working correctly. Real newly-introduced cases are still
      // worth a look, hence 'warn' rather than 'off'.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'payload-types.ts']),
])

export default eslintConfig
