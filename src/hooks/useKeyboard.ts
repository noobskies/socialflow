import { useEffect } from "react";

type KeyboardHandlers = Record<string, () => void>;

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      // Build key string (e.g., "cmd+k" or "?")
      const key =
        e.metaKey || e.ctrlKey
          ? `${e.metaKey ? "cmd" : "ctrl"}+${e.key}`
          : e.key;

      const handler = handlers[key];

      if (handler) {
        e.preventDefault();
        handler();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
