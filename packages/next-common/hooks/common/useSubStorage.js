import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { noop } from "lodash-es";

export default function useSubStorage(pallet, storage, params = [], callbackFn = noop) {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!api?.query[pallet]?.[storage]) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query[pallet][storage](...params, callbackFn)
      .then((result) => (unsub = result))
      .finally(() => setLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, pallet, storage, params, callbackFn]);

  return { loading };
}
