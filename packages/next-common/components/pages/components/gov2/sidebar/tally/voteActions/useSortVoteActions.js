import { useMemo } from "react";
import { getImpactVotes, absBigInt } from "./common";

export default function useSortVoteActions(voteActions, sortedColumn) {
  return useMemo(() => {
    if (!voteActions || sortedColumn !== "Impact") {
      return voteActions;
    }

    return [...voteActions].sort((a, b) => {
      const impactA = getImpactVotes(a.data, a.type);
      const impactB = getImpactVotes(b.data, b.type);
      const absImpactA = absBigInt(impactA);
      const absImpactB = absBigInt(impactB);
      if (absImpactA > absImpactB) {
        return -1;
      }
      if (absImpactA < absImpactB) {
        return 1;
      }
      return 0;
    });
  }, [voteActions, sortedColumn]);
}
