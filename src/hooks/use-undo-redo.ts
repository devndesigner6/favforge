import { useState, useCallback, useRef } from "react";

export type BgType = "solid" | "linear" | "radial";

export interface FaviconState {
  icon: string;
  bgColor: string;
  bgColor2: string;
  bgType: BgType;
  gradientAngle: number;
  iconColor: string;
  shape: "square" | "rounded" | "circle";
  fontSize: number;
  customImage: string | null;
}

const MAX_HISTORY = 50;

export function useUndoRedo(initial: FaviconState) {
  const [history, setHistory] = useState<FaviconState[]>([initial]);
  const [index, setIndex] = useState(0);
  const skipPush = useRef(false);

  const current = history[index];

  const push = useCallback((state: FaviconState) => {
    if (skipPush.current) {
      skipPush.current = false;
      return;
    }
    setHistory((prev) => {
      const newHistory = prev.slice(0, index + 1);
      newHistory.push(state);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
    setIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      skipPush.current = true;
      setIndex((i) => i - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      skipPush.current = true;
      setIndex((i) => i + 1);
    }
  }, [index, history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { current, push, undo, redo, canUndo, canRedo };
}
