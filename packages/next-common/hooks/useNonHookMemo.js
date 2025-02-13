import { useMemo } from "react";

export default function useNonHookMemo() {
  return useMemo(() => {
    return function memo(fn, deps) {
      // check deps changed
      const prevDeps = memo.prevDeps;
      const changed = !prevDeps || prevDeps.some((d, i) => d !== deps[i]);
      if (!changed) {
        return memo.prevResult;
      }

      const result = fn();

      // update prev deps
      memo.prevDeps = deps;
      // update prev result
      memo.prevResult = result;

      return result;
    };
  }, []);
}
