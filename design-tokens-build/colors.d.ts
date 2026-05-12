/* This file is deprecated and will be removed in a future release. Use types.d.ts instead */
/* build: v0.0.0-deps-tsdown-20260421103939 */
import type {} from '@digdir/designsystemet-types';

// Augment types based on theme
declare module '@digdir/designsystemet-types' {
  export interface ColorDefinitions {
    primary: never;
    accent: never;
    extra1: never;
    extra2: never;
    neutral: never;
  }
  export interface SeverityColorDefinitions {
    info: never;
    success: never;
    warning: never;
    danger: never;
  }
}
