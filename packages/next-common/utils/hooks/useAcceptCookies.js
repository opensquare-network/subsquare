import { useEffect, useState } from "react";
import { CACHE_KEY } from "../../utils/constants";
import { getCookie, setCookie } from "../../utils/viewfuncs/cookies";

export function useAcceptCookies() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setAccepted(JSON.parse(getCookie(CACHE_KEY.acceptCookies) ?? "false"));
  }, []);

  function set(value, options) {
    setCookie(CACHE_KEY.acceptCookies, value, options);
  }

  return [accepted, set];
}
