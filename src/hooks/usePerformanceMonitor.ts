import { useRef, useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  sortTime: number;
  renderCount: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const metrics = useRef<PerformanceMetrics>({
    renderTime: 0,
    sortTime: 0,
    renderCount: 0
  });

  const startTime = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();

    return () => {
      const endTime = performance.now();
      metrics.current.renderTime += endTime - startTime.current;
      metrics.current.renderCount++;

      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} Performance Metrics:`, {
          averageRenderTime: metrics.current.renderTime / metrics.current.renderCount,
          totalRenderTime: metrics.current.renderTime,
          renderCount: metrics.current.renderCount,
          lastRenderTime: endTime - startTime.current
        });
      }
    };
  });

  const measureOperation = (operation: () => void, operationType: 'sort' | 'other') => {
    const start = performance.now();
    operation();
    const end = performance.now();

    if (operationType === 'sort') {
      metrics.current.sortTime += end - start;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`${operationType} operation took:`, end - start, 'ms');
    }
  };

  return measureOperation;
};
