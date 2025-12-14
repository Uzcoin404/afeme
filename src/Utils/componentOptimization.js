import React from 'react';

// Higher Order Component for memoization with custom comparison
export const withMemo = (Component, arePropsEqual) => {
  const MemoizedComponent = React.memo(Component, arePropsEqual);
  MemoizedComponent.displayName = `withMemo(${Component.displayName || Component.name || 'Component'})`;
  return MemoizedComponent;
};

// Hook for useCallback wrapper with dependencies
export const useOptimizedCallback = (callback, deps) => {
  return React.useCallback(callback, deps);
};

// Hook for useMemo wrapper with dependencies
export const useOptimizedMemo = (factory, deps) => {
  return React.useMemo(factory, deps);
};
