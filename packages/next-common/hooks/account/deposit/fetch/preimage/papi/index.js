import { queryAddressPreimageDepositsWithStatusForPapi } from "./statusFor";
import { queryAddressPreimageDepositsWithRequestStatusForPapi } from "./requestStatusFor";

export default async function queryAddressPreimageDepositsPapi(papi, address) {
  const [deposits1, deposits2] = await Promise.all([
    queryAddressPreimageDepositsWithStatusForPapi(papi, address),
    queryAddressPreimageDepositsWithRequestStatusForPapi(papi, address),
  ]);

  return [...deposits1, ...deposits2];
}
