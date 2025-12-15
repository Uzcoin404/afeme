# Quick Reference - Frontend Optimizations

## Import Optimization Utilities

```javascript
// All-in-one import
import {
  useFetch,
  useLazyLoad,
  useDebounce,
  useThrottle,
  useDebouncedCallback,
  withMemo,
  OptimizedImage,
  ErrorBoundary,
  performanceMetrics,
  memoize,
  debounce,
  throttle,
  batchDOM
} from './Hooks';
```

---

## Common Usage Patterns

### 1. Lazy Load Images
```javascript
import OptimizedImage from './Components/OptimizedImage/OptimizedImage';

<OptimizedImage 
  src="image.jpg" 
  alt="Description"
  width="300"
  height="200"
/>
```

### 2. Fetch Data Efficiently
```javascript
import { useFetch } from './Hooks';

const { data, loading, error } = useFetch('/api/users');

// Or lazy load
const { data, loading, fetch } = useLazyFetch('/api/data');
useEffect(() => fetch(), [fetch]);
```

### 3. Memoize Component
```javascript
import { withMemo } from './Hooks';

const MyComponent = ({ user }) => <div>{user.name}</div>;

export default withMemo(MyComponent, (prev, next) => 
  prev.user.id === next.user.id
);
```

### 4. Debounce Search
```javascript
import { useDebouncedCallback } from './Hooks';

const handleSearch = useDebouncedCallback((query) => {
  fetchResults(query);
}, 300);
```

### 5. Throttle Scroll
```javascript
import { useThrottle } from './Hooks';

const handleScroll = useThrottle(() => {
  // Update scroll position
}, 200);

useEffect(() => {
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [handleScroll]);
```

### 6. Lazy Load on Scroll
```javascript
import { useLazyLoad } from './Hooks';

const [ref, isVisible] = useLazyLoad(0.1);

return (
  <div ref={ref}>
    {isVisible && <HeavyComponent />}
  </div>
);
```

### 7. Debounce Value
```javascript
import { useDebounce } from './Hooks';

const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  // API call with debouncedSearchTerm
}, [debouncedSearchTerm]);
```

### 8. Memoize Function Results
```javascript
import { memoize } from './Hooks';

const expensiveCalculation = memoize((x, y) => {
  return x * y * Math.random();
});

// Results are cached
expensiveCalculation(2, 3); // Calculated
expensiveCalculation(2, 3); // Cached
```

---

## Performance Monitoring

```javascript
import { performanceMetrics, getMemoryUsage } from './Hooks';

// Mark performance checkpoints
performanceMetrics.mark('route-start');
// ... code ...
performanceMetrics.mark('route-end');
performanceMetrics.measure('route', 'route-start', 'route-end');

// Check memory usage
console.log(getMemoryUsage());

// Log all metrics
performanceMetrics.log();
```

---

## Environment Variables

```bash
# Development (.env)
REACT_APP_API_URL="https://afeme.ddev.site/api/"

# Production (.env.production)
REACT_APP_API_URL="https://api.production.com/"
GENERATE_SOURCEMAP=false
CI=false
```

---

## Build Commands

```bash
# Development with hot reload
pnpm start

# Production build (optimized)
pnpm build

# Analyze bundle size
pnpm analyze

# Run tests
pnpm test
```

---

## Performance Checklist

When optimizing components:

- [ ] Use `withMemo` for components with expensive renders
- [ ] Use `useDebouncedCallback` for search/filter inputs
- [ ] Use `useThrottle` for scroll/resize events
- [ ] Use `useFetch` instead of raw fetch
- [ ] Use `OptimizedImage` for all images
- [ ] Wrap heavy sections with `useLazyLoad`
- [ ] Check with DevTools Profiler
- [ ] Monitor bundle size regularly

---

## Troubleshooting

**Q: Component still re-renders too often?**
A: Check parent component - may need `useMemo` or `useCallback` there.

**Q: Image not lazy loading?**
A: Ensure using `OptimizedImage` component, not `<img>` tag.

**Q: Memory leak warnings?**
A: Ensure `useFetch` cleanup is working and event listeners are removed.

**Q: Build is slow?**
A: Check that GENERATE_SOURCEMAP=false is set in .env

---

## Resources

- [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) - Detailed implementation guide
- [OPTIMIZATION_COMPLETE.md](./OPTIMIZATION_COMPLETE.md) - Full feature list
- React DevTools Profiler - Analyze render performance
- Lighthouse - Measure Core Web Vitals
