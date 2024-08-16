import { isNil } from "lodash-es";
import { useCallback, useState } from "react";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

export function useCookieValue(key, defaultValue) {
  let cookieValue = getCookie(key);
  if (!isNil(cookieValue)) {
    cookieValue = JSON.parse(cookieValue);
  }

  const [value, setValue] = useState(cookieValue ?? defaultValue);

  const set = useCallback(
    (val, options) => {
      setValue(val);
      if (key) {
        setCookie(key, JSON.stringify(val), options);
      }
    },
    [key],
  );

  return [value, set];
}
