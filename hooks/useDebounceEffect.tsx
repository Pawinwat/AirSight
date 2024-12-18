import { useEffect } from 'react';

/**
 * A custom hook to debounce an effect.
 *
 * @param callback - The effect callback to execute after the debounce delay.
 * @param dependencies - Array of dependencies that trigger the callback.
 * @param delay - The debounce delay in milliseconds.
 */
export function useDebounceEffect(callback: () => void, dependencies: any[], delay: number): void {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    // Cleanup the timeout if dependencies change or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies, delay]); // Include delay as a dependency to handle dynamic changes
}
