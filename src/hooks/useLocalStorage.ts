// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";

// type SetValue<T> = (value: T | ((prev: T) => T)) => void;

// function readStorage<T>(key: string, fallback: T): T {
//   if (typeof window === "undefined") return fallback;
//   try {
//     const item = window.localStorage.getItem(key);
//     return item ? (JSON.parse(item) as T) : fallback;
//   } catch (error) {
//     console.warn(`useLocalStorage: failed to read "${key}"`, error);
//     return fallback;
//   }
// }

// export function useLocalStorage<T>(key: string, initialValue: T) {
//   const [value, setValueState] = useState<T>(() => readStorage(key, initialValue));
//   const initialValueRef = useRef(initialValue);
//   initialValueRef.current = initialValue;

//   const setValue = useCallback<SetValue<T>>(
//     (next) => {
//       setValueState((prev) => {
//         const resolved = next instanceof Function ? next(prev) : next;
//         if (typeof window !== "undefined") {
//           try {
//             window.localStorage.setItem(key, JSON.stringify(resolved));
//           } catch (error) {
//             console.warn(`useLocalStorage: failed to write "${key}"`, error);
//           }
//         }
//         return resolved;
//       });
//     },
//     [key]
//   );

//   const removeValue = useCallback(() => {
//     if (typeof window !== "undefined") {
//       try {
//         window.localStorage.removeItem(key);
//       } catch (error) {
//         console.warn(`useLocalStorage: failed to remove "${key}"`, error);
//       }
//     }
//     setValueState(initialValueRef.current);
//   }, [key]);

//   // Keep in sync across tabs/windows
//   useEffect(() => {
//     function handleStorage(event: StorageEvent) {
//       if (event.key !== key || event.storageArea !== window.localStorage) return;
//       setValueState(event.newValue ? (JSON.parse(event.newValue) as T) : initialValueRef.current);
//     }
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, [key]);

//   return { value, setValue, removeValue };
// }

"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persists a piece of state to localStorage, keeping SSR safe by
 * hydrating from the default value first and syncing on mount.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // Ignore malformed storage — fall back to default.
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage may be unavailable (private mode, quota) — fail silently.
        }
        return resolved;
      });
    },
    [key]
  );

  return { value, setValue: update, hydrated };
}
