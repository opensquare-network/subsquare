import useSignatoriesIsEqual from "./useSignatoriesIsEqual";
import { useMultisigAccounts } from "next-common/components/multisigs/context/accountsContext";
import { isEmpty, isNil } from "lodash-es";

const EMPTY_RESULT = {
  disabled: false,
  error: null,
};

export default function useMulitisigSubmitError(
  inputSignatories = [],
  threshold = 0,
  name = "",
) {
  const { multisigs } = useMultisigAccounts();

  const isMultisigExist = useSignatoriesIsEqual(
    inputSignatories,
    threshold,
    multisigs,
  );

  if (isEmpty(inputSignatories) || isNil(threshold)) {
    return EMPTY_RESULT;
  }

  if (isMultisigExist) {
    return {
      disabled: true,
      error: "This multisig address is already saved.",
    };
  }

  const names = multisigs.map((i) => i.name?.trim()?.toUpperCase());
  if (names.includes(name?.trim()?.toUpperCase())) {
    return {
      disabled: true,
      error: "This multisig name is already saved.",
    };
  }

  return EMPTY_RESULT;
}
