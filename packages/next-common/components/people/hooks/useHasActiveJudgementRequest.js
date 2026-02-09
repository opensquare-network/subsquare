import { useChainSettings } from "next-common/context/chain";
import { backendApi } from "next-common/services/nextApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect, useState } from "react";

export default function useHasActiveJudgementRequest() {
  const { hasIdentityVerification } = useChainSettings();
  const realAddress = useRealAddress();
  const [value, setValue] = useState(null);

  const fetch = useCallback(async () => {
    if (!realAddress) {
      setValue(null);
      return;
    }

    try {
      const { result } = await backendApi.fetch(
        `people/identities/${realAddress}/active-request`,
      );
      if (result) {
        setValue(result);
        return;
      }
      setValue(null);
    } catch (error) {
      setValue(null);
    }
  }, [realAddress]);

  useEffect(() => {
    if (hasIdentityVerification) {
      fetch();
    }
  }, [fetch, hasIdentityVerification]);

  return !!value;
}
