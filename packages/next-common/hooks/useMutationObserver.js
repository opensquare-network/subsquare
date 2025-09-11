// https://ahooks.js.org/hooks/use-mutation-observer

import { noop } from "lodash-es";
import { IS_SERVER } from "next-common/utils/constants";
import { useEffect } from "react";

/**
 * @returns {HTMLElement | undefined}
 */
function getTargetElement(target) {
  if (IS_SERVER) {
    return undefined;
  }
  if (target?.current) {
    return target.current;
  }

  return target;
}

/**
 * @param {noop} callback
 * @param {import("react").RefObject<HTMLElement>} target
 * @param {MutationObserverInit} options
 */
export function useMutationObserver(callback = noop, target, options) {
  useEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    const observer = new MutationObserver(callback);
    observer.observe(el, options);

    return () => {
      observer?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, target]);
}
