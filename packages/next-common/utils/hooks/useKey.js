import { useEventListener } from "./useEventListener";

export function useKey(key, handler, target, opts = {}, ...deps) {
  useEventListener(
    "keydown",
    (event) => {
      if (event.key === key) {
        handler(event);
      }
    },
    target,
    opts,
    ...deps,
  );
}
