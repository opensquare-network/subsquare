import nextApi from "next-common/services/nextApi";
import { useEffect, useState } from "react";

export default function useVotesFromServer(referendumIndex) {
  const [votes, setVotes] = useState();

  useEffect(() => {
    nextApi.fetch(`gov2/referenda/${ referendumIndex }/votes`).then(({ result: votes }) => setVotes(votes));
  }, [referendumIndex])

  useEffect(() => {
    if (!votes) {
      return
    }

    // todo: normalize and save them to redux
  }, [votes])
}
