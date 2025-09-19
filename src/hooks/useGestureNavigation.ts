import { useState, useCallback, useRef } from 'react';

interface GestureNavigationResult {
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  indicators: {
    showLeft: boolean;
    showRight: boolean;
  };
  resetIndicators: () => void;
}

interface GestureNavigationConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minSwipeDistance?: number;
  maxVerticalDeviation?: number;
  indicatorTimeout?: number;
}

export const useGestureNavigation = (
  config: GestureNavigationConfig = {}
): GestureNavigationResult => {
  const {
    onSwipeLeft,
    onSwipeRight,
    minSwipeDistance = 50,
    maxVerticalDeviation = 50,
    indicatorTimeout = 1000,
  } = config;

  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetIndicators = useCallback(() => {
    setShowLeftIndicator(false);
    setShowRightIndicator(false);
    if (indicatorTimeoutRef.current) {
      clearTimeout(indicatorTimeoutRef.current);
      indicatorTimeoutRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    resetIndicators();
    
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    touchEndRef.current = null;
  }, [resetIndicators]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    
    // Check if horizontal swipe (ignore vertical movements)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaY) < maxVerticalDeviation) {
      // Show swipe indicators based on direction
      if (deltaX > minSwipeDistance / 2) {
        setShowRightIndicator(true);
        setShowLeftIndicator(false);
      } else if (deltaX < -minSwipeDistance / 2) {
        setShowLeftIndicator(true);
        setShowRightIndicator(false);
      }
    }
  }, [minSwipeDistance, maxVerticalDeviation]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const startX = touchStartRef.current.x;
    const endX = touchEndRef.current.x;
    const endY = touchEndRef.current.y;
    
    const deltaX = endX - startX;
    const deltaY = endY - touchStartRef.current.y;

    // Check if it's a valid horizontal swipe
    if (
      Math.abs(deltaX) > minSwipeDistance &&
      Math.abs(deltaY) < maxVerticalDeviation
    ) {
      // Trigger swipe actions
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Auto-hide indicators after timeout
    if (indicatorTimeoutRef.current) {
      clearTimeout(indicatorTimeoutRef.current);
    }
    
    indicatorTimeoutRef.current = setTimeout(() => {
      resetIndicators();
    }, indicatorTimeout);

    // Reset touch references
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [minSwipeDistance, maxVerticalDeviation, onSwipeLeft, onSwipeRight, indicatorTimeout, resetIndicators]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    indicators: {
      showLeft: showLeftIndicator,
      showRight: showRightIndicator,
    },
    resetIndicators,
  };
};