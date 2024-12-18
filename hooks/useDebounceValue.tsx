import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce a value with a specified delay.
 * 
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
