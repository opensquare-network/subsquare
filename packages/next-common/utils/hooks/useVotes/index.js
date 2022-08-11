import { useEffect, useState } from "react";
import { getReferendumVotesByHeight } from "./passed";
import { getOnChainReferendum } from "./onChain";
import { emptyVotes } from "./passed/common";

export default function useVotes(api, referendumIndex, passedHeight) {
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState(emptyVotes)

  useEffect(() => {
    if (!api) {
      setIsLoading(false);
      return
    }

    setIsLoading(true);
    if (passedHeight) {
      getReferendumVotesByHeight(api, passedHeight - 1, referendumIndex)
        .then(result => setVotes(result))
        .finally(() => setIsLoading(false));
    } else {
      getOnChainReferendum(api, referendumIndex)
        .then(result => setVotes(result))
        .finally(() => setIsLoading(false));
    }
  }, [api, referendumIndex, passedHeight])

  return [isLoading, votes];
}
