import { useEffect } from "react";
import { getReferendumVotesByHeight } from "./passed";

export default function useVotes(api, referendumIndex, passedHeight) {
  useEffect(() => {
    if (!api) {
      return
    }

    if (passedHeight) {
      getReferendumVotesByHeight(api, passedHeight - 1, referendumIndex)
        .then(({ allAye, allNay }) => {
          console.log('allAye', allAye, 'allNay', allNay);
        })
      // todo: query legacy version, check `api.query.democracy.votingOf`
    } else {
      console.log('hello world')
      // todo: query the latest active votes
    }

  }, [api, passedHeight])
}
