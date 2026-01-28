import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mubu.theme";
export type ThemeMode = "light" | "dark";

function applyThemeToDom(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialTheme());

  useEffect(() => {
    applyThemeToDom(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  return useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
      set: setMode,
    }),
    [mode]
  );
}

