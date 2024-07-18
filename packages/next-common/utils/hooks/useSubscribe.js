import { useEffect, useState } from "react";

export default function useSubscribe(apiFunc, params = []) {
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiFunc) {
      return;
    }

    let unsub = null;
    apiFunc
      .apply(null, [
        ...params,
        (data) => {
          setValue(data);
          setLoading(false);
        },
      ])
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [apiFunc, params]);

  return { value, loading };
}
