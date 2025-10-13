import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { isNil } from "lodash-es";
import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";

export default function useConditionalSubStorage(
  pallet,
  storage,
  params = [],
  options = {},
) {
  const conditionalApi = useConditionalContextApi();
  const { api = conditionalApi } = options;
  const isMounted = useMountedState();
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(true);

  const filteredParams = (Array.isArray(params) ? params : [params]).filter(
    (param) => !isNil(param),
  );

  useEffect(() => {
    if (!api || isNil(pallet) || isNil(storage)) {
      return;
    }

    const queryStorage = api?.query[pallet]?.[storage];
    if (!queryStorage) {
      setResult();
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsub;

    queryStorage(...filteredParams, (subscribeResult) => {
      if (!isMounted()) {
        return;
      }

      setResult(subscribeResult);
      setLoading(false);
    })
      .then((unsubscribe) => {
        unsub = unsubscribe;
      })
      .catch((e) => {
        console.error(e);
        if (isMounted()) {
          setResult();
          setLoading(false);
        }
      });

    return () => {
      if (unsub) {
        unsub();
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, pallet, storage, isMounted, ...filteredParams]);

  return { result, loading };
}
