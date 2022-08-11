import { useEffect, useState } from "react";
import getReferendumVotes from "./votes";
import { emptyVotes } from "next-common/utils/hooks/useVotes/passed/common";

export default function useVotes(api, referendumIndex, passedHeight) {
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState(emptyVotes)

  useEffect(() => {
    if (!api) {
      setIsLoading(false);
      return
    }

    setIsLoading(true)
    getReferendumVotes(api, referendumIndex, passedHeight)
      .then(result => setVotes(result))
      .finally(() => setIsLoading(false));
  }, [api, passedHeight, referendumIndex])

  return [isLoading, votes];
}
