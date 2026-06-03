/* build: v1.15.0 */
import type {} from '@digdir/designsystemet-types';

// Augment types based on theme
declare module '@digdir/designsystemet-types' {
  export interface ColorDefinitions {
    accent: never;
    'main-color-2': never;
    brand1: never;
    brand2: never;
    brand3: never;
    'support-color-4': never;
    'support-color-5': never;
    'support-color-6': never;
    'support-color-7': never;
    'support-color-8': never;
    'support-color-9': never;
    'support-color-10': never;
    neutral: never;
  }
  export interface SeverityColorDefinitions {
    info: never;
    success: never;
    warning: never;
    danger: never;
  }
}
