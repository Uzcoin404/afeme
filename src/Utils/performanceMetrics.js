// Performance Timing and Profiling Utilities

export const performanceMetrics = {
  marks: {},

  // Mark a performance checkpoint
  mark(name) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
      this.marks[name] = Date.now();
    }
  },

  // Measure time between two marks
  measure(name, startMark, endMark) {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (e) {
        console.warn('Performance measure failed:', e);
      }
    }
  },

  // Get all marks
  getMarks() {
    if (typeof performance !== 'undefined') {
      return performance.getEntriesByType('mark');
    }
    return [];
  },

  // Get all measures
  getMeasures() {
    if (typeof performance !== 'undefined') {
      return performance.getEntriesByType('measure');
    }
    return [];
  },

  // Clear marks and measures
  clear() {
    if (typeof performance !== 'undefined') {
      performance.clearMarks();
      performance.clearMeasures();
    }
    this.marks = {};
  },

  // Log current performance metrics
  log() {
    const marks = this.getMarks();
    const measures = this.getMeasures();
    
    console.group('Performance Metrics');
    console.table(marks);
    console.table(measures);
    console.groupEnd();
  }
};

// Core Web Vitals tracking
export const trackCoreWebVitals = () => {
  if ('web-vital' in window) {
    const vital = window['web-vital'];
    console.log('Core Web Vitals:', vital);
  }
};

// Memory usage (Chrome only)
export const getMemoryUsage = () => {
  if (performance && performance.memory) {
    return {
      usedJSHeapSize: `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB`,
      totalJSHeapSize: `${Math.round(performance.memory.totalJSHeapSize / 1048576)} MB`,
      jsHeapSizeLimit: `${Math.round(performance.memory.jsHeapSizeLimit / 1048576)} MB`,
      percentageUsed: `${(performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(2)}%`
    };
  }
  return null;
};

// Track component render times in development
export const trackComponentRender = (componentName, startTime) => {
  if (process.env.NODE_ENV === 'development') {
    const renderTime = performance.now() - startTime;
    if (renderTime > 16.67) { // Warn if slower than 60fps
      console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }
  }
};
