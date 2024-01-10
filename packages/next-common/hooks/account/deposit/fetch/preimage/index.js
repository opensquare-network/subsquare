import { queryAddressPreimageDepositsWithStatusFor } from "next-common/hooks/account/deposit/fetch/preimage/statusFor";
import { queryAddressPreimageDepositsWithRequestStatusFor } from "next-common/hooks/account/deposit/fetch/preimage/requestStatusFor";

export default async function queryAddressPreimageDeposits(api, address) {
  const [deposits1, deposits2] = await Promise.all([
    queryAddressPreimageDepositsWithStatusFor(api, address),
    queryAddressPreimageDepositsWithRequestStatusFor(api, address),
  ]);
  return [...deposits1, ...deposits2];
}
