import { isNil } from "lodash-es";
import { useState } from "react";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

export function useCookieValue(key, defaultValue) {
  let cookieValue = getCookie(key);
  if (!isNil(cookieValue)) {
    cookieValue = JSON.parse(cookieValue);
  }

  const [value, setValue] = useState(cookieValue ?? defaultValue);

  function set(val, options) {
    setCookie(key, JSON.stringify(val), options);
    setValue(val);
  }

  return [value, set];
}
