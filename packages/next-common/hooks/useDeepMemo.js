import { useRef } from "react";
import { isEqual } from "lodash-es";

export default function useDeepMemo(fn, deps) {
  const prevDepsRef = useRef();
  const valueRef = useRef();

  if (!prevDepsRef.current || !isEqual(deps, prevDepsRef.current)) {
    prevDepsRef.current = deps;
    valueRef.current = fn();
  }

  return valueRef.current;
}
