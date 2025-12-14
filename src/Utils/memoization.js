// Memoization utility for expensive operations
const memoCache = new Map();

export const memoize = (fn, keyGenerator = (...args) => JSON.stringify(args)) => {
  return function memoized(...args) {
    const key = keyGenerator(...args);
    
    if (memoCache.has(key)) {
      return memoCache.get(key);
    }
    
    const result = fn(...args);
    memoCache.set(key, result);
    
    // Clear cache if it gets too large
    if (memoCache.size > 100) {
      const firstKey = memoCache.keys().next().value;
      memoCache.delete(firstKey);
    }
    
    return result;
  };
};

// Debounce utility for event handlers
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for performance-critical operations
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Batch DOM updates
export const batchDOM = (callback) => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
};
