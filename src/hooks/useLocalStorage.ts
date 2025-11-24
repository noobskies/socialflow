import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs = 1000
) {
  // Initialize from localStorage
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Debounced save to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [key, value, debounceMs]);

  return [value, setValue] as const;
}
