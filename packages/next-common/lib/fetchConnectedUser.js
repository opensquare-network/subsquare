import { ssrNextApi } from "next-common/services/nextApi";
import { getConnectedAccount } from "next-common/services/serverSide/getConnectedAccount";

export default async function fetchConnectedUser(cookies) {
  const connectedAccount = getConnectedAccount(cookies);
  if (!connectedAccount) {
    return null;
  }

  const { result } = ssrNextApi.fetch(
    `users/${connectedAccount?.address}/public-info`,
  );
  if (!result) {
    return null;
  }

  return result;
}
