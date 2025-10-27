import { useContextApi } from "next-common/context/api";
import useQueryVoteActions from "./useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { useEffect, useMemo, useState, useCallback } from "react";

export default function useFellowshipReferendaActions() {
  const {
    loading,
    data: voteRankActions,
    maxImpactVotes,
  } = useFellowshipReferendaActionsWithRank();

  const data = useMemo(
    () =>
      voteRankActions.map((item) => {
        return {
          ...item,
          formatData: formatVoteActionData(item),
          maxImpactVotes,
        };
      }),
    [maxImpactVotes, voteRankActions],
  );
  return { loading: loading, voteActions: data };
}

function useFellowshipReferendaActionsWithRank() {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { referendumIndex } = useOnchainData();

  const { loading: sourceLoading, voteActions = [] } =
    useQueryVoteActions(referendumIndex);
  const maxImpactVotes = useMaxImpactVotes(voteActions);

  const fetchMemberRanks = useCallback(
    async (actions) => {
      if (!api || !actions.length) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const rankedActions = await Promise.all(
        actions.map(async (item) => {
          const rank = await api.query.fellowshipCollective
            .members(item.who)
            .then((rank) => {
              return rank.toJSON()?.rank;
            })
            .catch(() => null);
          return {
            ...item,
            rank,
          };
        }),
      ).finally(() => {
        setLoading(false);
      });
      setData(rankedActions);
    },
    [api],
  );

  useEffect(() => {
    fetchMemberRanks(voteActions);
  }, [fetchMemberRanks, voteActions]);

  return {
    loading: loading || sourceLoading,
    data,
    maxImpactVotes,
  };
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
