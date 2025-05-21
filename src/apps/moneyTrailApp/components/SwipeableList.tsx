import React, { createContext, useState } from 'react';
import { SwipeableListItem } from './SwipeableListItem';

// Create a context to manage which item is currently open
type SwipeableListContextType = {
  openItemId: string | null;
  setOpenItemId: (id: string | null) => void;
};

export const SwipeableListContext = createContext<SwipeableListContextType>({
  openItemId: null,
  setOpenItemId: () => {},
});

interface SwipeableListProps {
  children: React.ReactNode;
  className?: string;
}

export function SwipeableList({ children, className = '' }: SwipeableListProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  return (
    <SwipeableListContext.Provider
      value={{ openItemId, setOpenItemId }}
    >
      <ul className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
        {children}
      </ul>
    </SwipeableListContext.Provider>
  );
}

// Export the item component from the main file for easier imports
SwipeableList.Item = SwipeableListItem;