import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        // Clear any existing timeout before setting a new one
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => setDebouncedValue(value), delay);

        // Cleanup the timeout if value/delay changes or component unmounts
        return () => clearTimeout(timeoutRef.current);
    }, [value, delay]);

    return debouncedValue;
}
