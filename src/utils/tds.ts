import { useState, useEffect } from "react";
import { isTossEnvironment } from "./env";

let tdsModule: Record<string, any> = {};
let colorsModule: Record<string, any> = {};
let loaded = false;
let loading = false;
let subscribers: (() => void)[] = [];

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

function doLoad(): Promise<void> {
  if (loaded || loading) return Promise.resolve();
  if (!isTossEnvironment()) {
    loaded = true;
    return Promise.resolve();
  }
  loading = true;
  return Promise.all([
    import("@toss/tds-mobile").catch(() => ({})),
    import("@toss/tds-colors").catch(() => ({})),
  ]).then(([tds, colors]) => {
    tdsModule = tds;
    colorsModule = colors;
    loaded = true;
    loading = false;
    notifySubscribers();
  });
}

doLoad();

export function useTDS(): { tds: Record<string, any>; colors: Record<string, any>; ready: boolean } {
  const [, rerender] = useState(0);

  useEffect(() => {
    if (loaded) return;
    const cb = () => rerender((n) => n + 1);
    subscribers.push(cb);
    doLoad();
    return () => {
      subscribers = subscribers.filter((s) => s !== cb);
    };
  }, []);

  return {
    tds: tdsModule,
    colors: colorsModule,
    ready: loaded && Object.keys(tdsModule).length > 0,
  };
}
