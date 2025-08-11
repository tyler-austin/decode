import { type ReactNode } from "react";

type ErrorAlertProps = {
  error: Error | null;
  retryCount: number;
};

export const ErrorAlert = ({ error, retryCount }: ErrorAlertProps) => {
  return (
    <div role="alert" style={{ color: "#b00020", margin: "2rem" }}>
      {retryCount < 3 && `Error: ${error?.message ?? "Whoops, that's not good. Please retry."}`}
      {retryCount >= 3 &&
        "You have retried to fetch the data three times. There might be an issue with the server. Please try again later."}
    </div>
  );
};
