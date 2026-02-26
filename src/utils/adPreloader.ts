const AD_GROUP_ID = "ait.v2.live.bb15dd96415042a4";

let preloadState: "idle" | "loading" | "loaded" | "failed" = "idle";
let cleanupFn: (() => void) | null = null;
let pendingPromise: Promise<boolean> | null = null;

export function getAdPreloadState() {
  return preloadState;
}

export function getAdGroupId() {
  return AD_GROUP_ID;
}

export function preloadAd(): Promise<boolean> {
  if (preloadState === "loaded") return Promise.resolve(true);

  if (preloadState === "loading" && pendingPromise) {
    return pendingPromise;
  }

  preloadState = "loading";

  pendingPromise = (async () => {
    try {
      const { GoogleAdMob } = await import("@apps-in-toss/web-framework");

      return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("[AdPreloader] load timeout (10s)");
          preloadState = "failed";
          pendingPromise = null;
          if (cleanupFn) cleanupFn();
          cleanupFn = null;
          resolve(false);
        }, 10000);

        cleanupFn = GoogleAdMob.loadAppsInTossAdMob({
          options: { adGroupId: AD_GROUP_ID },
          onEvent: (event: any) => {
            console.log("[AdPreloader] event:", event.type);
            if (event.type === "loaded") {
              clearTimeout(timeout);
              preloadState = "loaded";
              pendingPromise = null;
              if (cleanupFn) cleanupFn();
              cleanupFn = null;
              resolve(true);
            }
          },
          onError: (error: any) => {
            clearTimeout(timeout);
            console.error("[AdPreloader] error:", error);
            preloadState = "failed";
            pendingPromise = null;
            if (cleanupFn) cleanupFn();
            cleanupFn = null;
            resolve(false);
          },
        });
      });
    } catch (err) {
      console.error("[AdPreloader] SDK import failed:", err);
      preloadState = "failed";
      pendingPromise = null;
      return false;
    }
  })();

  return pendingPromise;
}

export function resetAdPreload() {
  if (cleanupFn) {
    cleanupFn();
    cleanupFn = null;
  }
  preloadState = "idle";
  pendingPromise = null;
}
