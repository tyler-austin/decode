import { useEffect, useState } from "react";
import type { TypewriterItem } from "../hooks/useTypewriter";

const CURSOR_WIDTH = 6 as const;

const getCursorStyle = (cursorVisible: boolean) => ({
  display: "inline-block" as const,
  width: CURSOR_WIDTH,
  height: "1em",
  backgroundColor: "currentColor",
  alignSelf: "center" as const,
  visibility: cursorVisible ? ("visible" as const) : ("hidden" as const),
});

const LIST_STYLE = {
  listStyle: "none" as const,
  padding: 0,
  margin: 0,
  display: "flex" as const,
  flexDirection: "row" as const,
  flexWrap: "wrap" as const,
  gap: "0.125rem" as const,
  whiteSpace: "pre-wrap" as const,
} as const;

const ITEM_STYLE = {
  margin: 0,
  padding: 0,
} as const;

type TypewriterProps = {
  items: TypewriterItem[];
  blinkMs?: number;
  isDone?: boolean;
};

export const Typewriter = ({ items, blinkMs = 500, isDone = false }: TypewriterProps) => {
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  useEffect(() => {
    if (isDone) {
      setCursorVisible(false);
      return;
    }
    setCursorVisible(true);
    const intervalId = window.setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, blinkMs);
    return () => window.clearInterval(intervalId);
  }, [blinkMs, isDone]);

  const cursorStyle = getCursorStyle(cursorVisible);

  return (
    <ul aria-live="polite" style={LIST_STYLE}>
      {items.map((item) => (
        <li key={item.id} style={ITEM_STYLE}>{item.ch}</li>
      ))}
      {!isDone && <li style={cursorStyle} aria-hidden="true" />}
    </ul>
  );
};
