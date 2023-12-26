import { CACHE_KEY } from "next-common/utils/constants";
import Cookies from "cookies";

export function getConnectedWallet(context) {
  const cookies = new Cookies(context.req, context.res);

  const connectedWalletCookie = cookies.get(CACHE_KEY.connectedWallet);

  let connectedWallet = null;
  try {
    connectedWallet = JSON.parse(decodeURIComponent(connectedWalletCookie));
  } catch (e) {
    // ignore
  }

  return connectedWallet;
}
