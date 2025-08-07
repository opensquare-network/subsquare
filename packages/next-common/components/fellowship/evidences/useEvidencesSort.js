import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export default function useEvidencesSort(evidences) {
  const realAddress = useRealAddress();

  return useMemo(() => {
    const newEvidencesArray = evidences || [];
    // Move my member to the first, keep the order of other members
    newEvidencesArray.sort((a, b) => {
      if (isSameAddress(a.address, realAddress)) {
        return -1;
      } else if (isSameAddress(b.address, realAddress)) {
        return 1;
      } else {
        return 0;
      }
    });
    return newEvidencesArray;
  }, [evidences, realAddress]);
}
