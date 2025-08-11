import { Button } from "./Button";

const HEADER_STYLE = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexDirection: "row",
  width: "calc(100% - 0.25rem)",
  maxWidth: "calc(100% - 0.25rem)",
  position: "static",
  flex: "0 0 auto",
  boxSizing: "border-box",
  margin: "1rem 1rem",
  padding: "0 1rem",
} as const;

type HeaderProps = {
  error: boolean;
  loading: boolean;
  retry: () => void;
  retryCount: number;
  refetch: () => void;
};

export const Header = ({ error, loading, retry, retryCount, refetch }: HeaderProps) => {
  return (
    <header
      style={HEADER_STYLE}>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "left" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "#e4f222" }}>Ramp</h1>
        <h2 style={{ fontSize: "1rem", fontWeight: "normal", color: "#959963", margin: 0, padding: 0 }}>Capture the Flag</h2>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
        {!error && (
          <Button onClick={refetch} disabled={loading}>
            Reload
          </Button>
        )}
        {error && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center" }}>
            <Button onClick={retry} disabled={loading || retryCount >= 3}>
              Retry
            </Button>
            <span style={{ color: "#555" }}>Retries Remaining: {3 - retryCount}</span>
          </div>
        )}
      </div>

    </header>

  );
};
