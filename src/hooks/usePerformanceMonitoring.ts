import { useCallback, useEffect,useRef } from 'react';

import { PerformanceMetrics } from '../types';

interface UsePerformanceMonitoringOptions {
  enableLogging?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceMonitoring = ({
  enableLogging = __DEV__,
  onMetricsUpdate,
}: UsePerformanceMonitoringOptions = {}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: Date.now(),
  });

  const startAnimation = useCallback(
    (animationName?: string) => {
      const startTime = Date.now();
      metricsRef.current.animationStartTime = startTime;

      if (enableLogging) {
        console.log(
          `[AnimatedNumber] Animation started: ${animationName || 'unknown'}`,
          startTime,
        );
      }

      return startTime;
    },
    [enableLogging],
  );

  const endAnimation = useCallback(
    (animationName?: string) => {
      const endTime = Date.now();
      const startTime = metricsRef.current.animationStartTime;
      metricsRef.current.animationEndTime = endTime;

      if (startTime && enableLogging) {
        const duration = endTime - startTime;
        console.log(
          `[AnimatedNumber] Animation completed: ${animationName || 'unknown'}`,
          {
            duration: `${duration}ms`,
            startTime,
            endTime,
          },
        );
      }

      return endTime;
    },
    [enableLogging],
  );

  const trackRender = useCallback(() => {
    const renderTime = Date.now();
    metricsRef.current.renderCount += 1;
    metricsRef.current.lastRenderTime = renderTime;

    if (enableLogging && metricsRef.current.renderCount % 10 === 0) {
      console.log(
        `[AnimatedNumber] Render count: ${metricsRef.current.renderCount}`,
      );
    }

    onMetricsUpdate?.(metricsRef.current);
  }, [enableLogging, onMetricsUpdate]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      lastRenderTime: Date.now(),
    };
  }, []);

  // Track render on every hook call
  useEffect(() => {
    trackRender();
  });

  return {
    startAnimation,
    endAnimation,
    trackRender,
    getMetrics,
    resetMetrics,
  };
};
