import {
  convertPapiDepositTuple,
  toPreimageLength,
} from "next-common/hooks/useOldPreimageCommon";
import { isSameAddress } from "next-common/utils";

function extractInfo(status, hash) {
  const deposit = convertPapiDepositTuple(status.value?.deposit);
  if (!deposit) {
    return null;
  }

  return {
    hash,
    len: toPreimageLength(status.value?.len)?.toNumber() ?? null,
    depositor: deposit.who,
    deposit: deposit.amount.toString(),
    method: "statusFor",
  };
}

export async function queryAddressPreimageDepositsWithStatusForPapi(
  papi,
  address,
) {
  const entries = await papi?.query.Preimage?.StatusFor?.getEntries?.();

  return (entries || [])
    .map(({ keyArgs, value }) =>
      extractInfo(value, keyArgs?.[0]?.asHex?.() ?? keyArgs?.[0]?.toString()),
    )
    .filter(Boolean)
    .filter((item) => isSameAddress(item.depositor, address));
}
