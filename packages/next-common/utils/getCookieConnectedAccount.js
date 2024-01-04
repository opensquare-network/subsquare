import { getCookie } from "./viewfuncs/cookies";
import { CACHE_KEY } from "./constants";

export function getCookieConnectedAccount() {
  const data = getCookie(CACHE_KEY.connectedAccount);
  if (!data) {
    return null;
  }
  try {
    return JSON.parse(decodeURIComponent(data));
  } catch (error) {
    console.error(error);
    return null;
  }
}
