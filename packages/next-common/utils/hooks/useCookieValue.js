import isNil from "lodash.isnil";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

export function useCookieValue(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    let parsed = value;
    const val = getCookie(key);
    if (!isNil(val)) {
      try {
        parsed = JSON.parse(val);
      } catch (_) {}
    }

    setValue(parsed);
  }, []);

  function set(val, options) {
    setCookie(key, JSON.stringify(val), options);
    setValue(val);
  }

  return [value, set];
}
