import { useState, useCallback } from 'react';

export const useLayoutManager = () => {
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [isSplitScreen, setIsSplitScreen] = useState(false);

  const toggleSplitScreen = useCallback(() =>
    setIsSplitScreen(prev => !prev), []);

  return { layout, setLayout, isSplitScreen, toggleSplitScreen };
};
