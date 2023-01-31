import { CACHE_KEY } from "../../utils/constants";
import { useCookieValue } from "./useCookieValue";

export function useAcceptCookies() {
  const [accepted, setAccepted] = useCookieValue(
    CACHE_KEY.acceptCookies,
    false
  );

  return [accepted, setAccepted];
}
