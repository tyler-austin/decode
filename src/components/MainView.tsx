import { type ReactNode } from "react";

const MAIN_VIEW_STYLE = {
  fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  display: "flex",
  flexDirection: "column",
  width: "100vw",
  maxWidth: "100vw",
  height: "100dvh",
  padding: "0.25rem 1rem",
  gap: "1rem",
  overflow: "hidden",
  overflowX: "hidden",
  boxSizing: "border-box",
  margin: 0,
  alignItems: "center",
  backgroundColor: "#1f1f1f",
} as const;

type MainViewProps = {
  children: ReactNode;
};

export const MainView = ({ children }: MainViewProps) => {
  return (
    <main style={MAIN_VIEW_STYLE}>
      {children}
    </main>
  );
};
