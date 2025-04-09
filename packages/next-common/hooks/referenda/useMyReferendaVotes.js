import { flatten } from "lodash-es";
import {
  isLoadingReferendaVotingSelector,
  myReferendaVotingSelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function useMyReferendaVotes() {
  const voting = useSelector(myReferendaVotingSelector);
  const isLoading = useSelector(isLoadingReferendaVotingSelector);
  const myVotedReferenda = useMemo(() => {
    return flatten(
      voting.map((item) =>
        (item.votes || []).map((vote) => vote.referendumIndex),
      ),
    );
  }, [voting]);
  return {
    myVotedReferenda,
    isLoading,
  };
}
