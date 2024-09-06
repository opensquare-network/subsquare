import { useEffect } from "react";

/**
 *
 * @param {keyof HTMLElementEventMap} type
 * @param {(e: Event) => void} handler
 * @param {import("react").RefObject<HTMLElement> | Window} target
 */
export function useEventListener(type, handler, target, opts, ...deps) {
  useEffect(() => {
    if (!handler) {
      return;
    }

    /** @type {HTMLElement} */
    const targetElement = target?.current ?? target ?? window;

    if (!targetElement) {
      return;
    }

    targetElement.addEventListener(type, handler, opts);

    return () => {
      targetElement.removeEventListener(type, handler, opts);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, target, opts, ...deps]);
}
