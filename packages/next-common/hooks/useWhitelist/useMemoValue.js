import { useMemo, useRef } from "react";

import { stringify } from "@polkadot/util";

export function useMemoValue(value) {
  const ref = useRef(null);

  return useMemo(() => getMemoValue(ref, value), [ref, value]);
}

export function getMemoValue(ref, value) {
  // check that either we have no previous or the value changed
  if (!ref.current || isDifferent(ref.current.value, value)) {
    const stringified = stringify({ value });

    // no previous or the stringified result is different
    if (!ref.current || ref.current.stringified !== stringified) {
      ref.current = { stringified, value };
    }
  }

  return ref.current.value;
}

function isDifferent(a, b, depth = -1) {
  // increase the depth for arrays (we start at -1, so 0 is top-level)
  depth++;

  // check the actual value references for an exact match
  return a !== b
    ? // check if both are arrays with matching length
      depth < 2 && Array.isArray(a) && Array.isArray(b) && a.length === b.length
      ? // check for any differences inside the arrays (with depth)
        a.some((ai, i) => isDifferent(ai, b[i], depth))
      : // not equal and not an array
        true
    : // exact value match found
      false;
}
