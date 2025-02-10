import { isNil } from "lodash-es";
import { useCallback, useState } from "react";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";
import { ADDRESS_CACHE_KEYS } from "next-common/utils/constants";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function getCacheKey(key, address) {
  return ADDRESS_CACHE_KEYS.includes(key) && address
    ? `${address}-${key}`
    : key;
}

export function useCookieValue(key, defaultValue) {
  const address = useRealAddress();
  const cacheKey = getCacheKey(key, address);

  let cookieValue = getCookie(cacheKey);
  if (!isNil(cookieValue)) {
    cookieValue = JSON.parse(cookieValue);
  }

  const [value, setValue] = useState(cookieValue ?? defaultValue);

  const set = useCallback(
    (val, options) => {
      setValue(val);
      if (cacheKey) {
        setCookie(cacheKey, JSON.stringify(val), options);
      }
    },
    [cacheKey],
  );

  return [value, set];
}
