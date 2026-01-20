import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import useVoteSearch from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/useVoteSearch";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { cn } from "next-common/utils";
import {
  DesktopTable as FellowshipActionsDesktopTable,
  MobileTable as FellowshipActionsMobileTable,
} from "next-common/components/pages/components/fellowship/referendum/sidebar/tally/voteActions/table";
import { useMemo, useCallback, useState } from "react";
import { useFellowshipReferendaActionsList } from "../context/fellowshipReferendaActionsContext";

export default function FellowshipActions() {
  const chain = useChain();
  const isCollectives = isCollectivesChain(chain);

  if (!isCollectives) {
    return null;
  }

  return <FellowshipActionsImpl />;
}

function FellowshipActionsImpl() {
  const { search, searchBtn, searchBar, showSearch } = useVoteSearch();
  const { voteActions, loading } = useFellowshipReferendaActionsList();

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);

  return (
    <div>
      <div className="w-full flex justify-between">
        <TitleContainer
          className={cn("!px-0 text14Bold", !showSearch && "mb-4")}
        >
          Actions
        </TitleContainer>
        {searchBtn}
      </div>
      {searchBar}
      <FellowshipActionsTable
        loading={loading}
        search={search}
        filteredVoteActions={filteredVoteActions}
      />
    </div>
  );
}

function FellowshipActionsTable({ search, filteredVoteActions, loading }) {
  const [sortedColumn, setSortedColumn] = useState("");

  const sortedVoteActions = useMemo(() => {
    if (sortedColumn === "Impact") {
      return [...filteredVoteActions].sort(
        (a, b) => b.data.vote.votes - a.data.vote.votes,
      );
    }
    return filteredVoteActions;
  }, [sortedColumn, filteredVoteActions]);

  return (
    <>
      <div className="max-md:hidden">
        <FellowshipActionsDesktopTable
          setSortedColumn={setSortedColumn}
          voteActions={sortedVoteActions}
          listKey={`desktop-${search}-${sortedColumn}`}
          loading={loading}
          listHeight={300}
        />
      </div>
      <div className="hidden max-md:block">
        <FellowshipActionsMobileTable
          voteActions={sortedVoteActions}
          loading={loading}
          listKey={`mobile-${search}-${sortedColumn}`}
          listHeight={300}
        />
      </div>
    </>
  );
}
