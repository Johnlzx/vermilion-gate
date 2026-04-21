"use client";

import { useCallback, useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptState: "idle" | "loading" | "ready" = "idle";
const onReadyCallbacks: Array<() => void> = [];

function loadScript() {
  if (scriptState !== "idle") {
    return;
  }

  scriptState = "loading";
  const script = document.createElement("script");
  script.src = SCRIPT_URL;
  script.async = true;
  script.onload = () => {
    scriptState = "ready";
    onReadyCallbacks.forEach((callback) => callback());
    onReadyCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

function onScriptReady(callback: () => void) {
  if (scriptState === "ready") {
    callback();
    return;
  }

  onReadyCallbacks.push(callback);
  loadScript();
}

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
}

export function getTurnstileRenderOptions(
  siteKey: string,
  onToken: (token: string) => void,
) {
  return {
    sitekey: siteKey,
    size: "flexible" as const,
    appearance: "always" as const,
    callback: onToken,
  };
}

export function TurnstileWidget({ onToken }: TurnstileWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const handleCallback = useCallback(
    (token: string) => {
      onToken(token);
    },
    [onToken],
  );

  useEffect(() => {
    if (!SITE_KEY || !ref.current) {
      return;
    }

    const render = () => {
      if (!window.turnstile || !ref.current || widgetId.current) {
        return;
      }

      widgetId.current = window.turnstile.render(
        ref.current,
        getTurnstileRenderOptions(SITE_KEY, handleCallback),
      );
    };

    onScriptReady(render);
  }, [handleCallback]);

  if (!SITE_KEY) {
    return null;
  }

  return <div ref={ref} className="mt-2" />;
}

export function resetTurnstile() {
  if (window.turnstile) {
    window.turnstile.reset();
  }
}

export const turnstileEnabled = Boolean(SITE_KEY);

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
    };
  }
}
