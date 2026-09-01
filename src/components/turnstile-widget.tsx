"use client";

import { useCallback, useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_URL}"]`,
    );
    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      if (window.turnstile) {
        resolve();
        return;
      }

      scriptPromise = null;
      reject(new Error("Turnstile loaded without exposing its browser API."));
    };
    const handleError = () => {
      scriptPromise = null;
      reject(new Error("Turnstile verification could not be loaded."));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

export type TurnstileState =
  | "loading"
  | "ready"
  | "verified"
  | "expired"
  | "error";

interface TurnstileWidgetProps {
  onStateChange: (state: TurnstileState) => void;
  onToken: (token: string) => void;
}

interface TurnstileCallbacks {
  onError: () => void;
  onExpired: () => void;
  onSuccess: (token: string) => void;
}

export function getTurnstileRenderOptions(
  siteKey: string,
  { onError, onExpired, onSuccess }: TurnstileCallbacks,
) {
  return {
    sitekey: siteKey,
    action: "contact_form",
    size: "flexible" as const,
    appearance: "interaction-only" as const,
    callback: onSuccess,
    "error-callback": onError,
    "expired-callback": onExpired,
    "timeout-callback": onExpired,
  };
}

export function TurnstileWidget({
  onStateChange,
  onToken,
}: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const handleSuccess = useCallback(
    (token: string) => {
      onToken(token);
      onStateChange("verified");
    },
    [onStateChange, onToken],
  );
  const handleExpired = useCallback(() => {
    onToken("");
    onStateChange("expired");
  }, [onStateChange, onToken]);
  const handleError = useCallback(() => {
    onToken("");
    onStateChange("error");
  }, [onStateChange, onToken]);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) {
      return;
    }

    let cancelled = false;
    onStateChange("loading");

    void loadScript()
      .then(() => {
        if (
          cancelled ||
          !window.turnstile ||
          !ref.current ||
          widgetId.current
        ) {
          return;
        }

        widgetId.current = window.turnstile.render(
          ref.current,
          getTurnstileRenderOptions(SITE_KEY, {
            onError: handleError,
            onExpired: handleExpired,
            onSuccess: handleSuccess,
          }),
        );
        onStateChange("ready");
      })
      .catch(() => {
        if (!cancelled) {
          handleError();
        }
      });

    return () => {
      cancelled = true;

      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [handleError, handleExpired, handleSuccess, onStateChange]);

  if (!SITE_KEY) {
    return null;
  }

  return <div ref={ref} className="turnstile-widget" />;
}

export function resetTurnstile() {
  window.turnstile?.reset();
}

export const turnstileEnabled = Boolean(SITE_KEY);
export const turnstileRequired = process.env.NODE_ENV === "production";

declare global {
  interface Window {
    turnstile?: {
      remove: (widgetId: string) => void;
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}
