import { useMemo } from "react";
import { isSameAddress } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useCollectivesReferendaVotes from "./useCollectivesReferendaVotes";

export function useFilterMyVotes(votes) {
  const address = useRealAddress();
  return useMemo(
    () => (votes || []).filter(({ voter }) => isSameAddress(voter, address)),
    [votes, address],
  );
}

export default function useMyVotedCollectiveReferenda() {
  const { votes: allVotes, isLoading } = useCollectivesReferendaVotes();
  const myVotes = useFilterMyVotes(allVotes);
  const myVotedReferenda = useMemo(
    () => (myVotes || []).map(({ referendumIndex }) => referendumIndex),
    [myVotes],
  );
  return { myVotedReferenda, isLoading };
}
