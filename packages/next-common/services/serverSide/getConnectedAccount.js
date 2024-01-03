import { CACHE_KEY } from "next-common/utils/constants";

export function getConnectedAccount(cookies) {
  const cookie = cookies.get(CACHE_KEY.connectedAccount);

  let connectedAccount = null;
  try {
    connectedAccount = JSON.parse(decodeURIComponent(cookie));
  } catch (e) {
    // ignore
  }

  return connectedAccount;
}
