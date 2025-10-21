import { useMemo } from "react";

export function absBigInt(x) {
  if (typeof x !== "bigint") {
    throw new TypeError("Input must be a BigInt");
  }
  return x < 0n ? -x : x;
}

export default function useSortVoteActions(voteActions, sortedColumn) {
  return useMemo(() => {
    if (!voteActions || sortedColumn !== "Impact") {
      return voteActions;
    }

    return [...voteActions].sort((a, b) => {
      const voteA = absBigInt(a.votes);
      const voteB = absBigInt(b.votes);
      if (voteA > voteB) {
        return -1;
      }
      if (voteA < voteB) {
        return 1;
      }
      return 0;
    });
  }, [voteActions, sortedColumn]);
}
