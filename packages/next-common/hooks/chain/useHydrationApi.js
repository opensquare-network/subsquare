import { getHydrationApi } from "next-common/utils/hydration";
import { useEffect, useState } from "react";

let nowApi = null;

export function useHydrationApi() {
  const [api, setApi] = useState(nowApi);

  useEffect(() => {
    if (api) {
      return;
    }

    getHydrationApi().then((value) => {
      nowApi = value;
      setApi(value);
    });
  }, [api]);

  return api;
}
