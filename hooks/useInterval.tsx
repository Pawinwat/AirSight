import { useEffect, useRef } from 'react';

type Callback = () => void;
type Delay = number | null;

/**
 * Custom hook to manage intervals.
 * @param callback - Function to execute at each interval.
 * @param delay - Delay in milliseconds. Set to null to pause the interval.
 * @returns A ref object containing the interval ID.
 */
function useInterval(callback: Callback, delay: Delay) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Update the saved callback if it changes
    //   useEffect(() => {
    //     savedCallback.current = callback;
    //   }, [callback]);

    // Set up the interval
    useEffect(() => {
        // If delay is null, do not set up the interval
        if (!delay) {
            return;
        }
        // Set the interval and store its ID in the ref
        intervalRef.current = setInterval(callback, delay);

        // Clear the interval on component unmount or when delay changes
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [delay]);

    // Return the interval ref for potential manual control
    return intervalRef;
}

export default useInterval;
