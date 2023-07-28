import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";

const callCache = {};

function useCall(fn, params = [], { cacheKey = "" } = {}) {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (fn) {
      if (cacheKey) {
        const cache = callCache[cacheKey];
        if (cache) {
          setResult(cache);
          setLoaded(true);
          return;
        }
      }

      setLoading(true);
      fn(...params)
        .then((value) => {
          callCache[cacheKey] = value;
          if (isMounted.current) {
            setResult(value);
            setLoaded(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [fn, ...params]);
  return [result, loading, loaded];
}

export default useCall;
