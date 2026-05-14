import { useEffect, useRef, useState } from 'react';
import { SwipeableContentProps } from '../../../../../../engine/contracts/props';

const ACTION_WIDTH = 80;
const OPEN_THRESHOLD = -50;
const CLICK_EPSILON = 6;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const SwipeableContent = ({
  id,
  isOpen,
  onOpen,
  onClick,
  children,
}: SwipeableContentProps) => {
  const pointerStartX = useRef(0);
  const dragStartX = useRef(0);
  const activePointerId = useRef<number | null>(null);
  const wasDragged = useRef(false);
  const offsetRef = useRef(isOpen ? -ACTION_WIDTH : 0);
  const [offsetX, setOffsetX] = useState(isOpen ? -ACTION_WIDTH : 0);
  const [isDragging, setIsDragging] = useState(false);

  const updateOffset = (value: number) => {
    offsetRef.current = value;
    setOffsetX(value);
  };

  useEffect(() => {
    if (!isDragging) updateOffset(isOpen ? -ACTION_WIDTH : 0);
  }, [isDragging, isOpen]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    activePointerId.current = event.pointerId;
    pointerStartX.current = event.clientX;
    dragStartX.current = offsetRef.current;
    wasDragged.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;

    const deltaX = event.clientX - pointerStartX.current;
    if (Math.abs(deltaX) > CLICK_EPSILON) wasDragged.current = true;

    updateOffset(clamp(dragStartX.current + deltaX, -ACTION_WIDTH, 0));
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;

    activePointerId.current = null;
    setIsDragging(false);

    if (offsetRef.current < OPEN_THRESHOLD) {
      updateOffset(-ACTION_WIDTH);
      onOpen(id);
    } else {
      updateOffset(0);
      onOpen(null);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClick = () => {
    if (wasDragged.current) return;
    onClick();
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClick={handleClick}
      style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
      className={`relative z-10 touch-pan-y bg-white text-sm font-semibold group flex items-center justify-between p-3 sm:px-6 hover:bg-gray-50 cursor-pointer will-change-transform ${isDragging ? '' : 'transition-transform duration-200 ease-out'}`}
    >
      {children}
    </div>
  );
};
