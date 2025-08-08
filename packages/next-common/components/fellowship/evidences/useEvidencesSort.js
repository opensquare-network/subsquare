import { isNil } from "lodash-es";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export default function useEvidencesSort(evidences) {
  const realAddress = useRealAddress();

  return useMemo(() => {
    const newEvidencesArray = evidences || [];
    newEvidencesArray.sort((a, b) => {
      if (isSameAddress(a.address, realAddress)) {
        return -1;
      } else if (isSameAddress(b.address, realAddress)) {
        return 1;
      }

      if (b.activeEvidence && !a.activeEvidence) {
        return 1;
      }
      if (!b.activeEvidence && a.activeEvidence) {
        return -1;
      }

      if (!isNil(b.rank) && !isNil(a.rank)) {
        return a.rank - b.rank;
      }
      if (!isNil(b.rank)) {
        return 1;
      }
      if (!isNil(a.rank)) {
        return -1;
      }

      return a.address < b.address ? -1 : 1;
    });
    return newEvidencesArray;
  }, [evidences, realAddress]);
}
