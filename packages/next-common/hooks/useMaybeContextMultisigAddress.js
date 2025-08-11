import { useMultisigAccount } from "next-common/context/multisig";
import useMultisigAddress from "./useMultisigAddress";
import { isNil } from "lodash-es";
import { normalizeAddress } from "next-common/utils/address";

export default function useMaybeContextMultisigAddress(sourceAddress) {
  const multisig = useMultisigAccount();
  const multisigAddress = useMultisigAddress(sourceAddress);

  const isNilMultisigAddress =
    isNil(multisigAddress?.result) && !multisigAddress.loading;

  if (
    isNilMultisigAddress &&
    normalizeAddress(multisig?.multisigAddress) === sourceAddress
  ) {
    return {
      result: multisig,
      loading: false,
    };
  }

  return multisigAddress;
}
