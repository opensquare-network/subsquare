import { ssrNextApi } from "next-common/services/nextApi";
import { getConnectedWallet } from "next-common/services/serverSide/getConnectedWallet";

export default async function fetchConnectedUser(cookies) {
  const connectedWallet = getConnectedWallet(cookies);
  if (!connectedWallet) {
    return null;
  }

  const { result } = ssrNextApi.fetch(
    `users/${connectedWallet?.address}/public-info`,
  );
  if (!result) {
    return null;
  }

  return result;
}
