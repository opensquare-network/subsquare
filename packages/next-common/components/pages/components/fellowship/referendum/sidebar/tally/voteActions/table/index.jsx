import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { memo, useMemo, useState, useCallback } from "react";
import useSearchVotes from "next-common/hooks/useSearchVotes";

import Table from "./table";

const useReferendumActions = () => {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions } = useQueryVoteActions(referendumIndex);
  return { loading, voteActions };
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

function VoteActionsTable({ search = "" }) {
  const { loading, voteActions = [] } = useReferendumActions();
  const maxImpactVotes = useMaxImpactVotes(voteActions);

  const [sortedColumn, setSortedColumn] = useState("");

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);

  const sortedVoteActions = useMemo(() => {
    if (sortedColumn === "Impact") {
      return [...filteredVoteActions].sort(
        (a, b) => b.data.vote.votes - a.data.vote.votes,
      );
    }
    return filteredVoteActions;
  }, [sortedColumn, filteredVoteActions]);

  return (
    <Table
      search={search}
      loading={loading}
      maxImpactVotes={maxImpactVotes}
      setSortedColumn={setSortedColumn}
      sortedVoteActions={sortedVoteActions}
      sortedColumn={sortedColumn}
    />
  );
}

export default memo(VoteActionsTable);
