import { useEffect, useRef } from "react";

export function useDelay(
  callback: () => void | Promise<void>,
  delay: number,
  deps: unknown[],
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      void callback();
    }, delay);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [callback, deps, delay]);
}
