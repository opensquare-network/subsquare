import useFellowshipReferendaActions from "../useFellowshipReferendaActions";
import { memo, useMemo, useState, useCallback } from "react";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import Table from "./table";

function VoteActionsTable({ search = "" }) {
  const { loading, voteActions } = useFellowshipReferendaActions();
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
      setSortedColumn={setSortedColumn}
      sortedVoteActions={sortedVoteActions}
      sortedColumn={sortedColumn}
    />
  );
}

export default memo(VoteActionsTable);
