import { useCallback, useEffect, useRef, useState } from "react";

type UseFetchJsonConfig = {
  init?: RequestInit;
  immediate?: boolean;
  delayBeforeFetchMs?: number;
};

type UseFetchJsonResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
  retry: () => void;
  refetch: () => Promise<void>;
};

export const useFetchJson = <T = unknown>(
  url: string | URL | null | undefined,
  config?: UseFetchJsonConfig
): UseFetchJsonResult<T> => {
  const { init, immediate = true, delayBeforeFetchMs = 500 } = config ?? {};

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const retryCounterRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    if (!url) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setData(null);
    setError(null);

    if (delayBeforeFetchMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayBeforeFetchMs));
    }

    try {
      const headers: HeadersInit = {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      };

      const response = await fetch(url.toString(), {
        ...init,
        method: init?.method ?? "GET",
        headers: {
          "Accept": "application/json, text/plain;q=0.9, */*;q=0.8",
          ...headers,
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      const isJson = contentType.includes("application/json") || contentType.includes("+json");

      if (isJson) {
        try {
          const json = (await response.json()) as T;
          setData(json);
        } catch {
          const text = (await response.text()) as unknown as T;
          setData(text);
        }
      } else {
        const text = (await response.text()) as unknown as T;
        setData(text);
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setError(err as Error);
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [url, init, delayBeforeFetchMs]);

  const retry = useCallback(() => {
    retryCounterRef.current += 1;
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (!immediate || !url) {
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }

    void refetch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, immediate, refetch]);

  return {
    data,
    loading,
    error,
    retryCount: retryCounterRef.current,
    retry,
    refetch,
  };
};
