import { type ReactNode } from "react";

const CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  maxWidth: "90%",
  border: "1px solid #a1a1aa5f",
  boxShadow: "0 0 10px 0 #0000001a",
  backgroundColor: "#242424",
  borderRadius: "0.25rem",
  padding: "2rem",
  overflow: "auto",
  flex: "1 1 0%",
  minHeight: 0,
  maxHeight: "calc(100dvh - 10rem)",
  alignSelf: "center",
  boxSizing: "border-box",
} as const;

type ContainerProps = {
  children: ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return (
    <section
      style={CONTAINER_STYLE}
    >
      {children}
    </section>
  );
};
