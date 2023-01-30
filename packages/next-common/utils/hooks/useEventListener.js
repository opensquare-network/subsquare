import { useEffect } from "react";

/**
 *
 * @param {keyof HTMLElementEventMap} type
 * @param {import("react").RefObject<HTMLElement> | Window} target
 */
export function useEventListener(type, handler, target = window, opts) {
  useEffect(() => {
    if (!handler) {
      return;
    }

    if (!target) {
      return;
    }

    /** @type {HTMLElement} */
    const targetElement = target?.current ?? target ?? window;

    targetElement.addEventListener(type, handler, opts);

    return () => {
      targetElement.removeEventListener(type, handler, opts);
    };
  }, [type, target, opts]);
}
