"use client";

import { useEffect, useState, type ReactNode } from "react";

type Trigger = "idle" | "interaction" | "scroll";

type IdleCallback = (cb: IdleRequestCallback, opts?: { timeout?: number }) => number;

/**
 * Defers rendering of children until a trigger fires.
 *
 * - "idle"        : requestIdleCallback (with setTimeout fallback)
 * - "interaction" : first mousemove / touchstart / scroll / keydown
 * - "scroll"      : window.scrollY > 100
 *
 * Set `pointerFineOnly` to skip entirely on touch / coarse-pointer devices.
 *
 * Combined with `dynamic()` imports at the parent, this also defers the
 * underlying chunk download — the chunk isn't fetched until children mount.
 */
export default function LazyMount({
  children,
  trigger = "idle",
  pointerFineOnly = false,
}: {
  children: ReactNode;
  trigger?: Trigger;
  pointerFineOnly?: boolean;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pointerFineOnly && !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let cleanup: () => void = () => {};

    if (trigger === "idle") {
      const ric = (window as unknown as { requestIdleCallback?: IdleCallback })
        .requestIdleCallback;
      if (typeof ric === "function") {
        const id = ric(() => setReady(true), { timeout: 3000 });
        cleanup = () => {
          const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void })
            .cancelIdleCallback;
          cic?.(id);
        };
      } else {
        const id = window.setTimeout(() => setReady(true), 2000);
        cleanup = () => window.clearTimeout(id);
      }
    } else if (trigger === "interaction") {
      const events: Array<keyof WindowEventMap> = [
        "mousemove",
        "touchstart",
        "scroll",
        "keydown",
      ];
      const onInteract = () => {
        setReady(true);
        events.forEach((e) => window.removeEventListener(e, onInteract));
      };
      events.forEach((e) =>
        window.addEventListener(e, onInteract, { once: true, passive: true }),
      );
      cleanup = () =>
        events.forEach((e) => window.removeEventListener(e, onInteract));
    } else if (trigger === "scroll") {
      if (window.scrollY > 100) {
        setReady(true);
        return;
      }
      const onScroll = () => {
        if (window.scrollY > 100) {
          setReady(true);
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    }

    return cleanup;
  }, [trigger, pointerFineOnly]);

  if (!ready) return null;
  return <>{children}</>;
}
