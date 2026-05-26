import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';

type HeaderSlotContextValue = {
  setContent: (owner: symbol, content: ReactNode | null) => void;
  clearContent: (owner: symbol) => void;
};

export const HeaderSlotContext = createContext<HeaderSlotContextValue | null>(null);

const useHeaderSlot = () => {
  const context = useContext(HeaderSlotContext);
  if (!context) {
    throw new Error('useHeaderContent must be used within AppShell/HeaderSlotContext');
  }
  return context;
};

export const useHeaderContent = (content: ReactNode | null) => {
  const slot = useHeaderSlot();
  const owner = useMemo(() => Symbol('header-content-owner'), []);

  useEffect(() => {
    slot.setContent(owner, content);
    return () => slot.clearContent(owner);
  }, [content, owner, slot]);
};

