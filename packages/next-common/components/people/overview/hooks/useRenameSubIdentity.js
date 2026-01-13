import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";

export default function useRenameSubIdentity(address, newName) {
  const api = useContextApi();

  const getTxFunc = useCallback(() => {
    if (!api?.tx?.identity || !address || !newName) {
      return null;
    }

    return api.tx.identity.renameSub(address, { Raw: newName });
  }, [api, address, newName]);

  return getTxFunc;
}
