// Export all optimization utilities for easy access

// Hooks
export { useFetch, useLazyFetch } from './useFetch';
export { useIntersectionObserver, useLazyLoad } from './useIntersectionObserver';
export { useDebounce, useThrottle, useDebouncedCallback } from './useDebounceThrottle';

// Utils
export { 
  memoize, 
  debounce, 
  throttle, 
  batchDOM 
} from '../Utils/memoization';

export {
  loadScriptAsync,
  prefetchDns,
  preconnect,
  reportWebVitals
} from '../Utils/performanceOptimization';

export {
  performanceMetrics,
  trackCoreWebVitals,
  getMemoryUsage,
  trackComponentRender
} from '../Utils/performanceMetrics';

export {
  withMemo,
  useOptimizedCallback,
  useOptimizedMemo
} from '../Utils/componentOptimization';

// Components
export { default as OptimizedImage } from '../Components/OptimizedImage/OptimizedImage';
export { default as ErrorBoundary } from '../Components/ErrorBoundary/ErrorBoundary';

// Utilities
export { default as useResize } from '../Utils/elementDimension';
export { default as useWindowDimensions } from '../Utils/windowDimension';
