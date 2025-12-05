import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo, useState } from "react";

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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (api?.query?.whitelist?.whitelistedCall) {
      setLoading(true);
      api?.query?.whitelist?.whitelistedCall
        .keys()
        .then((keys) => setData(OPT_HASH.transform(keys)))
        .catch(console.error)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [api?.query?.whitelist?.whitelistedCall]);

  const hashes = useEventChanges(
    [
      api?.events?.whitelist?.CallWhitelisted,
      api?.events?.whitelist?.WhitelistedCallRemoved,
    ],
    filter,
    data,
  );

  const list = useMemo(() => hashes?.map((h) => h.toHex()), [hashes]);
  return {
    loading,
    list,
  };
}
