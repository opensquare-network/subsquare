import { CACHE_KEY } from "next-common/utils/constants";

export function getConnectedWallet(cookies) {
  const connectedWalletCookie = cookies.get(CACHE_KEY.connectedWallet);

  let connectedWallet = null;
  try {
    connectedWallet = JSON.parse(decodeURIComponent(connectedWalletCookie));
  } catch (e) {
    // ignore
  }

  return connectedWallet;
}
