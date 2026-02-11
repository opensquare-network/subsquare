import { useContextApi } from "next-common/context/api";
import createGlobalCachedFetch from "next-common/utils/createGlobalCachedFetch";
import { useCallback } from "react";

const { useGlobalCachedFetch } = createGlobalCachedFetch();

function normalizeValidator(validator) {
  const account = validator[0].args[0].toString();
  const info = validator[1].toJSON();
  return { ...info, account };
}

export function useAllValidators() {
  const api = useContextApi();

  const fetchDataFunc = useCallback(
    async (setResult) => {
      if (!api || !api.query.staking?.validators) {
        return;
      }

      try {
        const validatorEntries = await api.query.staking.validators.entries();
        const data = validatorEntries.map(normalizeValidator);
        setResult(data);
      } catch {
        // ignore
      }
    },
    [api],
  );

  const {
    result: validators,
    fetch,
    loading,
  } = useGlobalCachedFetch(fetchDataFunc, "staking.validators");

  return {
    validators,
    fetch,
    loading: !validators && loading,
  };
}
