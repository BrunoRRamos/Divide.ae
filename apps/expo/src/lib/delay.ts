export function throttle<T>(
  callback: (...args: T[]) => void | Promise<void>,
  delay: number,
) {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: T[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      void callback(...args);
    }, delay);
  };
}
