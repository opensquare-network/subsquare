import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { isFunction } from "@polkadot/util";

import useEventTrigger from "./useEventTrigger";
import { useMemoValue } from "./useMemoValue";

export default function useEventChanges(checks, filter, startValue) {
  const api = useContextApi();

  const [state, setState] = useState();
  const memoChecks = useMemoValue(checks);
  const { blockHash, events } = useEventTrigger(memoChecks);
  // console.log(events);

  // when startValue changes, we do a full refresh
  useEffect(() => {
    startValue && setState((prev) => interleave(prev, { added: startValue }));
  }, [startValue]);

  // add/remove any additional items detected (only when actual events occur)
  useEffect(() => {
    blockHash && setState((prev) => interleave(prev, filter(events, api)));
  }, [api, blockHash, events, filter]);

  return state;
}

function interleave(existing = [], { added = [], removed = [] }) {
  if (!added.length && !removed.length) {
    return existing;
  }

  const map = {};

  [existing, added].forEach((m) =>
    m.forEach((v) => {
      map[v.toHex()] = v;
    }),
  );

  removed.forEach((v) => {
    delete map[v.toHex()];
  });

  const adjusted = Object.entries(map)
    .sort((a, b) =>
      // for BN-like objects, we use the built-in compare for sorting
      isFunction(a[1].cmp) ? a[1].cmp(b[1]) : a[0].localeCompare(b[0]),
    )
    .map(([, v]) => v);

  return adjusted.length !== existing.length ||
    adjusted.find((e, i) => !e.eq(existing[i]))
    ? adjusted
    : existing;
}
