import { useConditionalContextApi } from "next-common/context/migration/conditionalApi";
import useQueryVoteActions from "./useQueryVoteActions";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useFellowshipMembersRankState } from "./useActionMembersRank";

export default function useFellowshipReferendaActions() {
  const [rankMap] = useFellowshipMembersRankState();
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
          rank: rankMap[item.who] || null,
        };
      }),
    [maxImpactVotes, voteActions, rankMap],
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

export function useQueryFellowshipMemberRank(address) {
  const api = useConditionalContextApi();
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api?.query?.fellowshipCollective) {
      return;
    }
    setLoading(true);
    api.query.fellowshipCollective
      ?.members(address)
      .then((rank) => {
        setRank(rank.toJSON().rank);
      })
      .catch(() => {
        setRank(null);
      })
      .finally(() => setLoading(false));
  }, [api?.query?.fellowshipCollective, address]);

  return { rank, loading };
}
