import { useEventListener } from "./useEventListener";

export function useKey(key, handler, target, opts) {
  useEventListener(
    "keydown",
    (event) => {
      if (event.key === key) {
        handler();
      }
    },
    target,
    opts
  );
}
