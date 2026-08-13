import { useEffect, useState } from "react";

export function useAsyncReadyStatus(
  readiness?: Promise<void>,
): "pending" | "ready" | "error" {
  const [state, setState] = useState<"pending" | "ready" | "error">(
    readiness ? "pending" : "ready",
  );

  useEffect(() => {
    if (readiness === undefined) return;

    let cancelled = false;
    readiness
      .then(() => {
        if (!cancelled) setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [readiness]);

  return state;
}
