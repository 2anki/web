import { useRef, useCallback } from 'react';

/**
 * A hook for efficiently rendering large lists by only rendering items that are visible in the viewport.
 * This is a simplified implementation for the Ki interface.
 */
export const useVirtualScroller = (containerRef: React.RefObject<HTMLElement>): { addItem: (initialHeight: number) => number; reset: () => void } => {
  const totalHeightRef = useRef(0);
  const itemCountRef = useRef(0);

  /**
   * Add a new item to the virtual scroller
   * @param initialHeight Initial height of the item in pixels
   * @returns The index of the added item
   */
  const addItem = useCallback((initialHeight: number): number => {
    const index = itemCountRef.current;
    itemCountRef.current += 1;
    
    // Update total height
    totalHeightRef.current += initialHeight;
    
    // Update container height if available
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.height = `${totalHeightRef.current}px`;
    }
    
    return index;
  }, [containerRef]);

  /**
   * Reset the virtual scroller
   */
  const reset = useCallback(() => {
    itemCountRef.current = 0;
    totalHeightRef.current = 0;
    
    // Update container height if available
    if (containerRef.current) {
      const container = containerRef.current;
      container.style.height = '0px';
    }
  }, [containerRef]);
  
  return {
    addItem,
    reset
  };
};
