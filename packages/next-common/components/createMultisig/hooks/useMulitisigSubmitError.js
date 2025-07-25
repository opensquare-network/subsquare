import useSignatoriesIsEqual from "./useSignatoriesIsEqual";
import { useMultisigAccounts } from "next-common/components/multisigs/context/multisigAccountsContext";
import { isEmpty, isNil } from "lodash-es";
import { ERROR_MESSAGE } from "../styled";

const EMPTY_RESULT = {
  disabled: false,
  error: null,
};

export default function useMulitisigSubmitError(
  inputSignatories = [],
  threshold = 0,
  name = "",
) {
  const { multisigs = [] } = useMultisigAccounts();

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
      error: ERROR_MESSAGE.MULTISIG_EXIST,
    };
  }

  const names = multisigs?.map((i) => i.name?.trim()?.toUpperCase());
  if (names.includes(name?.trim()?.toUpperCase())) {
    return {
      disabled: true,
      error: ERROR_MESSAGE.NAME_EXIST,
    };
  }

  return EMPTY_RESULT;
}
