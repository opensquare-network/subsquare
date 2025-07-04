import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";
import { useMemo } from "react";

export default function useIsAppendantAuthor(data) {
  const address = useRealAddress();

  return useMemo(() => {
    if (!address) {
      return false;
    }

    return isSameAddress(address, data?.author?.address);
  }, [address, data?.author?.address]);
}
