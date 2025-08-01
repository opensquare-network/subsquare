import { encodeMultiAddress } from "@polkadot/util-crypto";
import { isEmpty } from "lodash-es";
import { useMemo } from "react";

export default function useSignatoriesIsEqual(
  inputSignatories = [],
  threshold = 0,
  multisigs = [],
) {
  const signatories = useMemo(() => {
    return inputSignatories.filter((i) => !isEmpty(i));
  }, [inputSignatories]);
  const multisigAddresses = useMemo(() => {
    return multisigs.map((i) => i.multisigAddress);
  }, [multisigs]);

  if (isEmpty(signatories) || threshold <= 0 || isEmpty(multisigAddresses)) {
    return false;
  }

  try {
    const encodedMultisigAddress = encodeMultiAddress(signatories, threshold);
    return multisigAddresses.includes(encodedMultisigAddress);
  } catch (error) {
    console.error(error);
  }
  return false;
}
