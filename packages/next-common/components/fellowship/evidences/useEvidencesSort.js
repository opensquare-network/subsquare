import { isNil } from "lodash-es";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useMemo } from "react";

export default function useEvidencesSort(evidences) {
  const realAddress = useRealAddress();

  return useMemo(() => {
    const newEvidencesArray = evidences || [];
    newEvidencesArray.sort((a, b) => {
      // prioritize user's own address
      if (isSameAddress(a.address, realAddress)) {
        return -1;
      } else if (isSameAddress(b.address, realAddress)) {
        return 1;
      }

      // sort items with active evidence first
      if (b.activeEvidence && !a.activeEvidence) {
        return 1;
      }
      if (!b.activeEvidence && a.activeEvidence) {
        return -1;
      }

      // sort by rank in descending order (lower rank first)
      if (!isNil(b.rank) && !isNil(a.rank)) {
        return a.rank - b.rank; // Descending order: smaller rank comes first
      }
      if (!isNil(b.rank)) {
        return 1;
      }
      if (!isNil(a.rank)) {
        return -1;
      }

      // sort by address alphabetically
      return a.address < b.address ? -1 : 1;
    });
    return newEvidencesArray;
  }, [evidences, realAddress]);
}
