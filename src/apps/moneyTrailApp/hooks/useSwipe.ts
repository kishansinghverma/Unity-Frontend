import { useState, useRef, useEffect, useCallback } from 'react';

interface SwipeState {
  isSwiping: boolean;
  startX: number;
  distance: number;
}

interface UseSwipeProps {
  minSwipeDistance?: number;
  maxSwipeDistance?: number;
  closeOnOutsideClick?: boolean;
  onSwipeStateChange?: (isOpen: boolean) => void;
}

export function useSwipe({
  minSwipeDistance = 40,
  maxSwipeDistance = 120,
  closeOnOutsideClick = true,
  onSwipeStateChange,
}: UseSwipeProps = {}) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    startX: 0,
    distance: 0,
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks to close swipe actions
  useEffect(() => {
    if (!closeOnOutsideClick || !isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSwipeState(prev => ({ ...prev, distance: 0 }));
        if (onSwipeStateChange) onSwipeStateChange(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, closeOnOutsideClick, onSwipeStateChange]);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    setSwipeState({
      isSwiping: true,
      startX: clientX,
      distance: isOpen ? -maxSwipeDistance : 0, // If already open, start from open position
    });
  }, [isOpen, maxSwipeDistance]);

  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!swipeState.isSwiping) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - swipeState.startX;
    
    // Only allow left swipes (negative deltaX)
    const newDistance = isOpen 
      ? Math.min(0, Math.max(-maxSwipeDistance, -maxSwipeDistance + deltaX))
      : Math.min(0, Math.max(-maxSwipeDistance, deltaX));
    
    setSwipeState(prev => ({ ...prev, distance: newDistance }));
  }, [swipeState.isSwiping, swipeState.startX, isOpen, maxSwipeDistance]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isSwiping) return;
    
    // Determine if the swipe should complete or revert
    const isSignificantSwipe = Math.abs(swipeState.distance) >= minSwipeDistance;
    const newIsOpen = isSignificantSwipe ? swipeState.distance < 0 : isOpen;
    
    setIsOpen(newIsOpen);
    setSwipeState({
      isSwiping: false,
      startX: 0,
      distance: newIsOpen ? -maxSwipeDistance : 0,
    });
    
    if (onSwipeStateChange && newIsOpen !== isOpen) {
      onSwipeStateChange(newIsOpen);
    }
  }, [swipeState.isSwiping, swipeState.distance, isOpen, minSwipeDistance, maxSwipeDistance, onSwipeStateChange]);

  const resetSwipe = useCallback(() => {
    setIsOpen(false);
    setSwipeState({
      isSwiping: false,
      startX: 0,
      distance: 0,
    });
    if (onSwipeStateChange) onSwipeStateChange(false);
  }, [onSwipeStateChange]);

  return {
    swipeHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleTouchStart,
      onMouseMove: handleTouchMove,
      onMouseUp: handleTouchEnd,
      onMouseLeave: handleTouchEnd,
    },
    elementRef,
    swipeDistance: swipeState.distance,
    isOpen,
    resetSwipe,
  };
}
