import { useEffect, useState } from "react";
import { useMountedState } from "react-use";

const callCache = {};

function useCall(fn, params = [], { cacheKey = "", trigger } = {}) {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isMounted = useMountedState();

  useEffect(() => {
    if (!fn) {
      return;
    }

    if (cacheKey) {
      const cache = callCache[cacheKey];
      if (cache) {
        setValue(cache);
        setLoaded(true);
        return;
      }
    }

    setLoading(true);
    fn(...(params || []))
      .then((value) => {
        if (cacheKey) {
          callCache[cacheKey] = value;
        }
        if (isMounted()) {
          setValue(value);
          setLoaded(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fn, cacheKey, trigger, ...params]);

  return { value, loading, loaded };
}

export default useCall;
