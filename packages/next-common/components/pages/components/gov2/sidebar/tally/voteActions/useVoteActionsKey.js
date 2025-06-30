import { useMemo } from "react";

export default function useVoteActionsKey(voteActions) {
  return useMemo(() => {
    return voteActions?.map((item) => item.who)?.join("-");
  }, [voteActions]);
}
