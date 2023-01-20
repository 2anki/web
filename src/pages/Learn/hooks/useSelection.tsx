import { useEffect } from 'react';

export const useSelection = (selectionHandler: (selection: string) => void) => {
  useEffect(() => {
    const selectionChange = () => {
      const text = document.getSelection()?.toString();
      selectionHandler(text?.trim() ?? '');
    };
    document.addEventListener('selectionchange', selectionChange);
    return () =>
      document.removeEventListener('selectionchange', selectionChange);
  }, [selectionHandler]);
};
