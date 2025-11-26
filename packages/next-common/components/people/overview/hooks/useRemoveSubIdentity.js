import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";

export default function useRemoveSubIdentity(address) {
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.identity || !address) {
      return null;
    }

    return api.tx.identity.removeSub(address);
  }, [api, address]);

  return getTxFunc;
}
