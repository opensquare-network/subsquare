import useQueryVoteActions from "./useQueryVoteActions";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function useFellowshipReferendaActions() {
  const router = useRouter();
  const { loading, voteActions = [] } = useQueryVoteActions(router.query.id);
  const maxImpactVotes = useMaxImpactVotes(voteActions);

  const data = useMemo(
    () =>
      voteActions.map((item) => {
        return {
          ...item,
          formatData: formatVoteActionData(item),
          maxImpactVotes,
        };
      }),
    [maxImpactVotes, voteActions],
  );
  return { loading, voteActions: data };
}

const formatVoteActionData = ({ type, who, data: { vote, preVote } }) => {
  const getActionName = () => {
    if (type !== 1) {
      return "";
    }
    if (preVote && preVote.isAye !== vote.isAye) {
      return "Change Vote";
    }
    return "Vote";
  };

  const getTally = () => {
    if (preVote && preVote.isAye === vote.isAye) {
      return 0;
    }
    return vote.votes;
  };

  return {
    account: who,
    actionName: getActionName(),
    isAye: vote.isAye,
    tally: getTally(),
  };
};

const useMaxImpactVotes = (voteActions) => {
  const maxImpactVotes = useMemo(
    () =>
      voteActions.reduce((result, item) => {
        if (!item.data.preVote) {
          return result + item.data.vote.votes;
        }
        return result;
      }, 0),
    [voteActions],
  );
  return maxImpactVotes;
};
