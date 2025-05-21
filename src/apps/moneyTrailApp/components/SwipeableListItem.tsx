import React, { useContext, useEffect, useRef } from 'react';
import { SwipeableListContext } from './SwipeableList';
import { ActionButton, ActionButtonProps } from './ActionButton';
import { useSwipe } from '../hooks/useSwipe';

interface SwipeableListItemProps {
  id: string;
  children: React.ReactNode;
  actions: ActionButtonProps[];
  className?: string;
  maxSwipeDistance?: number;
}

export function SwipeableListItem({
  id,
  children,
  actions,
  className = '',
  maxSwipeDistance,
}: SwipeableListItemProps) {
  const { openItemId, setOpenItemId } = useContext(SwipeableListContext);
  const liRef = useRef<HTMLLIElement>(null);
  
  // Calculate the button width (60px per action)
  const actionWidth = 60;
  const totalActionWidth = actions.length * actionWidth;
  const actualMaxSwipeDistance = maxSwipeDistance || totalActionWidth;
  
  const {
    swipeHandlers,
    elementRef,
    swipeDistance,
    isOpen,
    resetSwipe,
  } = useSwipe({
    maxSwipeDistance: actualMaxSwipeDistance,
    onSwipeStateChange: (open) => {
      if (open) {
        setOpenItemId(id);
      } else if (openItemId === id) {
        setOpenItemId(null);
      }
    }
  });

  // Close this item if another item is opened
  useEffect(() => {
    if (openItemId !== null && openItemId !== id && isOpen) {
      resetSwipe();
    }
  }, [openItemId, id, isOpen, resetSwipe]);

  return (
    <li 
      className={`relative overflow-hidden bg-white ${className}`}
      ref={liRef}
    >
      {/* Main content container */}
      <div
        {...swipeHandlers}
        className="relative z-10 transform transition-transform touch-pan-y"
        style={{ 
          transform: `translateX(${swipeDistance}px)`,
          transition: swipeDistance === 0 || swipeDistance === -actualMaxSwipeDistance 
            ? 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            : 'none',
        }}
        ref={elementRef}
      >
        {children}
      </div>

      {/* Action buttons container */}
      <div 
        className="absolute top-0 right-0 bottom-0 flex h-full"
        style={{ width: `${totalActionWidth}px` }}
      >
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            {...action}
            style={{
              opacity: Math.min(1, Math.abs(swipeDistance) / 40),
              transform: `translateX(${Math.min(0, swipeDistance + totalActionWidth)}px)`,
            }}
            onClick={() => {
              action.onClick();
              resetSwipe();
            }}
          />
        ))}
      </div>
    </li>
  );
}