import { useEffect } from "react";
import { useKey } from "./useKey";

const fns = [];

function drop() {
  fns.splice(fns.length - 1, 1);
}

export function useEscapeKeyOnce(handler) {
  useEffect(() => {
    fns.push(handler);

    return () => {
      drop();
    };
  }, []);

  useKey("Escape", (event) => {
    fns[fns.length - 1]?.(event);
  });
}
