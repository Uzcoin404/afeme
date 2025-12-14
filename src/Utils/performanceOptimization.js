// Performance monitoring utility
export const reportWebVitals = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Metric:', metric);
  }
};

// Lazy load analytics and third-party scripts
export const loadScriptAsync = (src, options = {}) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    
    if (options.defer) script.defer = true;
    if (options.id) script.id = options.id;
    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
      });
    }
    
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.head.appendChild(script);
  });
};

// Prefetch DNS for external domains
export const prefetchDns = (domain) => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = `//${domain}`;
  document.head.appendChild(link);
};

// Preconnect to external origins
export const preconnect = (url, crossorigin = false) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  if (crossorigin) link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};
