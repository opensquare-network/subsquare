// TODO: use `useStorage` instead

import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { noop } from "lodash-es";

export default function useSubStorage(
  pallet,
  storage,
  params = [],
  callbackFn = noop,
) {
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

    const filteredParams = params.filter(Boolean);
    const meta = api?.query[pallet]?.[storage].meta;
    if (meta.type?.isMap && filteredParams.length !== 1) {
      setLoading(false);
      return;
    }

    let unsub;
    api.query[pallet][storage](...filteredParams, callbackFn)
      .then((result) => (unsub = result))
      .finally(() => setLoading(false));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, pallet, storage, ...params, callbackFn]);

  return { loading };
}
