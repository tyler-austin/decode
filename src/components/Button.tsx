import { type CSSProperties, type MouseEvent, type ReactNode, useState } from "react";

const BUTTON_COLORS = {
  BACKGROUND: "#27272a",
  BACKGROUND_HOVER: "#3f3f46",
  TEXT: "#fafafa",
  BORDER: "#18181b",
  SHADOW: "0 1px 2px 0 rgba(0,0,0,0.05)",
  FOCUS_RING: "0 0 0 2px rgba(250,250,250,0.08)",
} as const;

type ButtonVisualState = {
  hovered: boolean;
  focused: boolean;
  active: boolean;
  disabled?: boolean;
};

const getInlineButtonStyle = (state: ButtonVisualState): CSSProperties => {
  const { hovered, focused, active, disabled } = state;
  const bg = !disabled && hovered ? BUTTON_COLORS.BACKGROUND_HOVER : BUTTON_COLORS.BACKGROUND;
  const boxShadow = focused ? BUTTON_COLORS.FOCUS_RING : BUTTON_COLORS.SHADOW;

  return {
    backgroundColor: bg,
    color: BUTTON_COLORS.TEXT,
    border: `1px solid ${BUTTON_COLORS.BORDER}`,
    padding: "0.625rem 1rem",
    fontWeight: 600,
    borderRadius: "0.375rem",
    boxShadow,
    margin: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 150ms ease, box-shadow 150ms ease, transform 50ms ease",
    outline: "none",
    opacity: disabled ? 0.6 : 1,
    transform: !disabled && active ? "translateY(0.5px)" : undefined,
  };
};

type ButtonProps = {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
};

export const Button = ({ onClick, disabled, children, type = "button" }: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(false);

  const style = getInlineButtonStyle({ hovered, focused, active, disabled });

  return (
    <button
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseDown={() => !disabled && setActive(true)}
      onMouseUp={() => setActive(false)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === " " || e.key === "Enter")) setActive(true);
      }}
      onKeyUp={() => setActive(false)}
    >
      {children}
    </button>
  );
};
