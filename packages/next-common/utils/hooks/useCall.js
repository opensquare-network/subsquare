import { useEffect, useState } from "react";
import useIsMounted from "./useIsMounted";

function useCall(fn, params = []) {
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (fn) {
      setLoading(true);
      fn(...params)
        .then((value) => {
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
