import { useContextApi } from "next-common/context/api";
import { useMemo } from "react";

import useMapKeys from "./useMapKeys";
import useEventChanges from "./useEventChanges";

const OPT_HASH = {
  transform: (keys) => keys.map(({ args: [hash] }) => hash),
};

function filter(records) {
  const added = [];
  const removed = [];

  records.forEach(
    ({
      event: {
        data: [hash],
        method,
      },
    }) => {
      if (method === "CallWhitelisted") {
        added.push(hash);
      } else {
        removed.push(hash);
      }
    },
  );

  return { added, removed };
}

export default function useWhitelist() {
  const api = useContextApi();

  const startValue = useMapKeys(
    api?.query?.whitelist?.whitelistedCall,
    [],
    OPT_HASH,
  );

  const hashes = useEventChanges(
    [
      api?.events?.whitelist?.CallWhitelisted,
      api?.events?.whitelist?.WhitelistedCallRemoved,
    ],
    filter,
    startValue,
  );

  const list = useMemo(() => hashes?.map((h) => h.toHex()), [hashes]);
  return list;
}
